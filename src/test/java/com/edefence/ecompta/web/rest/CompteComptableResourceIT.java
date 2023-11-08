package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.CompteComptable;
import com.edefence.ecompta.repository.CompteComptableRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link CompteComptableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompteComptableResourceIT {

    private static final Long DEFAULT_NUMERO = 1L;
    private static final Long UPDATED_NUMERO = 2L;

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/compte-comptables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompteComptableRepository compteComptableRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompteComptableMockMvc;

    private CompteComptable compteComptable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompteComptable createEntity(EntityManager em) {
        CompteComptable compteComptable = new CompteComptable().numero(DEFAULT_NUMERO).nom(DEFAULT_NOM).description(DEFAULT_DESCRIPTION);
        return compteComptable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompteComptable createUpdatedEntity(EntityManager em) {
        CompteComptable compteComptable = new CompteComptable().numero(UPDATED_NUMERO).nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);
        return compteComptable;
    }

    @BeforeEach
    public void initTest() {
        compteComptable = createEntity(em);
    }

    @Test
    @Transactional
    void createCompteComptable() throws Exception {
        int databaseSizeBeforeCreate = compteComptableRepository.findAll().size();
        // Create the CompteComptable
        restCompteComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isCreated());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeCreate + 1);
        CompteComptable testCompteComptable = compteComptableList.get(compteComptableList.size() - 1);
        assertThat(testCompteComptable.getNumero()).isEqualTo(DEFAULT_NUMERO);
        assertThat(testCompteComptable.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testCompteComptable.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createCompteComptableWithExistingId() throws Exception {
        // Create the CompteComptable with an existing ID
        compteComptable.setId(1L);

        int databaseSizeBeforeCreate = compteComptableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompteComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = compteComptableRepository.findAll().size();
        // set the field null
        compteComptable.setNom(null);

        // Create the CompteComptable, which fails.

        restCompteComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isBadRequest());

        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCompteComptables() throws Exception {
        // Initialize the database
        compteComptableRepository.saveAndFlush(compteComptable);

        // Get all the compteComptableList
        restCompteComptableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(compteComptable.getId().intValue())))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO.intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getCompteComptable() throws Exception {
        // Initialize the database
        compteComptableRepository.saveAndFlush(compteComptable);

        // Get the compteComptable
        restCompteComptableMockMvc
            .perform(get(ENTITY_API_URL_ID, compteComptable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(compteComptable.getId().intValue()))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO.intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingCompteComptable() throws Exception {
        // Get the compteComptable
        restCompteComptableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompteComptable() throws Exception {
        // Initialize the database
        compteComptableRepository.saveAndFlush(compteComptable);

        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();

        // Update the compteComptable
        CompteComptable updatedCompteComptable = compteComptableRepository.findById(compteComptable.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCompteComptable are not directly saved in db
        em.detach(updatedCompteComptable);
        updatedCompteComptable.numero(UPDATED_NUMERO).nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);

        restCompteComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompteComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompteComptable))
            )
            .andExpect(status().isOk());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
        CompteComptable testCompteComptable = compteComptableList.get(compteComptableList.size() - 1);
        assertThat(testCompteComptable.getNumero()).isEqualTo(UPDATED_NUMERO);
        assertThat(testCompteComptable.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteComptable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingCompteComptable() throws Exception {
        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();
        compteComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompteComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, compteComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompteComptable() throws Exception {
        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();
        compteComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompteComptable() throws Exception {
        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();
        compteComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteComptableMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompteComptableWithPatch() throws Exception {
        // Initialize the database
        compteComptableRepository.saveAndFlush(compteComptable);

        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();

        // Update the compteComptable using partial update
        CompteComptable partialUpdatedCompteComptable = new CompteComptable();
        partialUpdatedCompteComptable.setId(compteComptable.getId());

        partialUpdatedCompteComptable.numero(UPDATED_NUMERO).nom(UPDATED_NOM);

        restCompteComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompteComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompteComptable))
            )
            .andExpect(status().isOk());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
        CompteComptable testCompteComptable = compteComptableList.get(compteComptableList.size() - 1);
        assertThat(testCompteComptable.getNumero()).isEqualTo(UPDATED_NUMERO);
        assertThat(testCompteComptable.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteComptable.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateCompteComptableWithPatch() throws Exception {
        // Initialize the database
        compteComptableRepository.saveAndFlush(compteComptable);

        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();

        // Update the compteComptable using partial update
        CompteComptable partialUpdatedCompteComptable = new CompteComptable();
        partialUpdatedCompteComptable.setId(compteComptable.getId());

        partialUpdatedCompteComptable.numero(UPDATED_NUMERO).nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);

        restCompteComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompteComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompteComptable))
            )
            .andExpect(status().isOk());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
        CompteComptable testCompteComptable = compteComptableList.get(compteComptableList.size() - 1);
        assertThat(testCompteComptable.getNumero()).isEqualTo(UPDATED_NUMERO);
        assertThat(testCompteComptable.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteComptable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingCompteComptable() throws Exception {
        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();
        compteComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompteComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, compteComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompteComptable() throws Exception {
        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();
        compteComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompteComptable() throws Exception {
        int databaseSizeBeforeUpdate = compteComptableRepository.findAll().size();
        compteComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteComptableMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteComptable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompteComptable in the database
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompteComptable() throws Exception {
        // Initialize the database
        compteComptableRepository.saveAndFlush(compteComptable);

        int databaseSizeBeforeDelete = compteComptableRepository.findAll().size();

        // Delete the compteComptable
        restCompteComptableMockMvc
            .perform(delete(ENTITY_API_URL_ID, compteComptable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompteComptable> compteComptableList = compteComptableRepository.findAll();
        assertThat(compteComptableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
