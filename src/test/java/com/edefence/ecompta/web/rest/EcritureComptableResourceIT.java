package com.edefence.ecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.edefence.ecompta.IntegrationTest;
import com.edefence.ecompta.domain.Compte;
import com.edefence.ecompta.domain.EcritureComptable;
import com.edefence.ecompta.domain.enumeration.TypeEcriture;
import com.edefence.ecompta.repository.EcritureComptableRepository;
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
 * Integration tests for the {@link EcritureComptableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EcritureComptableResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_MONTANT = 0L;
    private static final Long UPDATED_MONTANT = 1L;
    private static final Long SMALLER_MONTANT = 0L - 1L;

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final TypeEcriture DEFAULT_TYPE_ECRITURE = TypeEcriture.CLOTURE;
    private static final TypeEcriture UPDATED_TYPE_ECRITURE = TypeEcriture.DEBUT;

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_AUTRE_INFOS = "AAAAAAAAAA";
    private static final String UPDATED_AUTRE_INFOS = "BBBBBBBBBB";

    private static final String DEFAULT_PIECES = "AAAAAAAAAA";
    private static final String UPDATED_PIECES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ecriture-comptables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EcritureComptableRepository ecritureComptableRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEcritureComptableMockMvc;

    private EcritureComptable ecritureComptable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EcritureComptable createEntity(EntityManager em) {
        EcritureComptable ecritureComptable = new EcritureComptable()
            .date(DEFAULT_DATE)
            .montant(DEFAULT_MONTANT)
            .libelle(DEFAULT_LIBELLE)
            .typeEcriture(DEFAULT_TYPE_ECRITURE)
            .reference(DEFAULT_REFERENCE)
            .autreInfos(DEFAULT_AUTRE_INFOS)
            .pieces(DEFAULT_PIECES);
        return ecritureComptable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EcritureComptable createUpdatedEntity(EntityManager em) {
        EcritureComptable ecritureComptable = new EcritureComptable()
            .date(UPDATED_DATE)
            .montant(UPDATED_MONTANT)
            .libelle(UPDATED_LIBELLE)
            .typeEcriture(UPDATED_TYPE_ECRITURE)
            .reference(UPDATED_REFERENCE)
            .autreInfos(UPDATED_AUTRE_INFOS)
            .pieces(UPDATED_PIECES);
        return ecritureComptable;
    }

    @BeforeEach
    public void initTest() {
        ecritureComptable = createEntity(em);
    }

    @Test
    @Transactional
    void createEcritureComptable() throws Exception {
        int databaseSizeBeforeCreate = ecritureComptableRepository.findAll().size();
        // Create the EcritureComptable
        restEcritureComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isCreated());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeCreate + 1);
        EcritureComptable testEcritureComptable = ecritureComptableList.get(ecritureComptableList.size() - 1);
        assertThat(testEcritureComptable.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEcritureComptable.getMontant()).isEqualTo(DEFAULT_MONTANT);
        assertThat(testEcritureComptable.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testEcritureComptable.getTypeEcriture()).isEqualTo(DEFAULT_TYPE_ECRITURE);
        assertThat(testEcritureComptable.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testEcritureComptable.getAutreInfos()).isEqualTo(DEFAULT_AUTRE_INFOS);
        assertThat(testEcritureComptable.getPieces()).isEqualTo(DEFAULT_PIECES);
    }

    @Test
    @Transactional
    void createEcritureComptableWithExistingId() throws Exception {
        // Create the EcritureComptable with an existing ID
        ecritureComptable.setId(1L);

        int databaseSizeBeforeCreate = ecritureComptableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEcritureComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = ecritureComptableRepository.findAll().size();
        // set the field null
        ecritureComptable.setDate(null);

        // Create the EcritureComptable, which fails.

        restEcritureComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isBadRequest());

        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMontantIsRequired() throws Exception {
        int databaseSizeBeforeTest = ecritureComptableRepository.findAll().size();
        // set the field null
        ecritureComptable.setMontant(null);

        // Create the EcritureComptable, which fails.

        restEcritureComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isBadRequest());

        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeEcritureIsRequired() throws Exception {
        int databaseSizeBeforeTest = ecritureComptableRepository.findAll().size();
        // set the field null
        ecritureComptable.setTypeEcriture(null);

        // Create the EcritureComptable, which fails.

        restEcritureComptableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isBadRequest());

        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEcritureComptables() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList
        restEcritureComptableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ecritureComptable.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].montant").value(hasItem(DEFAULT_MONTANT.intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].typeEcriture").value(hasItem(DEFAULT_TYPE_ECRITURE.toString())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].autreInfos").value(hasItem(DEFAULT_AUTRE_INFOS)))
            .andExpect(jsonPath("$.[*].pieces").value(hasItem(DEFAULT_PIECES)));
    }

    @Test
    @Transactional
    void getEcritureComptable() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get the ecritureComptable
        restEcritureComptableMockMvc
            .perform(get(ENTITY_API_URL_ID, ecritureComptable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ecritureComptable.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.montant").value(DEFAULT_MONTANT.intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.typeEcriture").value(DEFAULT_TYPE_ECRITURE.toString()))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE))
            .andExpect(jsonPath("$.autreInfos").value(DEFAULT_AUTRE_INFOS))
            .andExpect(jsonPath("$.pieces").value(DEFAULT_PIECES));
    }

    @Test
    @Transactional
    void getEcritureComptablesByIdFiltering() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        Long id = ecritureComptable.getId();

        defaultEcritureComptableShouldBeFound("id.equals=" + id);
        defaultEcritureComptableShouldNotBeFound("id.notEquals=" + id);

        defaultEcritureComptableShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultEcritureComptableShouldNotBeFound("id.greaterThan=" + id);

        defaultEcritureComptableShouldBeFound("id.lessThanOrEqual=" + id);
        defaultEcritureComptableShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByDateIsEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where date equals to DEFAULT_DATE
        defaultEcritureComptableShouldBeFound("date.equals=" + DEFAULT_DATE);

        // Get all the ecritureComptableList where date equals to UPDATED_DATE
        defaultEcritureComptableShouldNotBeFound("date.equals=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByDateIsInShouldWork() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where date in DEFAULT_DATE or UPDATED_DATE
        defaultEcritureComptableShouldBeFound("date.in=" + DEFAULT_DATE + "," + UPDATED_DATE);

        // Get all the ecritureComptableList where date equals to UPDATED_DATE
        defaultEcritureComptableShouldNotBeFound("date.in=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where date is not null
        defaultEcritureComptableShouldBeFound("date.specified=true");

        // Get all the ecritureComptableList where date is null
        defaultEcritureComptableShouldNotBeFound("date.specified=false");
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByMontantIsEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where montant equals to DEFAULT_MONTANT
        defaultEcritureComptableShouldBeFound("montant.equals=" + DEFAULT_MONTANT);

        // Get all the ecritureComptableList where montant equals to UPDATED_MONTANT
        defaultEcritureComptableShouldNotBeFound("montant.equals=" + UPDATED_MONTANT);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByMontantIsInShouldWork() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where montant in DEFAULT_MONTANT or UPDATED_MONTANT
        defaultEcritureComptableShouldBeFound("montant.in=" + DEFAULT_MONTANT + "," + UPDATED_MONTANT);

        // Get all the ecritureComptableList where montant equals to UPDATED_MONTANT
        defaultEcritureComptableShouldNotBeFound("montant.in=" + UPDATED_MONTANT);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByMontantIsNullOrNotNull() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where montant is not null
        defaultEcritureComptableShouldBeFound("montant.specified=true");

        // Get all the ecritureComptableList where montant is null
        defaultEcritureComptableShouldNotBeFound("montant.specified=false");
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByMontantIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where montant is greater than or equal to DEFAULT_MONTANT
        defaultEcritureComptableShouldBeFound("montant.greaterThanOrEqual=" + DEFAULT_MONTANT);

        // Get all the ecritureComptableList where montant is greater than or equal to UPDATED_MONTANT
        defaultEcritureComptableShouldNotBeFound("montant.greaterThanOrEqual=" + UPDATED_MONTANT);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByMontantIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where montant is less than or equal to DEFAULT_MONTANT
        defaultEcritureComptableShouldBeFound("montant.lessThanOrEqual=" + DEFAULT_MONTANT);

        // Get all the ecritureComptableList where montant is less than or equal to SMALLER_MONTANT
        defaultEcritureComptableShouldNotBeFound("montant.lessThanOrEqual=" + SMALLER_MONTANT);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByMontantIsLessThanSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where montant is less than DEFAULT_MONTANT
        defaultEcritureComptableShouldNotBeFound("montant.lessThan=" + DEFAULT_MONTANT);

        // Get all the ecritureComptableList where montant is less than UPDATED_MONTANT
        defaultEcritureComptableShouldBeFound("montant.lessThan=" + UPDATED_MONTANT);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByMontantIsGreaterThanSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where montant is greater than DEFAULT_MONTANT
        defaultEcritureComptableShouldNotBeFound("montant.greaterThan=" + DEFAULT_MONTANT);

        // Get all the ecritureComptableList where montant is greater than SMALLER_MONTANT
        defaultEcritureComptableShouldBeFound("montant.greaterThan=" + SMALLER_MONTANT);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByLibelleIsEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where libelle equals to DEFAULT_LIBELLE
        defaultEcritureComptableShouldBeFound("libelle.equals=" + DEFAULT_LIBELLE);

        // Get all the ecritureComptableList where libelle equals to UPDATED_LIBELLE
        defaultEcritureComptableShouldNotBeFound("libelle.equals=" + UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByLibelleIsInShouldWork() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where libelle in DEFAULT_LIBELLE or UPDATED_LIBELLE
        defaultEcritureComptableShouldBeFound("libelle.in=" + DEFAULT_LIBELLE + "," + UPDATED_LIBELLE);

        // Get all the ecritureComptableList where libelle equals to UPDATED_LIBELLE
        defaultEcritureComptableShouldNotBeFound("libelle.in=" + UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByLibelleIsNullOrNotNull() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where libelle is not null
        defaultEcritureComptableShouldBeFound("libelle.specified=true");

        // Get all the ecritureComptableList where libelle is null
        defaultEcritureComptableShouldNotBeFound("libelle.specified=false");
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByLibelleContainsSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where libelle contains DEFAULT_LIBELLE
        defaultEcritureComptableShouldBeFound("libelle.contains=" + DEFAULT_LIBELLE);

        // Get all the ecritureComptableList where libelle contains UPDATED_LIBELLE
        defaultEcritureComptableShouldNotBeFound("libelle.contains=" + UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByLibelleNotContainsSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where libelle does not contain DEFAULT_LIBELLE
        defaultEcritureComptableShouldNotBeFound("libelle.doesNotContain=" + DEFAULT_LIBELLE);

        // Get all the ecritureComptableList where libelle does not contain UPDATED_LIBELLE
        defaultEcritureComptableShouldBeFound("libelle.doesNotContain=" + UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByTypeEcritureIsEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where typeEcriture equals to DEFAULT_TYPE_ECRITURE
        defaultEcritureComptableShouldBeFound("typeEcriture.equals=" + DEFAULT_TYPE_ECRITURE);

        // Get all the ecritureComptableList where typeEcriture equals to UPDATED_TYPE_ECRITURE
        defaultEcritureComptableShouldNotBeFound("typeEcriture.equals=" + UPDATED_TYPE_ECRITURE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByTypeEcritureIsInShouldWork() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where typeEcriture in DEFAULT_TYPE_ECRITURE or UPDATED_TYPE_ECRITURE
        defaultEcritureComptableShouldBeFound("typeEcriture.in=" + DEFAULT_TYPE_ECRITURE + "," + UPDATED_TYPE_ECRITURE);

        // Get all the ecritureComptableList where typeEcriture equals to UPDATED_TYPE_ECRITURE
        defaultEcritureComptableShouldNotBeFound("typeEcriture.in=" + UPDATED_TYPE_ECRITURE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByTypeEcritureIsNullOrNotNull() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where typeEcriture is not null
        defaultEcritureComptableShouldBeFound("typeEcriture.specified=true");

        // Get all the ecritureComptableList where typeEcriture is null
        defaultEcritureComptableShouldNotBeFound("typeEcriture.specified=false");
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByReferenceIsEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where reference equals to DEFAULT_REFERENCE
        defaultEcritureComptableShouldBeFound("reference.equals=" + DEFAULT_REFERENCE);

        // Get all the ecritureComptableList where reference equals to UPDATED_REFERENCE
        defaultEcritureComptableShouldNotBeFound("reference.equals=" + UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByReferenceIsInShouldWork() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where reference in DEFAULT_REFERENCE or UPDATED_REFERENCE
        defaultEcritureComptableShouldBeFound("reference.in=" + DEFAULT_REFERENCE + "," + UPDATED_REFERENCE);

        // Get all the ecritureComptableList where reference equals to UPDATED_REFERENCE
        defaultEcritureComptableShouldNotBeFound("reference.in=" + UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByReferenceIsNullOrNotNull() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where reference is not null
        defaultEcritureComptableShouldBeFound("reference.specified=true");

        // Get all the ecritureComptableList where reference is null
        defaultEcritureComptableShouldNotBeFound("reference.specified=false");
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByReferenceContainsSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where reference contains DEFAULT_REFERENCE
        defaultEcritureComptableShouldBeFound("reference.contains=" + DEFAULT_REFERENCE);

        // Get all the ecritureComptableList where reference contains UPDATED_REFERENCE
        defaultEcritureComptableShouldNotBeFound("reference.contains=" + UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByReferenceNotContainsSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where reference does not contain DEFAULT_REFERENCE
        defaultEcritureComptableShouldNotBeFound("reference.doesNotContain=" + DEFAULT_REFERENCE);

        // Get all the ecritureComptableList where reference does not contain UPDATED_REFERENCE
        defaultEcritureComptableShouldBeFound("reference.doesNotContain=" + UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByAutreInfosIsEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where autreInfos equals to DEFAULT_AUTRE_INFOS
        defaultEcritureComptableShouldBeFound("autreInfos.equals=" + DEFAULT_AUTRE_INFOS);

        // Get all the ecritureComptableList where autreInfos equals to UPDATED_AUTRE_INFOS
        defaultEcritureComptableShouldNotBeFound("autreInfos.equals=" + UPDATED_AUTRE_INFOS);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByAutreInfosIsInShouldWork() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where autreInfos in DEFAULT_AUTRE_INFOS or UPDATED_AUTRE_INFOS
        defaultEcritureComptableShouldBeFound("autreInfos.in=" + DEFAULT_AUTRE_INFOS + "," + UPDATED_AUTRE_INFOS);

        // Get all the ecritureComptableList where autreInfos equals to UPDATED_AUTRE_INFOS
        defaultEcritureComptableShouldNotBeFound("autreInfos.in=" + UPDATED_AUTRE_INFOS);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByAutreInfosIsNullOrNotNull() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where autreInfos is not null
        defaultEcritureComptableShouldBeFound("autreInfos.specified=true");

        // Get all the ecritureComptableList where autreInfos is null
        defaultEcritureComptableShouldNotBeFound("autreInfos.specified=false");
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByAutreInfosContainsSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where autreInfos contains DEFAULT_AUTRE_INFOS
        defaultEcritureComptableShouldBeFound("autreInfos.contains=" + DEFAULT_AUTRE_INFOS);

        // Get all the ecritureComptableList where autreInfos contains UPDATED_AUTRE_INFOS
        defaultEcritureComptableShouldNotBeFound("autreInfos.contains=" + UPDATED_AUTRE_INFOS);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByAutreInfosNotContainsSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where autreInfos does not contain DEFAULT_AUTRE_INFOS
        defaultEcritureComptableShouldNotBeFound("autreInfos.doesNotContain=" + DEFAULT_AUTRE_INFOS);

        // Get all the ecritureComptableList where autreInfos does not contain UPDATED_AUTRE_INFOS
        defaultEcritureComptableShouldBeFound("autreInfos.doesNotContain=" + UPDATED_AUTRE_INFOS);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByPiecesIsEqualToSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where pieces equals to DEFAULT_PIECES
        defaultEcritureComptableShouldBeFound("pieces.equals=" + DEFAULT_PIECES);

        // Get all the ecritureComptableList where pieces equals to UPDATED_PIECES
        defaultEcritureComptableShouldNotBeFound("pieces.equals=" + UPDATED_PIECES);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByPiecesIsInShouldWork() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where pieces in DEFAULT_PIECES or UPDATED_PIECES
        defaultEcritureComptableShouldBeFound("pieces.in=" + DEFAULT_PIECES + "," + UPDATED_PIECES);

        // Get all the ecritureComptableList where pieces equals to UPDATED_PIECES
        defaultEcritureComptableShouldNotBeFound("pieces.in=" + UPDATED_PIECES);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByPiecesIsNullOrNotNull() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where pieces is not null
        defaultEcritureComptableShouldBeFound("pieces.specified=true");

        // Get all the ecritureComptableList where pieces is null
        defaultEcritureComptableShouldNotBeFound("pieces.specified=false");
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByPiecesContainsSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where pieces contains DEFAULT_PIECES
        defaultEcritureComptableShouldBeFound("pieces.contains=" + DEFAULT_PIECES);

        // Get all the ecritureComptableList where pieces contains UPDATED_PIECES
        defaultEcritureComptableShouldNotBeFound("pieces.contains=" + UPDATED_PIECES);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByPiecesNotContainsSomething() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        // Get all the ecritureComptableList where pieces does not contain DEFAULT_PIECES
        defaultEcritureComptableShouldNotBeFound("pieces.doesNotContain=" + DEFAULT_PIECES);

        // Get all the ecritureComptableList where pieces does not contain UPDATED_PIECES
        defaultEcritureComptableShouldBeFound("pieces.doesNotContain=" + UPDATED_PIECES);
    }

    @Test
    @Transactional
    void getAllEcritureComptablesByCompteIsEqualToSomething() throws Exception {
        Compte compte;
        if (TestUtil.findAll(em, Compte.class).isEmpty()) {
            ecritureComptableRepository.saveAndFlush(ecritureComptable);
            compte = CompteResourceIT.createEntity(em);
        } else {
            compte = TestUtil.findAll(em, Compte.class).get(0);
        }
        em.persist(compte);
        em.flush();
        ecritureComptable.setCompte(compte);
        ecritureComptableRepository.saveAndFlush(ecritureComptable);
        Long compteId = compte.getId();
        // Get all the ecritureComptableList where compte equals to compteId
        defaultEcritureComptableShouldBeFound("compteId.equals=" + compteId);

        // Get all the ecritureComptableList where compte equals to (compteId + 1)
        defaultEcritureComptableShouldNotBeFound("compteId.equals=" + (compteId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultEcritureComptableShouldBeFound(String filter) throws Exception {
        restEcritureComptableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ecritureComptable.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].montant").value(hasItem(DEFAULT_MONTANT.intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].typeEcriture").value(hasItem(DEFAULT_TYPE_ECRITURE.toString())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].autreInfos").value(hasItem(DEFAULT_AUTRE_INFOS)))
            .andExpect(jsonPath("$.[*].pieces").value(hasItem(DEFAULT_PIECES)));

        // Check, that the count call also returns 1
        restEcritureComptableMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultEcritureComptableShouldNotBeFound(String filter) throws Exception {
        restEcritureComptableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restEcritureComptableMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingEcritureComptable() throws Exception {
        // Get the ecritureComptable
        restEcritureComptableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEcritureComptable() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();

        // Update the ecritureComptable
        EcritureComptable updatedEcritureComptable = ecritureComptableRepository.findById(ecritureComptable.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEcritureComptable are not directly saved in db
        em.detach(updatedEcritureComptable);
        updatedEcritureComptable
            .date(UPDATED_DATE)
            .montant(UPDATED_MONTANT)
            .libelle(UPDATED_LIBELLE)
            .typeEcriture(UPDATED_TYPE_ECRITURE)
            .reference(UPDATED_REFERENCE)
            .autreInfos(UPDATED_AUTRE_INFOS)
            .pieces(UPDATED_PIECES);

        restEcritureComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEcritureComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEcritureComptable))
            )
            .andExpect(status().isOk());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
        EcritureComptable testEcritureComptable = ecritureComptableList.get(ecritureComptableList.size() - 1);
        assertThat(testEcritureComptable.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEcritureComptable.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testEcritureComptable.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testEcritureComptable.getTypeEcriture()).isEqualTo(UPDATED_TYPE_ECRITURE);
        assertThat(testEcritureComptable.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testEcritureComptable.getAutreInfos()).isEqualTo(UPDATED_AUTRE_INFOS);
        assertThat(testEcritureComptable.getPieces()).isEqualTo(UPDATED_PIECES);
    }

    @Test
    @Transactional
    void putNonExistingEcritureComptable() throws Exception {
        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();
        ecritureComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEcritureComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ecritureComptable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEcritureComptable() throws Exception {
        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();
        ecritureComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEcritureComptableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEcritureComptable() throws Exception {
        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();
        ecritureComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEcritureComptableMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEcritureComptableWithPatch() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();

        // Update the ecritureComptable using partial update
        EcritureComptable partialUpdatedEcritureComptable = new EcritureComptable();
        partialUpdatedEcritureComptable.setId(ecritureComptable.getId());

        partialUpdatedEcritureComptable
            .date(UPDATED_DATE)
            .montant(UPDATED_MONTANT)
            .typeEcriture(UPDATED_TYPE_ECRITURE)
            .pieces(UPDATED_PIECES);

        restEcritureComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEcritureComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEcritureComptable))
            )
            .andExpect(status().isOk());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
        EcritureComptable testEcritureComptable = ecritureComptableList.get(ecritureComptableList.size() - 1);
        assertThat(testEcritureComptable.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEcritureComptable.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testEcritureComptable.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testEcritureComptable.getTypeEcriture()).isEqualTo(UPDATED_TYPE_ECRITURE);
        assertThat(testEcritureComptable.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testEcritureComptable.getAutreInfos()).isEqualTo(DEFAULT_AUTRE_INFOS);
        assertThat(testEcritureComptable.getPieces()).isEqualTo(UPDATED_PIECES);
    }

    @Test
    @Transactional
    void fullUpdateEcritureComptableWithPatch() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();

        // Update the ecritureComptable using partial update
        EcritureComptable partialUpdatedEcritureComptable = new EcritureComptable();
        partialUpdatedEcritureComptable.setId(ecritureComptable.getId());

        partialUpdatedEcritureComptable
            .date(UPDATED_DATE)
            .montant(UPDATED_MONTANT)
            .libelle(UPDATED_LIBELLE)
            .typeEcriture(UPDATED_TYPE_ECRITURE)
            .reference(UPDATED_REFERENCE)
            .autreInfos(UPDATED_AUTRE_INFOS)
            .pieces(UPDATED_PIECES);

        restEcritureComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEcritureComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEcritureComptable))
            )
            .andExpect(status().isOk());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
        EcritureComptable testEcritureComptable = ecritureComptableList.get(ecritureComptableList.size() - 1);
        assertThat(testEcritureComptable.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEcritureComptable.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testEcritureComptable.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testEcritureComptable.getTypeEcriture()).isEqualTo(UPDATED_TYPE_ECRITURE);
        assertThat(testEcritureComptable.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testEcritureComptable.getAutreInfos()).isEqualTo(UPDATED_AUTRE_INFOS);
        assertThat(testEcritureComptable.getPieces()).isEqualTo(UPDATED_PIECES);
    }

    @Test
    @Transactional
    void patchNonExistingEcritureComptable() throws Exception {
        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();
        ecritureComptable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEcritureComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ecritureComptable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEcritureComptable() throws Exception {
        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();
        ecritureComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEcritureComptableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isBadRequest());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEcritureComptable() throws Exception {
        int databaseSizeBeforeUpdate = ecritureComptableRepository.findAll().size();
        ecritureComptable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEcritureComptableMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ecritureComptable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EcritureComptable in the database
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEcritureComptable() throws Exception {
        // Initialize the database
        ecritureComptableRepository.saveAndFlush(ecritureComptable);

        int databaseSizeBeforeDelete = ecritureComptableRepository.findAll().size();

        // Delete the ecritureComptable
        restEcritureComptableMockMvc
            .perform(delete(ENTITY_API_URL_ID, ecritureComptable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EcritureComptable> ecritureComptableList = ecritureComptableRepository.findAll();
        assertThat(ecritureComptableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
