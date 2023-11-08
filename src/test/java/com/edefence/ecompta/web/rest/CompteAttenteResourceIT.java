package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.CompteAttente;
import com.edefence.ecompta.repository.CompteAttenteRepository;
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
 * Integration tests for the {@link CompteAttenteResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CompteAttenteResourceIT {

    private static final String DEFAULT_NUMERO_COMPTE = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_COMPTE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/compte-attentes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompteAttenteRepository compteAttenteRepository;

    @Mock
    private CompteAttenteRepository compteAttenteRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompteAttenteMockMvc;

    private CompteAttente compteAttente;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompteAttente createEntity(EntityManager em) {
        CompteAttente compteAttente = new CompteAttente()
            .numeroCompte(DEFAULT_NUMERO_COMPTE)
            .nom(DEFAULT_NOM)
            .description(DEFAULT_DESCRIPTION);
        return compteAttente;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompteAttente createUpdatedEntity(EntityManager em) {
        CompteAttente compteAttente = new CompteAttente()
            .numeroCompte(UPDATED_NUMERO_COMPTE)
            .nom(UPDATED_NOM)
            .description(UPDATED_DESCRIPTION);
        return compteAttente;
    }

    @BeforeEach
    public void initTest() {
        compteAttente = createEntity(em);
    }

    @Test
    @Transactional
    void createCompteAttente() throws Exception {
        int databaseSizeBeforeCreate = compteAttenteRepository.findAll().size();
        // Create the CompteAttente
        restCompteAttenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteAttente)))
            .andExpect(status().isCreated());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeCreate + 1);
        CompteAttente testCompteAttente = compteAttenteList.get(compteAttenteList.size() - 1);
        assertThat(testCompteAttente.getNumeroCompte()).isEqualTo(DEFAULT_NUMERO_COMPTE);
        assertThat(testCompteAttente.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testCompteAttente.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createCompteAttenteWithExistingId() throws Exception {
        // Create the CompteAttente with an existing ID
        compteAttente.setId(1L);

        int databaseSizeBeforeCreate = compteAttenteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompteAttenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteAttente)))
            .andExpect(status().isBadRequest());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompteAttentes() throws Exception {
        // Initialize the database
        compteAttenteRepository.saveAndFlush(compteAttente);

        // Get all the compteAttenteList
        restCompteAttenteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(compteAttente.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroCompte").value(hasItem(DEFAULT_NUMERO_COMPTE)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCompteAttentesWithEagerRelationshipsIsEnabled() throws Exception {
        when(compteAttenteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCompteAttenteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(compteAttenteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCompteAttentesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(compteAttenteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCompteAttenteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(compteAttenteRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCompteAttente() throws Exception {
        // Initialize the database
        compteAttenteRepository.saveAndFlush(compteAttente);

        // Get the compteAttente
        restCompteAttenteMockMvc
            .perform(get(ENTITY_API_URL_ID, compteAttente.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(compteAttente.getId().intValue()))
            .andExpect(jsonPath("$.numeroCompte").value(DEFAULT_NUMERO_COMPTE))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingCompteAttente() throws Exception {
        // Get the compteAttente
        restCompteAttenteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompteAttente() throws Exception {
        // Initialize the database
        compteAttenteRepository.saveAndFlush(compteAttente);

        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();

        // Update the compteAttente
        CompteAttente updatedCompteAttente = compteAttenteRepository.findById(compteAttente.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCompteAttente are not directly saved in db
        em.detach(updatedCompteAttente);
        updatedCompteAttente.numeroCompte(UPDATED_NUMERO_COMPTE).nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);

        restCompteAttenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompteAttente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompteAttente))
            )
            .andExpect(status().isOk());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
        CompteAttente testCompteAttente = compteAttenteList.get(compteAttenteList.size() - 1);
        assertThat(testCompteAttente.getNumeroCompte()).isEqualTo(UPDATED_NUMERO_COMPTE);
        assertThat(testCompteAttente.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteAttente.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingCompteAttente() throws Exception {
        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();
        compteAttente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompteAttenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, compteAttente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compteAttente))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompteAttente() throws Exception {
        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();
        compteAttente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteAttenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compteAttente))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompteAttente() throws Exception {
        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();
        compteAttente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteAttenteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compteAttente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompteAttenteWithPatch() throws Exception {
        // Initialize the database
        compteAttenteRepository.saveAndFlush(compteAttente);

        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();

        // Update the compteAttente using partial update
        CompteAttente partialUpdatedCompteAttente = new CompteAttente();
        partialUpdatedCompteAttente.setId(compteAttente.getId());

        partialUpdatedCompteAttente.numeroCompte(UPDATED_NUMERO_COMPTE).nom(UPDATED_NOM);

        restCompteAttenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompteAttente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompteAttente))
            )
            .andExpect(status().isOk());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
        CompteAttente testCompteAttente = compteAttenteList.get(compteAttenteList.size() - 1);
        assertThat(testCompteAttente.getNumeroCompte()).isEqualTo(UPDATED_NUMERO_COMPTE);
        assertThat(testCompteAttente.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteAttente.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateCompteAttenteWithPatch() throws Exception {
        // Initialize the database
        compteAttenteRepository.saveAndFlush(compteAttente);

        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();

        // Update the compteAttente using partial update
        CompteAttente partialUpdatedCompteAttente = new CompteAttente();
        partialUpdatedCompteAttente.setId(compteAttente.getId());

        partialUpdatedCompteAttente.numeroCompte(UPDATED_NUMERO_COMPTE).nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);

        restCompteAttenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompteAttente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompteAttente))
            )
            .andExpect(status().isOk());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
        CompteAttente testCompteAttente = compteAttenteList.get(compteAttenteList.size() - 1);
        assertThat(testCompteAttente.getNumeroCompte()).isEqualTo(UPDATED_NUMERO_COMPTE);
        assertThat(testCompteAttente.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompteAttente.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingCompteAttente() throws Exception {
        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();
        compteAttente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompteAttenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, compteAttente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteAttente))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompteAttente() throws Exception {
        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();
        compteAttente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteAttenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compteAttente))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompteAttente() throws Exception {
        int databaseSizeBeforeUpdate = compteAttenteRepository.findAll().size();
        compteAttente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompteAttenteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(compteAttente))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompteAttente in the database
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompteAttente() throws Exception {
        // Initialize the database
        compteAttenteRepository.saveAndFlush(compteAttente);

        int databaseSizeBeforeDelete = compteAttenteRepository.findAll().size();

        // Delete the compteAttente
        restCompteAttenteMockMvc
            .perform(delete(ENTITY_API_URL_ID, compteAttente.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompteAttente> compteAttenteList = compteAttenteRepository.findAll();
        assertThat(compteAttenteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
