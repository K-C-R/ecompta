package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.CompteDeResultat;
import com.edefence.ecompta.repository.CompteDeResultatRepository;
import com.edefence.ecompta.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.edefence.ecompta.domain.CompteDeResultat}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompteDeResultatResource {

    private final Logger log = LoggerFactory.getLogger(CompteDeResultatResource.class);

    private static final String ENTITY_NAME = "compteDeResultat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompteDeResultatRepository compteDeResultatRepository;

    public CompteDeResultatResource(CompteDeResultatRepository compteDeResultatRepository) {
        this.compteDeResultatRepository = compteDeResultatRepository;
    }

    /**
     * {@code POST  /compte-de-resultats} : Create a new compteDeResultat.
     *
     * @param compteDeResultat the compteDeResultat to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new compteDeResultat, or with status {@code 400 (Bad Request)} if the compteDeResultat has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/compte-de-resultats")
    public ResponseEntity<CompteDeResultat> createCompteDeResultat(@RequestBody CompteDeResultat compteDeResultat)
        throws URISyntaxException {
        log.debug("REST request to save CompteDeResultat : {}", compteDeResultat);
        if (compteDeResultat.getId() != null) {
            throw new BadRequestAlertException("A new compteDeResultat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompteDeResultat result = compteDeResultatRepository.save(compteDeResultat);
        return ResponseEntity
            .created(new URI("/api/compte-de-resultats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /compte-de-resultats/:id} : Updates an existing compteDeResultat.
     *
     * @param id the id of the compteDeResultat to save.
     * @param compteDeResultat the compteDeResultat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compteDeResultat,
     * or with status {@code 400 (Bad Request)} if the compteDeResultat is not valid,
     * or with status {@code 500 (Internal Server Error)} if the compteDeResultat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/compte-de-resultats/{id}")
    public ResponseEntity<CompteDeResultat> updateCompteDeResultat(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompteDeResultat compteDeResultat
    ) throws URISyntaxException {
        log.debug("REST request to update CompteDeResultat : {}, {}", id, compteDeResultat);
        if (compteDeResultat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compteDeResultat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compteDeResultatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompteDeResultat result = compteDeResultatRepository.save(compteDeResultat);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, compteDeResultat.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /compte-de-resultats/:id} : Partial updates given fields of an existing compteDeResultat, field will ignore if it is null
     *
     * @param id the id of the compteDeResultat to save.
     * @param compteDeResultat the compteDeResultat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compteDeResultat,
     * or with status {@code 400 (Bad Request)} if the compteDeResultat is not valid,
     * or with status {@code 404 (Not Found)} if the compteDeResultat is not found,
     * or with status {@code 500 (Internal Server Error)} if the compteDeResultat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/compte-de-resultats/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompteDeResultat> partialUpdateCompteDeResultat(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompteDeResultat compteDeResultat
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompteDeResultat partially : {}, {}", id, compteDeResultat);
        if (compteDeResultat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compteDeResultat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compteDeResultatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompteDeResultat> result = compteDeResultatRepository
            .findById(compteDeResultat.getId())
            .map(existingCompteDeResultat -> {
                if (compteDeResultat.getExercice() != null) {
                    existingCompteDeResultat.setExercice(compteDeResultat.getExercice());
                }
                if (compteDeResultat.getProduitsTotal() != null) {
                    existingCompteDeResultat.setProduitsTotal(compteDeResultat.getProduitsTotal());
                }
                if (compteDeResultat.getChargesTotal() != null) {
                    existingCompteDeResultat.setChargesTotal(compteDeResultat.getChargesTotal());
                }
                if (compteDeResultat.getResultatNet() != null) {
                    existingCompteDeResultat.setResultatNet(compteDeResultat.getResultatNet());
                }

                return existingCompteDeResultat;
            })
            .map(compteDeResultatRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, compteDeResultat.getId().toString())
        );
    }

    /**
     * {@code GET  /compte-de-resultats} : get all the compteDeResultats.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of compteDeResultats in body.
     */
    @GetMapping("/compte-de-resultats")
    public List<CompteDeResultat> getAllCompteDeResultats() {
        log.debug("REST request to get all CompteDeResultats");
        return compteDeResultatRepository.findAll();
    }

    /**
     * {@code GET  /compte-de-resultats/:id} : get the "id" compteDeResultat.
     *
     * @param id the id of the compteDeResultat to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the compteDeResultat, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/compte-de-resultats/{id}")
    public ResponseEntity<CompteDeResultat> getCompteDeResultat(@PathVariable Long id) {
        log.debug("REST request to get CompteDeResultat : {}", id);
        Optional<CompteDeResultat> compteDeResultat = compteDeResultatRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(compteDeResultat);
    }

    /**
     * {@code DELETE  /compte-de-resultats/:id} : delete the "id" compteDeResultat.
     *
     * @param id the id of the compteDeResultat to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/compte-de-resultats/{id}")
    public ResponseEntity<Void> deleteCompteDeResultat(@PathVariable Long id) {
        log.debug("REST request to delete CompteDeResultat : {}", id);
        compteDeResultatRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
