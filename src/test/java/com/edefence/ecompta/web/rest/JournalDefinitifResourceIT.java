package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.JournalDefinitif;
import com.edefence.ecompta.repository.JournalDefinitifRepository;
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
 * Integration tests for the {@link JournalDefinitifResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JournalDefinitifResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Long DEFAULT_MONTANT = 1L;
    private static final Long UPDATED_MONTANT = 2L;

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/journal-definitifs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JournalDefinitifRepository journalDefinitifRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJournalDefinitifMockMvc;

    private JournalDefinitif journalDefinitif;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JournalDefinitif createEntity(EntityManager em) {
        JournalDefinitif journalDefinitif = new JournalDefinitif()
            .date(DEFAULT_DATE)
            .description(DEFAULT_DESCRIPTION)
            .montant(DEFAULT_MONTANT)
            .reference(DEFAULT_REFERENCE);
        return journalDefinitif;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JournalDefinitif createUpdatedEntity(EntityManager em) {
        JournalDefinitif journalDefinitif = new JournalDefinitif()
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .montant(UPDATED_MONTANT)
            .reference(UPDATED_REFERENCE);
        return journalDefinitif;
    }

    @BeforeEach
    public void initTest() {
        journalDefinitif = createEntity(em);
    }

    @Test
    @Transactional
    void createJournalDefinitif() throws Exception {
        int databaseSizeBeforeCreate = journalDefinitifRepository.findAll().size();
        // Create the JournalDefinitif
        restJournalDefinitifMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isCreated());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeCreate + 1);
        JournalDefinitif testJournalDefinitif = journalDefinitifList.get(journalDefinitifList.size() - 1);
        assertThat(testJournalDefinitif.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testJournalDefinitif.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testJournalDefinitif.getMontant()).isEqualTo(DEFAULT_MONTANT);
        assertThat(testJournalDefinitif.getReference()).isEqualTo(DEFAULT_REFERENCE);
    }

    @Test
    @Transactional
    void createJournalDefinitifWithExistingId() throws Exception {
        // Create the JournalDefinitif with an existing ID
        journalDefinitif.setId(1L);

        int databaseSizeBeforeCreate = journalDefinitifRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJournalDefinitifMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isBadRequest());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = journalDefinitifRepository.findAll().size();
        // set the field null
        journalDefinitif.setDate(null);

        // Create the JournalDefinitif, which fails.

        restJournalDefinitifMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isBadRequest());

        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllJournalDefinitifs() throws Exception {
        // Initialize the database
        journalDefinitifRepository.saveAndFlush(journalDefinitif);

        // Get all the journalDefinitifList
        restJournalDefinitifMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(journalDefinitif.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].montant").value(hasItem(DEFAULT_MONTANT.intValue())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)));
    }

    @Test
    @Transactional
    void getJournalDefinitif() throws Exception {
        // Initialize the database
        journalDefinitifRepository.saveAndFlush(journalDefinitif);

        // Get the journalDefinitif
        restJournalDefinitifMockMvc
            .perform(get(ENTITY_API_URL_ID, journalDefinitif.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(journalDefinitif.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.montant").value(DEFAULT_MONTANT.intValue()))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE));
    }

    @Test
    @Transactional
    void getNonExistingJournalDefinitif() throws Exception {
        // Get the journalDefinitif
        restJournalDefinitifMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJournalDefinitif() throws Exception {
        // Initialize the database
        journalDefinitifRepository.saveAndFlush(journalDefinitif);

        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();

        // Update the journalDefinitif
        JournalDefinitif updatedJournalDefinitif = journalDefinitifRepository.findById(journalDefinitif.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedJournalDefinitif are not directly saved in db
        em.detach(updatedJournalDefinitif);
        updatedJournalDefinitif.date(UPDATED_DATE).description(UPDATED_DESCRIPTION).montant(UPDATED_MONTANT).reference(UPDATED_REFERENCE);

        restJournalDefinitifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJournalDefinitif.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJournalDefinitif))
            )
            .andExpect(status().isOk());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
        JournalDefinitif testJournalDefinitif = journalDefinitifList.get(journalDefinitifList.size() - 1);
        assertThat(testJournalDefinitif.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testJournalDefinitif.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJournalDefinitif.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testJournalDefinitif.getReference()).isEqualTo(UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void putNonExistingJournalDefinitif() throws Exception {
        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();
        journalDefinitif.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJournalDefinitifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, journalDefinitif.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isBadRequest());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJournalDefinitif() throws Exception {
        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();
        journalDefinitif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJournalDefinitifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isBadRequest());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJournalDefinitif() throws Exception {
        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();
        journalDefinitif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJournalDefinitifMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJournalDefinitifWithPatch() throws Exception {
        // Initialize the database
        journalDefinitifRepository.saveAndFlush(journalDefinitif);

        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();

        // Update the journalDefinitif using partial update
        JournalDefinitif partialUpdatedJournalDefinitif = new JournalDefinitif();
        partialUpdatedJournalDefinitif.setId(journalDefinitif.getId());

        restJournalDefinitifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJournalDefinitif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJournalDefinitif))
            )
            .andExpect(status().isOk());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
        JournalDefinitif testJournalDefinitif = journalDefinitifList.get(journalDefinitifList.size() - 1);
        assertThat(testJournalDefinitif.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testJournalDefinitif.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testJournalDefinitif.getMontant()).isEqualTo(DEFAULT_MONTANT);
        assertThat(testJournalDefinitif.getReference()).isEqualTo(DEFAULT_REFERENCE);
    }

    @Test
    @Transactional
    void fullUpdateJournalDefinitifWithPatch() throws Exception {
        // Initialize the database
        journalDefinitifRepository.saveAndFlush(journalDefinitif);

        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();

        // Update the journalDefinitif using partial update
        JournalDefinitif partialUpdatedJournalDefinitif = new JournalDefinitif();
        partialUpdatedJournalDefinitif.setId(journalDefinitif.getId());

        partialUpdatedJournalDefinitif
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .montant(UPDATED_MONTANT)
            .reference(UPDATED_REFERENCE);

        restJournalDefinitifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJournalDefinitif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJournalDefinitif))
            )
            .andExpect(status().isOk());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
        JournalDefinitif testJournalDefinitif = journalDefinitifList.get(journalDefinitifList.size() - 1);
        assertThat(testJournalDefinitif.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testJournalDefinitif.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJournalDefinitif.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testJournalDefinitif.getReference()).isEqualTo(UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void patchNonExistingJournalDefinitif() throws Exception {
        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();
        journalDefinitif.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJournalDefinitifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, journalDefinitif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isBadRequest());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJournalDefinitif() throws Exception {
        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();
        journalDefinitif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJournalDefinitifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isBadRequest());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJournalDefinitif() throws Exception {
        int databaseSizeBeforeUpdate = journalDefinitifRepository.findAll().size();
        journalDefinitif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJournalDefinitifMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(journalDefinitif))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JournalDefinitif in the database
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJournalDefinitif() throws Exception {
        // Initialize the database
        journalDefinitifRepository.saveAndFlush(journalDefinitif);

        int databaseSizeBeforeDelete = journalDefinitifRepository.findAll().size();

        // Delete the journalDefinitif
        restJournalDefinitifMockMvc
            .perform(delete(ENTITY_API_URL_ID, journalDefinitif.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JournalDefinitif> journalDefinitifList = journalDefinitifRepository.findAll();
        assertThat(journalDefinitifList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
