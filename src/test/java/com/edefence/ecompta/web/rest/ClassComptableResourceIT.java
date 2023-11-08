package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.ClassComptable;
import com.edefence.ecompta.repository.ClassComptableRepository;
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
 * Integration tests for the {@link ClassComptableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClassComptableResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/class-comptables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClassComptableRepository classComptableRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClassComptableMockMvc;

    private ClassComptable classComptable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClassComptable createEntity(EntityManager em) {
        ClassComptable classComptable = new ClassComptable().nom(DEFAULT_NOM).description(DEFAULT_DESCRIPTION);
        return classComptable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClassComptable createUpdatedEntity(EntityManager em) {
        ClassComptable classComptable = new ClassComptable().nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);
        return classComptable;
    }

    @BeforeEach
    public void initTest() {
        classComptable = createEntity(em);
    }

    @Test
    @Transactional
    void createClassComptable() throws Exception {
        int databaseSizeBeforeCreate = classComptableRepository.findAll().size();
        // Create the ClassComptable
        restClassComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classComptable))
            )
            .andExpect(status().isCreated());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeCreate + 1);
        ClassComptable testClassComptable = classComptableList.get(classComptableList.size() - 1);
        assertThat(testClassComptable.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testClassComptable.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createClassComptableWithExistingId() throws Exception {
        // Create the ClassComptable with an existing ID
        classComptable.setId(1L);

        int databaseSizeBeforeCreate = classComptableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClassComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = classComptableRepository.findAll().size();
        // set the field null
        classComptable.setNom(null);

        // Create the ClassComptable, which fails.

        restClassComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classComptable))
            )
            .andExpect(status().isBadRequest());

        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllClassComptables() throws Exception {
        // Initialize the database
        classComptableRepository.saveAndFlush(classComptable);

        // Get all the classComptableList
        restClassComptableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(classComptable.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getClassComptable() throws Exception {
        // Initialize the database
        classComptableRepository.saveAndFlush(classComptable);

        // Get the classComptable
        restClassComptableMockMvc
            .perform(get(ENTITY_API_URL_ID, classComptable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(classComptable.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingClassComptable() throws Exception {
        // Get the classComptable
        restClassComptableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClassComptable() throws Exception {
        // Initialize the database
        classComptableRepository.saveAndFlush(classComptable);

        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();

        // Update the classComptable
        ClassComptable updatedClassComptable = classComptableRepository.findById(classComptable.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedClassComptable are not directly saved in db
        em.detach(updatedClassComptable);
        updatedClassComptable.nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);

        restClassComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClassComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClassComptable))
            )
            .andExpect(status().isOk());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
        ClassComptable testClassComptable = classComptableList.get(classComptableList.size() - 1);
        assertThat(testClassComptable.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testClassComptable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingClassComptable() throws Exception {
        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();
        classComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, classComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(classComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClassComptable() throws Exception {
        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();
        classComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(classComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClassComptable() throws Exception {
        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();
        classComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassComptableMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classComptable)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClassComptableWithPatch() throws Exception {
        // Initialize the database
        classComptableRepository.saveAndFlush(classComptable);

        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();

        // Update the classComptable using partial update
        ClassComptable partialUpdatedClassComptable = new ClassComptable();
        partialUpdatedClassComptable.setId(classComptable.getId());

        restClassComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClassComptable))
            )
            .andExpect(status().isOk());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
        ClassComptable testClassComptable = classComptableList.get(classComptableList.size() - 1);
        assertThat(testClassComptable.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testClassComptable.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateClassComptableWithPatch() throws Exception {
        // Initialize the database
        classComptableRepository.saveAndFlush(classComptable);

        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();

        // Update the classComptable using partial update
        ClassComptable partialUpdatedClassComptable = new ClassComptable();
        partialUpdatedClassComptable.setId(classComptable.getId());

        partialUpdatedClassComptable.nom(UPDATED_NOM).description(UPDATED_DESCRIPTION);

        restClassComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClassComptable))
            )
            .andExpect(status().isOk());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
        ClassComptable testClassComptable = classComptableList.get(classComptableList.size() - 1);
        assertThat(testClassComptable.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testClassComptable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingClassComptable() throws Exception {
        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();
        classComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, classComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(classComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClassComptable() throws Exception {
        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();
        classComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(classComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClassComptable() throws Exception {
        int databaseSizeBeforeUpdate = classComptableRepository.findAll().size();
        classComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassComptableMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(classComptable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClassComptable in the database
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClassComptable() throws Exception {
        // Initialize the database
        classComptableRepository.saveAndFlush(classComptable);

        int databaseSizeBeforeDelete = classComptableRepository.findAll().size();

        // Delete the classComptable
        restClassComptableMockMvc
            .perform(delete(ENTITY_API_URL_ID, classComptable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClassComptable> classComptableList = classComptableRepository.findAll();
        assertThat(classComptableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
