package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.SoldeComptable;
import com.edefence.ecompta.repository.SoldeComptableRepository;
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
 * Integration tests for the {@link SoldeComptableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SoldeComptableResourceIT {

    private static final Long DEFAULT_SOLDE = 1L;
    private static final Long UPDATED_SOLDE = 2L;

    private static final String ENTITY_API_URL = "/api/solde-comptables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SoldeComptableRepository soldeComptableRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSoldeComptableMockMvc;

    private SoldeComptable soldeComptable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SoldeComptable createEntity(EntityManager em) {
        SoldeComptable soldeComptable = new SoldeComptable().solde(DEFAULT_SOLDE);
        return soldeComptable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SoldeComptable createUpdatedEntity(EntityManager em) {
        SoldeComptable soldeComptable = new SoldeComptable().solde(UPDATED_SOLDE);
        return soldeComptable;
    }

    @BeforeEach
    public void initTest() {
        soldeComptable = createEntity(em);
    }

    @Test
    @Transactional
    void createSoldeComptable() throws Exception {
        int databaseSizeBeforeCreate = soldeComptableRepository.findAll().size();
        // Create the SoldeComptable
        restSoldeComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soldeComptable))
            )
            .andExpect(status().isCreated());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeCreate + 1);
        SoldeComptable testSoldeComptable = soldeComptableList.get(soldeComptableList.size() - 1);
        assertThat(testSoldeComptable.getSolde()).isEqualTo(DEFAULT_SOLDE);
    }

    @Test
    @Transactional
    void createSoldeComptableWithExistingId() throws Exception {
        // Create the SoldeComptable with an existing ID
        soldeComptable.setId(1L);

        int databaseSizeBeforeCreate = soldeComptableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSoldeComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soldeComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSoldeComptables() throws Exception {
        // Initialize the database
        soldeComptableRepository.saveAndFlush(soldeComptable);

        // Get all the soldeComptableList
        restSoldeComptableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(soldeComptable.getId().intValue())))
            .andExpect(jsonPath("$.[*].solde").value(hasItem(DEFAULT_SOLDE.intValue())));
    }

    @Test
    @Transactional
    void getSoldeComptable() throws Exception {
        // Initialize the database
        soldeComptableRepository.saveAndFlush(soldeComptable);

        // Get the soldeComptable
        restSoldeComptableMockMvc
            .perform(get(ENTITY_API_URL_ID, soldeComptable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(soldeComptable.getId().intValue()))
            .andExpect(jsonPath("$.solde").value(DEFAULT_SOLDE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingSoldeComptable() throws Exception {
        // Get the soldeComptable
        restSoldeComptableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSoldeComptable() throws Exception {
        // Initialize the database
        soldeComptableRepository.saveAndFlush(soldeComptable);

        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();

        // Update the soldeComptable
        SoldeComptable updatedSoldeComptable = soldeComptableRepository.findById(soldeComptable.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSoldeComptable are not directly saved in db
        em.detach(updatedSoldeComptable);
        updatedSoldeComptable.solde(UPDATED_SOLDE);

        restSoldeComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSoldeComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSoldeComptable))
            )
            .andExpect(status().isOk());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
        SoldeComptable testSoldeComptable = soldeComptableList.get(soldeComptableList.size() - 1);
        assertThat(testSoldeComptable.getSolde()).isEqualTo(UPDATED_SOLDE);
    }

    @Test
    @Transactional
    void putNonExistingSoldeComptable() throws Exception {
        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();
        soldeComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSoldeComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, soldeComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(soldeComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSoldeComptable() throws Exception {
        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();
        soldeComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoldeComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(soldeComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSoldeComptable() throws Exception {
        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();
        soldeComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoldeComptableMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soldeComptable)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSoldeComptableWithPatch() throws Exception {
        // Initialize the database
        soldeComptableRepository.saveAndFlush(soldeComptable);

        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();

        // Update the soldeComptable using partial update
        SoldeComptable partialUpdatedSoldeComptable = new SoldeComptable();
        partialUpdatedSoldeComptable.setId(soldeComptable.getId());

        restSoldeComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSoldeComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSoldeComptable))
            )
            .andExpect(status().isOk());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
        SoldeComptable testSoldeComptable = soldeComptableList.get(soldeComptableList.size() - 1);
        assertThat(testSoldeComptable.getSolde()).isEqualTo(DEFAULT_SOLDE);
    }

    @Test
    @Transactional
    void fullUpdateSoldeComptableWithPatch() throws Exception {
        // Initialize the database
        soldeComptableRepository.saveAndFlush(soldeComptable);

        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();

        // Update the soldeComptable using partial update
        SoldeComptable partialUpdatedSoldeComptable = new SoldeComptable();
        partialUpdatedSoldeComptable.setId(soldeComptable.getId());

        partialUpdatedSoldeComptable.solde(UPDATED_SOLDE);

        restSoldeComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSoldeComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSoldeComptable))
            )
            .andExpect(status().isOk());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
        SoldeComptable testSoldeComptable = soldeComptableList.get(soldeComptableList.size() - 1);
        assertThat(testSoldeComptable.getSolde()).isEqualTo(UPDATED_SOLDE);
    }

    @Test
    @Transactional
    void patchNonExistingSoldeComptable() throws Exception {
        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();
        soldeComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSoldeComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, soldeComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(soldeComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSoldeComptable() throws Exception {
        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();
        soldeComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoldeComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(soldeComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSoldeComptable() throws Exception {
        int databaseSizeBeforeUpdate = soldeComptableRepository.findAll().size();
        soldeComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoldeComptableMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(soldeComptable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SoldeComptable in the database
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSoldeComptable() throws Exception {
        // Initialize the database
        soldeComptableRepository.saveAndFlush(soldeComptable);

        int databaseSizeBeforeDelete = soldeComptableRepository.findAll().size();

        // Delete the soldeComptable
        restSoldeComptableMockMvc
            .perform(delete(ENTITY_API_URL_ID, soldeComptable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SoldeComptable> soldeComptableList = soldeComptableRepository.findAll();
        assertThat(soldeComptableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
