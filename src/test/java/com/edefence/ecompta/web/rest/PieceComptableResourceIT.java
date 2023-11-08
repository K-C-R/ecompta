package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.PieceComptable;
import com.edefence.ecompta.repository.PieceComptableRepository;
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
 * Integration tests for the {@link PieceComptableResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PieceComptableResourceIT {

    private static final String DEFAULT_NUMERO_PIECE = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_PIECE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_PIECE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_PIECE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/piece-comptables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PieceComptableRepository pieceComptableRepository;

    @Mock
    private PieceComptableRepository pieceComptableRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPieceComptableMockMvc;

    private PieceComptable pieceComptable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PieceComptable createEntity(EntityManager em) {
        PieceComptable pieceComptable = new PieceComptable()
            .numeroPiece(DEFAULT_NUMERO_PIECE)
            .datePiece(DEFAULT_DATE_PIECE)
            .description(DEFAULT_DESCRIPTION);
        return pieceComptable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PieceComptable createUpdatedEntity(EntityManager em) {
        PieceComptable pieceComptable = new PieceComptable()
            .numeroPiece(UPDATED_NUMERO_PIECE)
            .datePiece(UPDATED_DATE_PIECE)
            .description(UPDATED_DESCRIPTION);
        return pieceComptable;
    }

    @BeforeEach
    public void initTest() {
        pieceComptable = createEntity(em);
    }

    @Test
    @Transactional
    void createPieceComptable() throws Exception {
        int databaseSizeBeforeCreate = pieceComptableRepository.findAll().size();
        // Create the PieceComptable
        restPieceComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pieceComptable))
            )
            .andExpect(status().isCreated());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeCreate + 1);
        PieceComptable testPieceComptable = pieceComptableList.get(pieceComptableList.size() - 1);
        assertThat(testPieceComptable.getNumeroPiece()).isEqualTo(DEFAULT_NUMERO_PIECE);
        assertThat(testPieceComptable.getDatePiece()).isEqualTo(DEFAULT_DATE_PIECE);
        assertThat(testPieceComptable.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createPieceComptableWithExistingId() throws Exception {
        // Create the PieceComptable with an existing ID
        pieceComptable.setId(1L);

        int databaseSizeBeforeCreate = pieceComptableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPieceComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pieceComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPieceComptables() throws Exception {
        // Initialize the database
        pieceComptableRepository.saveAndFlush(pieceComptable);

        // Get all the pieceComptableList
        restPieceComptableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pieceComptable.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroPiece").value(hasItem(DEFAULT_NUMERO_PIECE)))
            .andExpect(jsonPath("$.[*].datePiece").value(hasItem(DEFAULT_DATE_PIECE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPieceComptablesWithEagerRelationshipsIsEnabled() throws Exception {
        when(pieceComptableRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPieceComptableMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(pieceComptableRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPieceComptablesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(pieceComptableRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPieceComptableMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(pieceComptableRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPieceComptable() throws Exception {
        // Initialize the database
        pieceComptableRepository.saveAndFlush(pieceComptable);

        // Get the pieceComptable
        restPieceComptableMockMvc
            .perform(get(ENTITY_API_URL_ID, pieceComptable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pieceComptable.getId().intValue()))
            .andExpect(jsonPath("$.numeroPiece").value(DEFAULT_NUMERO_PIECE))
            .andExpect(jsonPath("$.datePiece").value(DEFAULT_DATE_PIECE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingPieceComptable() throws Exception {
        // Get the pieceComptable
        restPieceComptableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPieceComptable() throws Exception {
        // Initialize the database
        pieceComptableRepository.saveAndFlush(pieceComptable);

        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();

        // Update the pieceComptable
        PieceComptable updatedPieceComptable = pieceComptableRepository.findById(pieceComptable.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPieceComptable are not directly saved in db
        em.detach(updatedPieceComptable);
        updatedPieceComptable.numeroPiece(UPDATED_NUMERO_PIECE).datePiece(UPDATED_DATE_PIECE).description(UPDATED_DESCRIPTION);

        restPieceComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPieceComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPieceComptable))
            )
            .andExpect(status().isOk());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
        PieceComptable testPieceComptable = pieceComptableList.get(pieceComptableList.size() - 1);
        assertThat(testPieceComptable.getNumeroPiece()).isEqualTo(UPDATED_NUMERO_PIECE);
        assertThat(testPieceComptable.getDatePiece()).isEqualTo(UPDATED_DATE_PIECE);
        assertThat(testPieceComptable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingPieceComptable() throws Exception {
        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();
        pieceComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPieceComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pieceComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pieceComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPieceComptable() throws Exception {
        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();
        pieceComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPieceComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pieceComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPieceComptable() throws Exception {
        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();
        pieceComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPieceComptableMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pieceComptable)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePieceComptableWithPatch() throws Exception {
        // Initialize the database
        pieceComptableRepository.saveAndFlush(pieceComptable);

        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();

        // Update the pieceComptable using partial update
        PieceComptable partialUpdatedPieceComptable = new PieceComptable();
        partialUpdatedPieceComptable.setId(pieceComptable.getId());

        partialUpdatedPieceComptable.numeroPiece(UPDATED_NUMERO_PIECE).description(UPDATED_DESCRIPTION);

        restPieceComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPieceComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPieceComptable))
            )
            .andExpect(status().isOk());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
        PieceComptable testPieceComptable = pieceComptableList.get(pieceComptableList.size() - 1);
        assertThat(testPieceComptable.getNumeroPiece()).isEqualTo(UPDATED_NUMERO_PIECE);
        assertThat(testPieceComptable.getDatePiece()).isEqualTo(DEFAULT_DATE_PIECE);
        assertThat(testPieceComptable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdatePieceComptableWithPatch() throws Exception {
        // Initialize the database
        pieceComptableRepository.saveAndFlush(pieceComptable);

        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();

        // Update the pieceComptable using partial update
        PieceComptable partialUpdatedPieceComptable = new PieceComptable();
        partialUpdatedPieceComptable.setId(pieceComptable.getId());

        partialUpdatedPieceComptable.numeroPiece(UPDATED_NUMERO_PIECE).datePiece(UPDATED_DATE_PIECE).description(UPDATED_DESCRIPTION);

        restPieceComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPieceComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPieceComptable))
            )
            .andExpect(status().isOk());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
        PieceComptable testPieceComptable = pieceComptableList.get(pieceComptableList.size() - 1);
        assertThat(testPieceComptable.getNumeroPiece()).isEqualTo(UPDATED_NUMERO_PIECE);
        assertThat(testPieceComptable.getDatePiece()).isEqualTo(UPDATED_DATE_PIECE);
        assertThat(testPieceComptable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingPieceComptable() throws Exception {
        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();
        pieceComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPieceComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pieceComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pieceComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPieceComptable() throws Exception {
        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();
        pieceComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPieceComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pieceComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPieceComptable() throws Exception {
        int databaseSizeBeforeUpdate = pieceComptableRepository.findAll().size();
        pieceComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPieceComptableMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pieceComptable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PieceComptable in the database
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePieceComptable() throws Exception {
        // Initialize the database
        pieceComptableRepository.saveAndFlush(pieceComptable);

        int databaseSizeBeforeDelete = pieceComptableRepository.findAll().size();

        // Delete the pieceComptable
        restPieceComptableMockMvc
            .perform(delete(ENTITY_API_URL_ID, pieceComptable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PieceComptable> pieceComptableList = pieceComptableRepository.findAll();
        assertThat(pieceComptableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
