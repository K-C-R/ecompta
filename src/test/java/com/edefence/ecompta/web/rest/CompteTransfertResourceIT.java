package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.CompteTransfert;
import com.edefence.ecompta.repository.CompteTransfertRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link CompteTransfertResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CompteTransfertResourceIT {

    private static final String DEFAULT_NUMERO_COMPTE = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_COMPTE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/compte-transferts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompteTransfertRepository compteTransfertRepository;

    @Mock
    private CompteTransfertRepository compteTransfertRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompteTransfertMockMvc;

    private CompteTransfert compteTransfert;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompteTransfert createEntity(EntityManager em) {
        CompteTransfert compteTransfert = new CompteTransfert()
            .numeroCompte(DEFAULT_NUMERO_COMPTE)
            .nom(DEFAULT_NOM)
            .description(DEFAULT_DESCRIPTION);
        return compteTransfert;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompteTransfert createUpdatedEntity(EntityManager em) {
        CompteTransfert compteTransfert = new CompteTransfert()
            .numeroCompte(UPDATED_NUMERO_COMPTE)
            .nom(UPDATED_NOM)
            .description(UPDATED_DESCRIPTION);
        return compteTransfert;
    }

    @BeforeEach
    public void initTest() {
        compteTransfert = createEntity(em);
    }

    @Test
    @Transactional
    void createCompteTransfert() throws Exception {
        int databaseSizeBeforeCreate = compteTransfertRepository.findAll().size();
        // Create the CompteTransfert
        restCompteTransfertMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteTransfert))
            )
            .andExpect(status().isCreated());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeCreate + 1);
        CompteTransfert testCompteTransfert = compteTransfertList.get(compteTransfertList.size() - 1);
        assertThat(testCompteTransfert.getNumeroCompte()).isEqualTo(DEFAULT_NUMERO_COMPTE);
        assertThat(testCompteTransfert.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testCompteTransfert.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createCompteTransfertWithExistingId() throws Exception {
        // Create the CompteTransfert with an existing ID
        compteTransfert.setId(1L);

        int databaseSizeBeforeCreate = compteTransfertRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompteTransfertMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteTransfert))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompteTransferts() throws Exception {
        // Initialize the database
        compteTransfertRepository.saveAndFlush(compteTransfert);

        // Get all the compteTransfertList
        restCompteTransfertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(compteTransfert.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroCompte").value(hasItem(DEFAULT_NUMERO_COMPTE)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCompteTransfertsWithEagerRelationshipsIsEnabled() throws Exception {
        when(compteTransfertRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCompteTransfertMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(compteTransfertRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCompteTransfertsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(compteTransfertRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCompteTransfertMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(compteTransfertRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCompteTransfert() throws Exception {
        // Initialize the database
        compteTransfertRepository.saveAndFlush(compteTransfert);

        // Get the compteTransfert
        restCompteTransfertMockMvc
            .perform(get(ENTITY_API_URL_ID, compteTransfert.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(compteTransfert.getId().intValue()))
            .andExpect(jsonPath("$.numeroCompte").value(DEFAULT_NUMERO_COMPTE))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingCompteTransfert() throws Exception {
        // Get the compteTransfert
        restCompteTransfertMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompteTransfert() throws Exception {
        // Initialize the database
        compteTransfertRepository.saveAndFlush(compteTransfert);

        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();

        // Update the compteTransfert
        CompteTransfert updatedCompteTransfert = compteTransfertRepository.findById(compteTransfert.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCompteTransfert are not directly saved in db
        em.detach(updatedCompteTransfert);
        updatedCompteTransfert.numeroCompte(UPDATED_NUMERO_COMPTE).nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);

        restCompteTransfertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompteTransfert.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompteTransfert))
            )
            .andExpect(status().isOk());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
        CompteTransfert testCompteTransfert = compteTransfertList.get(compteTransfertList.size() - 1);
        assertThat(testCompteTransfert.getNumeroCompte()).isEqualTo(UPDATED_NUMERO_COMPTE);
        assertThat(testCompteTransfert.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteTransfert.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingCompteTransfert() throws Exception {
        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();
        compteTransfert.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompteTransfertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, compteTransfert.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compteTransfert))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompteTransfert() throws Exception {
        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();
        compteTransfert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteTransfertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compteTransfert))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompteTransfert() throws Exception {
        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();
        compteTransfert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteTransfertMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteTransfert))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompteTransfertWithPatch() throws Exception {
        // Initialize the database
        compteTransfertRepository.saveAndFlush(compteTransfert);

        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();

        // Update the compteTransfert using partial update
        CompteTransfert partialUpdatedCompteTransfert = new CompteTransfert();
        partialUpdatedCompteTransfert.setId(compteTransfert.getId());

        partialUpdatedCompteTransfert.nom(UPDATED_NOM);

        restCompteTransfertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompteTransfert.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompteTransfert))
            )
            .andExpect(status().isOk());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
        CompteTransfert testCompteTransfert = compteTransfertList.get(compteTransfertList.size() - 1);
        assertThat(testCompteTransfert.getNumeroCompte()).isEqualTo(DEFAULT_NUMERO_COMPTE);
        assertThat(testCompteTransfert.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteTransfert.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateCompteTransfertWithPatch() throws Exception {
        // Initialize the database
        compteTransfertRepository.saveAndFlush(compteTransfert);

        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();

        // Update the compteTransfert using partial update
        CompteTransfert partialUpdatedCompteTransfert = new CompteTransfert();
        partialUpdatedCompteTransfert.setId(compteTransfert.getId());

        partialUpdatedCompteTransfert.numeroCompte(UPDATED_NUMERO_COMPTE).nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);

        restCompteTransfertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompteTransfert.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompteTransfert))
            )
            .andExpect(status().isOk());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
        CompteTransfert testCompteTransfert = compteTransfertList.get(compteTransfertList.size() - 1);
        assertThat(testCompteTransfert.getNumeroCompte()).isEqualTo(UPDATED_NUMERO_COMPTE);
        assertThat(testCompteTransfert.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteTransfert.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingCompteTransfert() throws Exception {
        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();
        compteTransfert.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompteTransfertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, compteTransfert.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteTransfert))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompteTransfert() throws Exception {
        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();
        compteTransfert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteTransfertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteTransfert))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompteTransfert() throws Exception {
        int databaseSizeBeforeUpdate = compteTransfertRepository.findAll().size();
        compteTransfert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteTransfertMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteTransfert))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompteTransfert in the database
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompteTransfert() throws Exception {
        // Initialize the database
        compteTransfertRepository.saveAndFlush(compteTransfert);

        int databaseSizeBeforeDelete = compteTransfertRepository.findAll().size();

        // Delete the compteTransfert
        restCompteTransfertMockMvc
            .perform(delete(ENTITY_API_URL_ID, compteTransfert.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompteTransfert> compteTransfertList = compteTransfertRepository.findAll();
        assertThat(compteTransfertList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
