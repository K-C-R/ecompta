package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.CompteDeResultat;
import com.edefence.ecompta.repository.CompteDeResultatRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CompteDeResultatResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompteDeResultatResourceIT {

    private static final Instant DEFAULT_EXERCICE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXERCICE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_PRODUITS_TOTAL = 1L;
    private static final Long UPDATED_PRODUITS_TOTAL = 2L;

    private static final Long DEFAULT_CHARGES_TOTAL = 1L;
    private static final Long UPDATED_CHARGES_TOTAL = 2L;

    private static final Long DEFAULT_RESULTAT_NET = 1L;
    private static final Long UPDATED_RESULTAT_NET = 2L;

    private static final String ENTITY_API_URL = "/api/compte-de-resultats";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompteDeResultatRepository compteDeResultatRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompteDeResultatMockMvc;

    private CompteDeResultat compteDeResultat;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompteDeResultat createEntity(EntityManager em) {
        CompteDeResultat compteDeResultat = new CompteDeResultat()
            .exercice(DEFAULT_EXERCICE)
            .produitsTotal(DEFAULT_PRODUITS_TOTAL)
            .chargesTotal(DEFAULT_CHARGES_TOTAL)
            .resultatNet(DEFAULT_RESULTAT_NET);
        return compteDeResultat;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompteDeResultat createUpdatedEntity(EntityManager em) {
        CompteDeResultat compteDeResultat = new CompteDeResultat()
            .exercice(UPDATED_EXERCICE)
            .produitsTotal(UPDATED_PRODUITS_TOTAL)
            .chargesTotal(UPDATED_CHARGES_TOTAL)
            .resultatNet(UPDATED_RESULTAT_NET);
        return compteDeResultat;
    }

    @BeforeEach
    public void initTest() {
        compteDeResultat = createEntity(em);
    }

    @Test
    @Transactional
    void createCompteDeResultat() throws Exception {
        int databaseSizeBeforeCreate = compteDeResultatRepository.findAll().size();
        // Create the CompteDeResultat
        restCompteDeResultatMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteDeResultat))
            )
            .andExpect(status().isCreated());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeCreate + 1);
        CompteDeResultat testCompteDeResultat = compteDeResultatList.get(compteDeResultatList.size() - 1);
        assertThat(testCompteDeResultat.getExercice()).isEqualTo(DEFAULT_EXERCICE);
        assertThat(testCompteDeResultat.getProduitsTotal()).isEqualTo(DEFAULT_PRODUITS_TOTAL);
        assertThat(testCompteDeResultat.getChargesTotal()).isEqualTo(DEFAULT_CHARGES_TOTAL);
        assertThat(testCompteDeResultat.getResultatNet()).isEqualTo(DEFAULT_RESULTAT_NET);
    }

    @Test
    @Transactional
    void createCompteDeResultatWithExistingId() throws Exception {
        // Create the CompteDeResultat with an existing ID
        compteDeResultat.setId(1L);

        int databaseSizeBeforeCreate = compteDeResultatRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompteDeResultatMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteDeResultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompteDeResultats() throws Exception {
        // Initialize the database
        compteDeResultatRepository.saveAndFlush(compteDeResultat);

        // Get all the compteDeResultatList
        restCompteDeResultatMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(compteDeResultat.getId().intValue())))
            .andExpect(jsonPath("$.[*].exercice").value(hasItem(DEFAULT_EXERCICE.toString())))
            .andExpect(jsonPath("$.[*].produitsTotal").value(hasItem(DEFAULT_PRODUITS_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].chargesTotal").value(hasItem(DEFAULT_CHARGES_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].resultatNet").value(hasItem(DEFAULT_RESULTAT_NET.intValue())));
    }

    @Test
    @Transactional
    void getCompteDeResultat() throws Exception {
        // Initialize the database
        compteDeResultatRepository.saveAndFlush(compteDeResultat);

        // Get the compteDeResultat
        restCompteDeResultatMockMvc
            .perform(get(ENTITY_API_URL_ID, compteDeResultat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(compteDeResultat.getId().intValue()))
            .andExpect(jsonPath("$.exercice").value(DEFAULT_EXERCICE.toString()))
            .andExpect(jsonPath("$.produitsTotal").value(DEFAULT_PRODUITS_TOTAL.intValue()))
            .andExpect(jsonPath("$.chargesTotal").value(DEFAULT_CHARGES_TOTAL.intValue()))
            .andExpect(jsonPath("$.resultatNet").value(DEFAULT_RESULTAT_NET.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingCompteDeResultat() throws Exception {
        // Get the compteDeResultat
        restCompteDeResultatMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompteDeResultat() throws Exception {
        // Initialize the database
        compteDeResultatRepository.saveAndFlush(compteDeResultat);

        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();

        // Update the compteDeResultat
        CompteDeResultat updatedCompteDeResultat = compteDeResultatRepository.findById(compteDeResultat.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCompteDeResultat are not directly saved in db
        em.detach(updatedCompteDeResultat);
        updatedCompteDeResultat
            .exercice(UPDATED_EXERCICE)
            .produitsTotal(UPDATED_PRODUITS_TOTAL)
            .chargesTotal(UPDATED_CHARGES_TOTAL)
            .resultatNet(UPDATED_RESULTAT_NET);

        restCompteDeResultatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompteDeResultat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompteDeResultat))
            )
            .andExpect(status().isOk());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
        CompteDeResultat testCompteDeResultat = compteDeResultatList.get(compteDeResultatList.size() - 1);
        assertThat(testCompteDeResultat.getExercice()).isEqualTo(UPDATED_EXERCICE);
        assertThat(testCompteDeResultat.getProduitsTotal()).isEqualTo(UPDATED_PRODUITS_TOTAL);
        assertThat(testCompteDeResultat.getChargesTotal()).isEqualTo(UPDATED_CHARGES_TOTAL);
        assertThat(testCompteDeResultat.getResultatNet()).isEqualTo(UPDATED_RESULTAT_NET);
    }

    @Test
    @Transactional
    void putNonExistingCompteDeResultat() throws Exception {
        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();
        compteDeResultat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompteDeResultatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, compteDeResultat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compteDeResultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompteDeResultat() throws Exception {
        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();
        compteDeResultat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteDeResultatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compteDeResultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompteDeResultat() throws Exception {
        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();
        compteDeResultat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteDeResultatMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteDeResultat))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompteDeResultatWithPatch() throws Exception {
        // Initialize the database
        compteDeResultatRepository.saveAndFlush(compteDeResultat);

        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();

        // Update the compteDeResultat using partial update
        CompteDeResultat partialUpdatedCompteDeResultat = new CompteDeResultat();
        partialUpdatedCompteDeResultat.setId(compteDeResultat.getId());

        partialUpdatedCompteDeResultat.exercice(UPDATED_EXERCICE);

        restCompteDeResultatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompteDeResultat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompteDeResultat))
            )
            .andExpect(status().isOk());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
        CompteDeResultat testCompteDeResultat = compteDeResultatList.get(compteDeResultatList.size() - 1);
        assertThat(testCompteDeResultat.getExercice()).isEqualTo(UPDATED_EXERCICE);
        assertThat(testCompteDeResultat.getProduitsTotal()).isEqualTo(DEFAULT_PRODUITS_TOTAL);
        assertThat(testCompteDeResultat.getChargesTotal()).isEqualTo(DEFAULT_CHARGES_TOTAL);
        assertThat(testCompteDeResultat.getResultatNet()).isEqualTo(DEFAULT_RESULTAT_NET);
    }

    @Test
    @Transactional
    void fullUpdateCompteDeResultatWithPatch() throws Exception {
        // Initialize the database
        compteDeResultatRepository.saveAndFlush(compteDeResultat);

        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();

        // Update the compteDeResultat using partial update
        CompteDeResultat partialUpdatedCompteDeResultat = new CompteDeResultat();
        partialUpdatedCompteDeResultat.setId(compteDeResultat.getId());

        partialUpdatedCompteDeResultat
            .exercice(UPDATED_EXERCICE)
            .produitsTotal(UPDATED_PRODUITS_TOTAL)
            .chargesTotal(UPDATED_CHARGES_TOTAL)
            .resultatNet(UPDATED_RESULTAT_NET);

        restCompteDeResultatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompteDeResultat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompteDeResultat))
            )
            .andExpect(status().isOk());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
        CompteDeResultat testCompteDeResultat = compteDeResultatList.get(compteDeResultatList.size() - 1);
        assertThat(testCompteDeResultat.getExercice()).isEqualTo(UPDATED_EXERCICE);
        assertThat(testCompteDeResultat.getProduitsTotal()).isEqualTo(UPDATED_PRODUITS_TOTAL);
        assertThat(testCompteDeResultat.getChargesTotal()).isEqualTo(UPDATED_CHARGES_TOTAL);
        assertThat(testCompteDeResultat.getResultatNet()).isEqualTo(UPDATED_RESULTAT_NET);
    }

    @Test
    @Transactional
    void patchNonExistingCompteDeResultat() throws Exception {
        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();
        compteDeResultat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompteDeResultatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, compteDeResultat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteDeResultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompteDeResultat() throws Exception {
        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();
        compteDeResultat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteDeResultatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteDeResultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompteDeResultat() throws Exception {
        int databaseSizeBeforeUpdate = compteDeResultatRepository.findAll().size();
        compteDeResultat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteDeResultatMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteDeResultat))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompteDeResultat in the database
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompteDeResultat() throws Exception {
        // Initialize the database
        compteDeResultatRepository.saveAndFlush(compteDeResultat);

        int databaseSizeBeforeDelete = compteDeResultatRepository.findAll().size();

        // Delete the compteDeResultat
        restCompteDeResultatMockMvc
            .perform(delete(ENTITY_API_URL_ID, compteDeResultat.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompteDeResultat> compteDeResultatList = compteDeResultatRepository.findAll();
        assertThat(compteDeResultatList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
