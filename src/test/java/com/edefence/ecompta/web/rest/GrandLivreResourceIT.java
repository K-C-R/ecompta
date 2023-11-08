package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.GrandLivre;
import com.edefence.ecompta.repository.GrandLivreRepository;
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
 * Integration tests for the {@link GrandLivreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GrandLivreResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Long DEFAULT_MONTANT = 1L;
    private static final Long UPDATED_MONTANT = 2L;

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/grand-livres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GrandLivreRepository grandLivreRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGrandLivreMockMvc;

    private GrandLivre grandLivre;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GrandLivre createEntity(EntityManager em) {
        GrandLivre grandLivre = new GrandLivre()
            .date(DEFAULT_DATE)
            .description(DEFAULT_DESCRIPTION)
            .montant(DEFAULT_MONTANT)
            .reference(DEFAULT_REFERENCE);
        return grandLivre;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GrandLivre createUpdatedEntity(EntityManager em) {
        GrandLivre grandLivre = new GrandLivre()
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .montant(UPDATED_MONTANT)
            .reference(UPDATED_REFERENCE);
        return grandLivre;
    }

    @BeforeEach
    public void initTest() {
        grandLivre = createEntity(em);
    }

    @Test
    @Transactional
    void createGrandLivre() throws Exception {
        int databaseSizeBeforeCreate = grandLivreRepository.findAll().size();
        // Create the GrandLivre
        restGrandLivreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grandLivre)))
            .andExpect(status().isCreated());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeCreate + 1);
        GrandLivre testGrandLivre = grandLivreList.get(grandLivreList.size() - 1);
        assertThat(testGrandLivre.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testGrandLivre.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testGrandLivre.getMontant()).isEqualTo(DEFAULT_MONTANT);
        assertThat(testGrandLivre.getReference()).isEqualTo(DEFAULT_REFERENCE);
    }

    @Test
    @Transactional
    void createGrandLivreWithExistingId() throws Exception {
        // Create the GrandLivre with an existing ID
        grandLivre.setId(1L);

        int databaseSizeBeforeCreate = grandLivreRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGrandLivreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grandLivre)))
            .andExpect(status().isBadRequest());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = grandLivreRepository.findAll().size();
        // set the field null
        grandLivre.setDate(null);

        // Create the GrandLivre, which fails.

        restGrandLivreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grandLivre)))
            .andExpect(status().isBadRequest());

        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGrandLivres() throws Exception {
        // Initialize the database
        grandLivreRepository.saveAndFlush(grandLivre);

        // Get all the grandLivreList
        restGrandLivreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grandLivre.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].montant").value(hasItem(DEFAULT_MONTANT.intValue())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)));
    }

    @Test
    @Transactional
    void getGrandLivre() throws Exception {
        // Initialize the database
        grandLivreRepository.saveAndFlush(grandLivre);

        // Get the grandLivre
        restGrandLivreMockMvc
            .perform(get(ENTITY_API_URL_ID, grandLivre.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grandLivre.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.montant").value(DEFAULT_MONTANT.intValue()))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE));
    }

    @Test
    @Transactional
    void getNonExistingGrandLivre() throws Exception {
        // Get the grandLivre
        restGrandLivreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGrandLivre() throws Exception {
        // Initialize the database
        grandLivreRepository.saveAndFlush(grandLivre);

        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();

        // Update the grandLivre
        GrandLivre updatedGrandLivre = grandLivreRepository.findById(grandLivre.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGrandLivre are not directly saved in db
        em.detach(updatedGrandLivre);
        updatedGrandLivre.date(UPDATED_DATE).description(UPDATED_DESCRIPTION).montant(UPDATED_MONTANT).reference(UPDATED_REFERENCE);

        restGrandLivreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrandLivre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrandLivre))
            )
            .andExpect(status().isOk());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
        GrandLivre testGrandLivre = grandLivreList.get(grandLivreList.size() - 1);
        assertThat(testGrandLivre.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testGrandLivre.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGrandLivre.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testGrandLivre.getReference()).isEqualTo(UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void putNonExistingGrandLivre() throws Exception {
        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();
        grandLivre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrandLivreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grandLivre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grandLivre))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrandLivre() throws Exception {
        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();
        grandLivre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrandLivreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grandLivre))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrandLivre() throws Exception {
        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();
        grandLivre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrandLivreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grandLivre)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGrandLivreWithPatch() throws Exception {
        // Initialize the database
        grandLivreRepository.saveAndFlush(grandLivre);

        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();

        // Update the grandLivre using partial update
        GrandLivre partialUpdatedGrandLivre = new GrandLivre();
        partialUpdatedGrandLivre.setId(grandLivre.getId());

        partialUpdatedGrandLivre.description(UPDATED_DESCRIPTION).montant(UPDATED_MONTANT).reference(UPDATED_REFERENCE);

        restGrandLivreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrandLivre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrandLivre))
            )
            .andExpect(status().isOk());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
        GrandLivre testGrandLivre = grandLivreList.get(grandLivreList.size() - 1);
        assertThat(testGrandLivre.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testGrandLivre.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGrandLivre.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testGrandLivre.getReference()).isEqualTo(UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void fullUpdateGrandLivreWithPatch() throws Exception {
        // Initialize the database
        grandLivreRepository.saveAndFlush(grandLivre);

        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();

        // Update the grandLivre using partial update
        GrandLivre partialUpdatedGrandLivre = new GrandLivre();
        partialUpdatedGrandLivre.setId(grandLivre.getId());

        partialUpdatedGrandLivre.date(UPDATED_DATE).description(UPDATED_DESCRIPTION).montant(UPDATED_MONTANT).reference(UPDATED_REFERENCE);

        restGrandLivreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrandLivre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrandLivre))
            )
            .andExpect(status().isOk());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
        GrandLivre testGrandLivre = grandLivreList.get(grandLivreList.size() - 1);
        assertThat(testGrandLivre.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testGrandLivre.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGrandLivre.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testGrandLivre.getReference()).isEqualTo(UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void patchNonExistingGrandLivre() throws Exception {
        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();
        grandLivre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrandLivreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grandLivre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grandLivre))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrandLivre() throws Exception {
        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();
        grandLivre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrandLivreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grandLivre))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrandLivre() throws Exception {
        int databaseSizeBeforeUpdate = grandLivreRepository.findAll().size();
        grandLivre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrandLivreMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grandLivre))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GrandLivre in the database
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrandLivre() throws Exception {
        // Initialize the database
        grandLivreRepository.saveAndFlush(grandLivre);

        int databaseSizeBeforeDelete = grandLivreRepository.findAll().size();

        // Delete the grandLivre
        restGrandLivreMockMvc
            .perform(delete(ENTITY_API_URL_ID, grandLivre.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GrandLivre> grandLivreList = grandLivreRepository.findAll();
        assertThat(grandLivreList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
