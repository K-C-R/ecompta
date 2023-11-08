package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.Bilan;
import com.edefence.ecompta.repository.BilanRepository;
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
 * Integration tests for the {@link BilanResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BilanResourceIT {

    private static final Instant DEFAULT_EXERCICE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXERCICE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_ACTIF_TOTAL = 1L;
    private static final Long UPDATED_ACTIF_TOTAL = 2L;

    private static final Long DEFAULT_PASSIF_TOTAL = 1L;
    private static final Long UPDATED_PASSIF_TOTAL = 2L;

    private static final String ENTITY_API_URL = "/api/bilans";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BilanRepository bilanRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBilanMockMvc;

    private Bilan bilan;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bilan createEntity(EntityManager em) {
        Bilan bilan = new Bilan().exercice(DEFAULT_EXERCICE).actifTotal(DEFAULT_ACTIF_TOTAL).passifTotal(DEFAULT_PASSIF_TOTAL);
        return bilan;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bilan createUpdatedEntity(EntityManager em) {
        Bilan bilan = new Bilan().exercice(UPDATED_EXERCICE).actifTotal(UPDATED_ACTIF_TOTAL).passifTotal(UPDATED_PASSIF_TOTAL);
        return bilan;
    }

    @BeforeEach
    public void initTest() {
        bilan = createEntity(em);
    }

    @Test
    @Transactional
    void createBilan() throws Exception {
        int databaseSizeBeforeCreate = bilanRepository.findAll().size();
        // Create the Bilan
        restBilanMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bilan)))
            .andExpect(status().isCreated());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeCreate + 1);
        Bilan testBilan = bilanList.get(bilanList.size() - 1);
        assertThat(testBilan.getExercice()).isEqualTo(DEFAULT_EXERCICE);
        assertThat(testBilan.getActifTotal()).isEqualTo(DEFAULT_ACTIF_TOTAL);
        assertThat(testBilan.getPassifTotal()).isEqualTo(DEFAULT_PASSIF_TOTAL);
    }

    @Test
    @Transactional
    void createBilanWithExistingId() throws Exception {
        // Create the Bilan with an existing ID
        bilan.setId(1L);

        int databaseSizeBeforeCreate = bilanRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBilanMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bilan)))
            .andExpect(status().isBadRequest());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBilans() throws Exception {
        // Initialize the database
        bilanRepository.saveAndFlush(bilan);

        // Get all the bilanList
        restBilanMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bilan.getId().intValue())))
            .andExpect(jsonPath("$.[*].exercice").value(hasItem(DEFAULT_EXERCICE.toString())))
            .andExpect(jsonPath("$.[*].actifTotal").value(hasItem(DEFAULT_ACTIF_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].passifTotal").value(hasItem(DEFAULT_PASSIF_TOTAL.intValue())));
    }

    @Test
    @Transactional
    void getBilan() throws Exception {
        // Initialize the database
        bilanRepository.saveAndFlush(bilan);

        // Get the bilan
        restBilanMockMvc
            .perform(get(ENTITY_API_URL_ID, bilan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bilan.getId().intValue()))
            .andExpect(jsonPath("$.exercice").value(DEFAULT_EXERCICE.toString()))
            .andExpect(jsonPath("$.actifTotal").value(DEFAULT_ACTIF_TOTAL.intValue()))
            .andExpect(jsonPath("$.passifTotal").value(DEFAULT_PASSIF_TOTAL.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingBilan() throws Exception {
        // Get the bilan
        restBilanMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBilan() throws Exception {
        // Initialize the database
        bilanRepository.saveAndFlush(bilan);

        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();

        // Update the bilan
        Bilan updatedBilan = bilanRepository.findById(bilan.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBilan are not directly saved in db
        em.detach(updatedBilan);
        updatedBilan.exercice(UPDATED_EXERCICE).actifTotal(UPDATED_ACTIF_TOTAL).passifTotal(UPDATED_PASSIF_TOTAL);

        restBilanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBilan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBilan))
            )
            .andExpect(status().isOk());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
        Bilan testBilan = bilanList.get(bilanList.size() - 1);
        assertThat(testBilan.getExercice()).isEqualTo(UPDATED_EXERCICE);
        assertThat(testBilan.getActifTotal()).isEqualTo(UPDATED_ACTIF_TOTAL);
        assertThat(testBilan.getPassifTotal()).isEqualTo(UPDATED_PASSIF_TOTAL);
    }

    @Test
    @Transactional
    void putNonExistingBilan() throws Exception {
        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();
        bilan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBilanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bilan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bilan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBilan() throws Exception {
        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();
        bilan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBilanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bilan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBilan() throws Exception {
        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();
        bilan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBilanMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bilan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBilanWithPatch() throws Exception {
        // Initialize the database
        bilanRepository.saveAndFlush(bilan);

        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();

        // Update the bilan using partial update
        Bilan partialUpdatedBilan = new Bilan();
        partialUpdatedBilan.setId(bilan.getId());

        partialUpdatedBilan.passifTotal(UPDATED_PASSIF_TOTAL);

        restBilanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBilan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBilan))
            )
            .andExpect(status().isOk());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
        Bilan testBilan = bilanList.get(bilanList.size() - 1);
        assertThat(testBilan.getExercice()).isEqualTo(DEFAULT_EXERCICE);
        assertThat(testBilan.getActifTotal()).isEqualTo(DEFAULT_ACTIF_TOTAL);
        assertThat(testBilan.getPassifTotal()).isEqualTo(UPDATED_PASSIF_TOTAL);
    }

    @Test
    @Transactional
    void fullUpdateBilanWithPatch() throws Exception {
        // Initialize the database
        bilanRepository.saveAndFlush(bilan);

        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();

        // Update the bilan using partial update
        Bilan partialUpdatedBilan = new Bilan();
        partialUpdatedBilan.setId(bilan.getId());

        partialUpdatedBilan.exercice(UPDATED_EXERCICE).actifTotal(UPDATED_ACTIF_TOTAL).passifTotal(UPDATED_PASSIF_TOTAL);

        restBilanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBilan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBilan))
            )
            .andExpect(status().isOk());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
        Bilan testBilan = bilanList.get(bilanList.size() - 1);
        assertThat(testBilan.getExercice()).isEqualTo(UPDATED_EXERCICE);
        assertThat(testBilan.getActifTotal()).isEqualTo(UPDATED_ACTIF_TOTAL);
        assertThat(testBilan.getPassifTotal()).isEqualTo(UPDATED_PASSIF_TOTAL);
    }

    @Test
    @Transactional
    void patchNonExistingBilan() throws Exception {
        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();
        bilan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBilanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bilan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bilan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBilan() throws Exception {
        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();
        bilan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBilanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bilan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBilan() throws Exception {
        int databaseSizeBeforeUpdate = bilanRepository.findAll().size();
        bilan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBilanMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bilan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bilan in the database
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBilan() throws Exception {
        // Initialize the database
        bilanRepository.saveAndFlush(bilan);

        int databaseSizeBeforeDelete = bilanRepository.findAll().size();

        // Delete the bilan
        restBilanMockMvc
            .perform(delete(ENTITY_API_URL_ID, bilan.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bilan> bilanList = bilanRepository.findAll();
        assertThat(bilanList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
