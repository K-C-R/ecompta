package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.Audit;
import com.edefence.ecompta.repository.AuditRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AuditResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AuditResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_ACTION = "AAAAAAAAAA";
    private static final String UPDATED_ACTION = "BBBBBBBBBB";

    private static final String DEFAULT_ENTITE_MODIFIEE = "AAAAAAAAAA";
    private static final String UPDATED_ENTITE_MODIFIEE = "BBBBBBBBBB";

    private static final String DEFAULT_UTILISATEUR = "AAAAAAAAAA";
    private static final String UPDATED_UTILISATEUR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/audits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AuditRepository auditRepository;

    @Mock
    private AuditRepository auditRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAuditMockMvc;

    private Audit audit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Audit createEntity(EntityManager em) {
        Audit audit = new Audit()
            .date(DEFAULT_DATE)
            .action(DEFAULT_ACTION)
            .entiteModifiee(DEFAULT_ENTITE_MODIFIEE)
            .utilisateur(DEFAULT_UTILISATEUR);
        return audit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Audit createUpdatedEntity(EntityManager em) {
        Audit audit = new Audit()
            .date(UPDATED_DATE)
            .action(UPDATED_ACTION)
            .entiteModifiee(UPDATED_ENTITE_MODIFIEE)
            .utilisateur(UPDATED_UTILISATEUR);
        return audit;
    }

    @BeforeEach
    public void initTest() {
        audit = createEntity(em);
    }

    @Test
    @Transactional
    void createAudit() throws Exception {
        int databaseSizeBeforeCreate = auditRepository.findAll().size();
        // Create the Audit
        restAuditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(audit)))
            .andExpect(status().isCreated());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeCreate + 1);
        Audit testAudit = auditList.get(auditList.size() - 1);
        assertThat(testAudit.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testAudit.getAction()).isEqualTo(DEFAULT_ACTION);
        assertThat(testAudit.getEntiteModifiee()).isEqualTo(DEFAULT_ENTITE_MODIFIEE);
        assertThat(testAudit.getUtilisateur()).isEqualTo(DEFAULT_UTILISATEUR);
    }

    @Test
    @Transactional
    void createAuditWithExistingId() throws Exception {
        // Create the Audit with an existing ID
        audit.setId(1L);

        int databaseSizeBeforeCreate = auditRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAuditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(audit)))
            .andExpect(status().isBadRequest());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAudits() throws Exception {
        // Initialize the database
        auditRepository.saveAndFlush(audit);

        // Get all the auditList
        restAuditMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(audit.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].action").value(hasItem(DEFAULT_ACTION)))
            .andExpect(jsonPath("$.[*].entiteModifiee").value(hasItem(DEFAULT_ENTITE_MODIFIEE)))
            .andExpect(jsonPath("$.[*].utilisateur").value(hasItem(DEFAULT_UTILISATEUR)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAuditsWithEagerRelationshipsIsEnabled() throws Exception {
        when(auditRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAuditMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(auditRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAuditsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(auditRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAuditMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(auditRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAudit() throws Exception {
        // Initialize the database
        auditRepository.saveAndFlush(audit);

        // Get the audit
        restAuditMockMvc
            .perform(get(ENTITY_API_URL_ID, audit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(audit.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.action").value(DEFAULT_ACTION))
            .andExpect(jsonPath("$.entiteModifiee").value(DEFAULT_ENTITE_MODIFIEE))
            .andExpect(jsonPath("$.utilisateur").value(DEFAULT_UTILISATEUR));
    }

    @Test
    @Transactional
    void getNonExistingAudit() throws Exception {
        // Get the audit
        restAuditMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAudit() throws Exception {
        // Initialize the database
        auditRepository.saveAndFlush(audit);

        int databaseSizeBeforeUpdate = auditRepository.findAll().size();

        // Update the audit
        Audit updatedAudit = auditRepository.findById(audit.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAudit are not directly saved in db
        em.detach(updatedAudit);
        updatedAudit.date(UPDATED_DATE).action(UPDATED_ACTION).entiteModifiee(UPDATED_ENTITE_MODIFIEE).utilisateur(UPDATED_UTILISATEUR);

        restAuditMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAudit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAudit))
            )
            .andExpect(status().isOk());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
        Audit testAudit = auditList.get(auditList.size() - 1);
        assertThat(testAudit.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testAudit.getAction()).isEqualTo(UPDATED_ACTION);
        assertThat(testAudit.getEntiteModifiee()).isEqualTo(UPDATED_ENTITE_MODIFIEE);
        assertThat(testAudit.getUtilisateur()).isEqualTo(UPDATED_UTILISATEUR);
    }

    @Test
    @Transactional
    void putNonExistingAudit() throws Exception {
        int databaseSizeBeforeUpdate = auditRepository.findAll().size();
        audit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuditMockMvc
            .perform(
                put(ENTITY_API_URL_ID, audit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(audit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAudit() throws Exception {
        int databaseSizeBeforeUpdate = auditRepository.findAll().size();
        audit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuditMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(audit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAudit() throws Exception {
        int databaseSizeBeforeUpdate = auditRepository.findAll().size();
        audit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuditMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(audit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAuditWithPatch() throws Exception {
        // Initialize the database
        auditRepository.saveAndFlush(audit);

        int databaseSizeBeforeUpdate = auditRepository.findAll().size();

        // Update the audit using partial update
        Audit partialUpdatedAudit = new Audit();
        partialUpdatedAudit.setId(audit.getId());

        restAuditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAudit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAudit))
            )
            .andExpect(status().isOk());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
        Audit testAudit = auditList.get(auditList.size() - 1);
        assertThat(testAudit.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testAudit.getAction()).isEqualTo(DEFAULT_ACTION);
        assertThat(testAudit.getEntiteModifiee()).isEqualTo(DEFAULT_ENTITE_MODIFIEE);
        assertThat(testAudit.getUtilisateur()).isEqualTo(DEFAULT_UTILISATEUR);
    }

    @Test
    @Transactional
    void fullUpdateAuditWithPatch() throws Exception {
        // Initialize the database
        auditRepository.saveAndFlush(audit);

        int databaseSizeBeforeUpdate = auditRepository.findAll().size();

        // Update the audit using partial update
        Audit partialUpdatedAudit = new Audit();
        partialUpdatedAudit.setId(audit.getId());

        partialUpdatedAudit
            .date(UPDATED_DATE)
            .action(UPDATED_ACTION)
            .entiteModifiee(UPDATED_ENTITE_MODIFIEE)
            .utilisateur(UPDATED_UTILISATEUR);

        restAuditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAudit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAudit))
            )
            .andExpect(status().isOk());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
        Audit testAudit = auditList.get(auditList.size() - 1);
        assertThat(testAudit.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testAudit.getAction()).isEqualTo(UPDATED_ACTION);
        assertThat(testAudit.getEntiteModifiee()).isEqualTo(UPDATED_ENTITE_MODIFIEE);
        assertThat(testAudit.getUtilisateur()).isEqualTo(UPDATED_UTILISATEUR);
    }

    @Test
    @Transactional
    void patchNonExistingAudit() throws Exception {
        int databaseSizeBeforeUpdate = auditRepository.findAll().size();
        audit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, audit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(audit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAudit() throws Exception {
        int databaseSizeBeforeUpdate = auditRepository.findAll().size();
        audit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(audit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAudit() throws Exception {
        int databaseSizeBeforeUpdate = auditRepository.findAll().size();
        audit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuditMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(audit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Audit in the database
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAudit() throws Exception {
        // Initialize the database
        auditRepository.saveAndFlush(audit);

        int databaseSizeBeforeDelete = auditRepository.findAll().size();

        // Delete the audit
        restAuditMockMvc
            .perform(delete(ENTITY_API_URL_ID, audit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Audit> auditList = auditRepository.findAll();
        assertThat(auditList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
