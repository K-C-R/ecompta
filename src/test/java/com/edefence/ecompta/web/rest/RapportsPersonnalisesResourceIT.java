package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.RapportsPersonnalises;
import com.edefence.ecompta.repository.RapportsPersonnalisesRepository;
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
 * Integration tests for the {@link RapportsPersonnalisesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RapportsPersonnalisesResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENU = "AAAAAAAAAA";
    private static final String UPDATED_CONTENU = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/rapports-personnalises";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RapportsPersonnalisesRepository rapportsPersonnalisesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRapportsPersonnalisesMockMvc;

    private RapportsPersonnalises rapportsPersonnalises;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RapportsPersonnalises createEntity(EntityManager em) {
        RapportsPersonnalises rapportsPersonnalises = new RapportsPersonnalises()
            .nom(DEFAULT_NOM)
            .description(DEFAULT_DESCRIPTION)
            .contenu(DEFAULT_CONTENU);
        return rapportsPersonnalises;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RapportsPersonnalises createUpdatedEntity(EntityManager em) {
        RapportsPersonnalises rapportsPersonnalises = new RapportsPersonnalises()
            .nom(UPDATED_NOM)
            .description(UPDATED_DESCRIPTION)
            .contenu(UPDATED_CONTENU);
        return rapportsPersonnalises;
    }

    @BeforeEach
    public void initTest() {
        rapportsPersonnalises = createEntity(em);
    }

    @Test
    @Transactional
    void createRapportsPersonnalises() throws Exception {
        int databaseSizeBeforeCreate = rapportsPersonnalisesRepository.findAll().size();
        // Create the RapportsPersonnalises
        restRapportsPersonnalisesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rapportsPersonnalises))
            )
            .andExpect(status().isCreated());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeCreate + 1);
        RapportsPersonnalises testRapportsPersonnalises = rapportsPersonnalisesList.get(rapportsPersonnalisesList.size() - 1);
        assertThat(testRapportsPersonnalises.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testRapportsPersonnalises.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testRapportsPersonnalises.getContenu()).isEqualTo(DEFAULT_CONTENU);
    }

    @Test
    @Transactional
    void createRapportsPersonnalisesWithExistingId() throws Exception {
        // Create the RapportsPersonnalises with an existing ID
        rapportsPersonnalises.setId(1L);

        int databaseSizeBeforeCreate = rapportsPersonnalisesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRapportsPersonnalisesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rapportsPersonnalises))
            )
            .andExpect(status().isBadRequest());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRapportsPersonnalises() throws Exception {
        // Initialize the database
        rapportsPersonnalisesRepository.saveAndFlush(rapportsPersonnalises);

        // Get all the rapportsPersonnalisesList
        restRapportsPersonnalisesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rapportsPersonnalises.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].contenu").value(hasItem(DEFAULT_CONTENU)));
    }

    @Test
    @Transactional
    void getRapportsPersonnalises() throws Exception {
        // Initialize the database
        rapportsPersonnalisesRepository.saveAndFlush(rapportsPersonnalises);

        // Get the rapportsPersonnalises
        restRapportsPersonnalisesMockMvc
            .perform(get(ENTITY_API_URL_ID, rapportsPersonnalises.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rapportsPersonnalises.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.contenu").value(DEFAULT_CONTENU));
    }

    @Test
    @Transactional
    void getNonExistingRapportsPersonnalises() throws Exception {
        // Get the rapportsPersonnalises
        restRapportsPersonnalisesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRapportsPersonnalises() throws Exception {
        // Initialize the database
        rapportsPersonnalisesRepository.saveAndFlush(rapportsPersonnalises);

        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();

        // Update the rapportsPersonnalises
        RapportsPersonnalises updatedRapportsPersonnalises = rapportsPersonnalisesRepository
            .findById(rapportsPersonnalises.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedRapportsPersonnalises are not directly saved in db
        em.detach(updatedRapportsPersonnalises);
        updatedRapportsPersonnalises.nom(UPDATED_NOM).description(UPDATED_DESCRIPTION).contenu(UPDATED_CONTENU);

        restRapportsPersonnalisesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRapportsPersonnalises.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRapportsPersonnalises))
            )
            .andExpect(status().isOk());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
        RapportsPersonnalises testRapportsPersonnalises = rapportsPersonnalisesList.get(rapportsPersonnalisesList.size() - 1);
        assertThat(testRapportsPersonnalises.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testRapportsPersonnalises.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRapportsPersonnalises.getContenu()).isEqualTo(UPDATED_CONTENU);
    }

    @Test
    @Transactional
    void putNonExistingRapportsPersonnalises() throws Exception {
        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();
        rapportsPersonnalises.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRapportsPersonnalisesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rapportsPersonnalises.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rapportsPersonnalises))
            )
            .andExpect(status().isBadRequest());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRapportsPersonnalises() throws Exception {
        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();
        rapportsPersonnalises.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRapportsPersonnalisesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rapportsPersonnalises))
            )
            .andExpect(status().isBadRequest());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRapportsPersonnalises() throws Exception {
        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();
        rapportsPersonnalises.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRapportsPersonnalisesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rapportsPersonnalises))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRapportsPersonnalisesWithPatch() throws Exception {
        // Initialize the database
        rapportsPersonnalisesRepository.saveAndFlush(rapportsPersonnalises);

        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();

        // Update the rapportsPersonnalises using partial update
        RapportsPersonnalises partialUpdatedRapportsPersonnalises = new RapportsPersonnalises();
        partialUpdatedRapportsPersonnalises.setId(rapportsPersonnalises.getId());

        restRapportsPersonnalisesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRapportsPersonnalises.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRapportsPersonnalises))
            )
            .andExpect(status().isOk());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
        RapportsPersonnalises testRapportsPersonnalises = rapportsPersonnalisesList.get(rapportsPersonnalisesList.size() - 1);
        assertThat(testRapportsPersonnalises.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testRapportsPersonnalises.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testRapportsPersonnalises.getContenu()).isEqualTo(DEFAULT_CONTENU);
    }

    @Test
    @Transactional
    void fullUpdateRapportsPersonnalisesWithPatch() throws Exception {
        // Initialize the database
        rapportsPersonnalisesRepository.saveAndFlush(rapportsPersonnalises);

        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();

        // Update the rapportsPersonnalises using partial update
        RapportsPersonnalises partialUpdatedRapportsPersonnalises = new RapportsPersonnalises();
        partialUpdatedRapportsPersonnalises.setId(rapportsPersonnalises.getId());

        partialUpdatedRapportsPersonnalises.nom(UPDATED_NOM).description(UPDATED_DESCRIPTION).contenu(UPDATED_CONTENU);

        restRapportsPersonnalisesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRapportsPersonnalises.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRapportsPersonnalises))
            )
            .andExpect(status().isOk());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
        RapportsPersonnalises testRapportsPersonnalises = rapportsPersonnalisesList.get(rapportsPersonnalisesList.size() - 1);
        assertThat(testRapportsPersonnalises.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testRapportsPersonnalises.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRapportsPersonnalises.getContenu()).isEqualTo(UPDATED_CONTENU);
    }

    @Test
    @Transactional
    void patchNonExistingRapportsPersonnalises() throws Exception {
        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();
        rapportsPersonnalises.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRapportsPersonnalisesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rapportsPersonnalises.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rapportsPersonnalises))
            )
            .andExpect(status().isBadRequest());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRapportsPersonnalises() throws Exception {
        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();
        rapportsPersonnalises.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRapportsPersonnalisesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rapportsPersonnalises))
            )
            .andExpect(status().isBadRequest());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRapportsPersonnalises() throws Exception {
        int databaseSizeBeforeUpdate = rapportsPersonnalisesRepository.findAll().size();
        rapportsPersonnalises.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRapportsPersonnalisesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rapportsPersonnalises))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RapportsPersonnalises in the database
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRapportsPersonnalises() throws Exception {
        // Initialize the database
        rapportsPersonnalisesRepository.saveAndFlush(rapportsPersonnalises);

        int databaseSizeBeforeDelete = rapportsPersonnalisesRepository.findAll().size();

        // Delete the rapportsPersonnalises
        restRapportsPersonnalisesMockMvc
            .perform(delete(ENTITY_API_URL_ID, rapportsPersonnalises.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RapportsPersonnalises> rapportsPersonnalisesList = rapportsPersonnalisesRepository.findAll();
        assertThat(rapportsPersonnalisesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
