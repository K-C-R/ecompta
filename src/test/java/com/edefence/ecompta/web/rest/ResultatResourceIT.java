package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.Resultat;
import com.edefence.ecompta.repository.ResultatRepository;
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
 * Integration tests for the {@link ResultatResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ResultatResourceIT {

    private static final Instant DEFAULT_EXERCICE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXERCICE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_RESULTAT_NET = 1L;
    private static final Long UPDATED_RESULTAT_NET = 2L;

    private static final String ENTITY_API_URL = "/api/resultats";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ResultatRepository resultatRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResultatMockMvc;

    private Resultat resultat;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Resultat createEntity(EntityManager em) {
        Resultat resultat = new Resultat().exercice(DEFAULT_EXERCICE).resultatNet(DEFAULT_RESULTAT_NET);
        return resultat;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Resultat createUpdatedEntity(EntityManager em) {
        Resultat resultat = new Resultat().exercice(UPDATED_EXERCICE).resultatNet(UPDATED_RESULTAT_NET);
        return resultat;
    }

    @BeforeEach
    public void initTest() {
        resultat = createEntity(em);
    }

    @Test
    @Transactional
    void createResultat() throws Exception {
        int databaseSizeBeforeCreate = resultatRepository.findAll().size();
        // Create the Resultat
        restResultatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resultat)))
            .andExpect(status().isCreated());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeCreate + 1);
        Resultat testResultat = resultatList.get(resultatList.size() - 1);
        assertThat(testResultat.getExercice()).isEqualTo(DEFAULT_EXERCICE);
        assertThat(testResultat.getResultatNet()).isEqualTo(DEFAULT_RESULTAT_NET);
    }

    @Test
    @Transactional
    void createResultatWithExistingId() throws Exception {
        // Create the Resultat with an existing ID
        resultat.setId(1L);

        int databaseSizeBeforeCreate = resultatRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restResultatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resultat)))
            .andExpect(status().isBadRequest());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllResultats() throws Exception {
        // Initialize the database
        resultatRepository.saveAndFlush(resultat);

        // Get all the resultatList
        restResultatMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resultat.getId().intValue())))
            .andExpect(jsonPath("$.[*].exercice").value(hasItem(DEFAULT_EXERCICE.toString())))
            .andExpect(jsonPath("$.[*].resultatNet").value(hasItem(DEFAULT_RESULTAT_NET.intValue())));
    }

    @Test
    @Transactional
    void getResultat() throws Exception {
        // Initialize the database
        resultatRepository.saveAndFlush(resultat);

        // Get the resultat
        restResultatMockMvc
            .perform(get(ENTITY_API_URL_ID, resultat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resultat.getId().intValue()))
            .andExpect(jsonPath("$.exercice").value(DEFAULT_EXERCICE.toString()))
            .andExpect(jsonPath("$.resultatNet").value(DEFAULT_RESULTAT_NET.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingResultat() throws Exception {
        // Get the resultat
        restResultatMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingResultat() throws Exception {
        // Initialize the database
        resultatRepository.saveAndFlush(resultat);

        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();

        // Update the resultat
        Resultat updatedResultat = resultatRepository.findById(resultat.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedResultat are not directly saved in db
        em.detach(updatedResultat);
        updatedResultat.exercice(UPDATED_EXERCICE).resultatNet(UPDATED_RESULTAT_NET);

        restResultatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedResultat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedResultat))
            )
            .andExpect(status().isOk());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
        Resultat testResultat = resultatList.get(resultatList.size() - 1);
        assertThat(testResultat.getExercice()).isEqualTo(UPDATED_EXERCICE);
        assertThat(testResultat.getResultatNet()).isEqualTo(UPDATED_RESULTAT_NET);
    }

    @Test
    @Transactional
    void putNonExistingResultat() throws Exception {
        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();
        resultat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResultatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, resultat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchResultat() throws Exception {
        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();
        resultat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResultatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamResultat() throws Exception {
        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();
        resultat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResultatMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resultat)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateResultatWithPatch() throws Exception {
        // Initialize the database
        resultatRepository.saveAndFlush(resultat);

        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();

        // Update the resultat using partial update
        Resultat partialUpdatedResultat = new Resultat();
        partialUpdatedResultat.setId(resultat.getId());

        restResultatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResultat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResultat))
            )
            .andExpect(status().isOk());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
        Resultat testResultat = resultatList.get(resultatList.size() - 1);
        assertThat(testResultat.getExercice()).isEqualTo(DEFAULT_EXERCICE);
        assertThat(testResultat.getResultatNet()).isEqualTo(DEFAULT_RESULTAT_NET);
    }

    @Test
    @Transactional
    void fullUpdateResultatWithPatch() throws Exception {
        // Initialize the database
        resultatRepository.saveAndFlush(resultat);

        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();

        // Update the resultat using partial update
        Resultat partialUpdatedResultat = new Resultat();
        partialUpdatedResultat.setId(resultat.getId());

        partialUpdatedResultat.exercice(UPDATED_EXERCICE).resultatNet(UPDATED_RESULTAT_NET);

        restResultatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResultat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResultat))
            )
            .andExpect(status().isOk());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
        Resultat testResultat = resultatList.get(resultatList.size() - 1);
        assertThat(testResultat.getExercice()).isEqualTo(UPDATED_EXERCICE);
        assertThat(testResultat.getResultatNet()).isEqualTo(UPDATED_RESULTAT_NET);
    }

    @Test
    @Transactional
    void patchNonExistingResultat() throws Exception {
        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();
        resultat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResultatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, resultat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchResultat() throws Exception {
        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();
        resultat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResultatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resultat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamResultat() throws Exception {
        int databaseSizeBeforeUpdate = resultatRepository.findAll().size();
        resultat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResultatMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(resultat)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Resultat in the database
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteResultat() throws Exception {
        // Initialize the database
        resultatRepository.saveAndFlush(resultat);

        int databaseSizeBeforeDelete = resultatRepository.findAll().size();

        // Delete the resultat
        restResultatMockMvc
            .perform(delete(ENTITY_API_URL_ID, resultat.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Resultat> resultatList = resultatRepository.findAll();
        assertThat(resultatList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
