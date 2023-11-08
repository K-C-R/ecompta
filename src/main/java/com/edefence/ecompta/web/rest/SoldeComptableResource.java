package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.SoldeComptable;
import com.edefence.ecompta.repository.SoldeComptableRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.SoldeComptable}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SoldeComptableResource {

    private final Logger log = LoggerFactory.getLogger(SoldeComptableResource.class);

    private static final String ENTITY_NAME = "soldeComptable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SoldeComptableRepository soldeComptableRepository;

    public SoldeComptableResource(SoldeComptableRepository soldeComptableRepository) {
        this.soldeComptableRepository = soldeComptableRepository;
    }

    /**
     * {@code POST  /solde-comptables} : Create a new soldeComptable.
     *
     * @param soldeComptable the soldeComptable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new soldeComptable, or with status {@code 400 (Bad Request)} if the soldeComptable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/solde-comptables")
    public ResponseEntity<SoldeComptable> createSoldeComptable(@RequestBody SoldeComptable soldeComptable) throws URISyntaxException {
        log.debug("REST request to save SoldeComptable : {}", soldeComptable);
        if (soldeComptable.getId() != null) {
            throw new BadRequestAlertException("A new soldeComptable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SoldeComptable result = soldeComptableRepository.save(soldeComptable);
        return ResponseEntity
            .created(new URI("/api/solde-comptables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /solde-comptables/:id} : Updates an existing soldeComptable.
     *
     * @param id the id of the soldeComptable to save.
     * @param soldeComptable the soldeComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated soldeComptable,
     * or with status {@code 400 (Bad Request)} if the soldeComptable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the soldeComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/solde-comptables/{id}")
    public ResponseEntity<SoldeComptable> updateSoldeComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SoldeComptable soldeComptable
    ) throws URISyntaxException {
        log.debug("REST request to update SoldeComptable : {}, {}", id, soldeComptable);
        if (soldeComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, soldeComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!soldeComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SoldeComptable result = soldeComptableRepository.save(soldeComptable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, soldeComptable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /solde-comptables/:id} : Partial updates given fields of an existing soldeComptable, field will ignore if it is null
     *
     * @param id the id of the soldeComptable to save.
     * @param soldeComptable the soldeComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated soldeComptable,
     * or with status {@code 400 (Bad Request)} if the soldeComptable is not valid,
     * or with status {@code 404 (Not Found)} if the soldeComptable is not found,
     * or with status {@code 500 (Internal Server Error)} if the soldeComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/solde-comptables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SoldeComptable> partialUpdateSoldeComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SoldeComptable soldeComptable
    ) throws URISyntaxException {
        log.debug("REST request to partial update SoldeComptable partially : {}, {}", id, soldeComptable);
        if (soldeComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, soldeComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!soldeComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SoldeComptable> result = soldeComptableRepository
            .findById(soldeComptable.getId())
            .map(existingSoldeComptable -> {
                if (soldeComptable.getSolde() != null) {
                    existingSoldeComptable.setSolde(soldeComptable.getSolde());
                }

                return existingSoldeComptable;
            })
            .map(soldeComptableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, soldeComptable.getId().toString())
        );
    }

    /**
     * {@code GET  /solde-comptables} : get all the soldeComptables.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of soldeComptables in body.
     */
    @GetMapping("/solde-comptables")
    public List<SoldeComptable> getAllSoldeComptables() {
        log.debug("REST request to get all SoldeComptables");
        return soldeComptableRepository.findAll();
    }

    /**
     * {@code GET  /solde-comptables/:id} : get the "id" soldeComptable.
     *
     * @param id the id of the soldeComptable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the soldeComptable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/solde-comptables/{id}")
    public ResponseEntity<SoldeComptable> getSoldeComptable(@PathVariable Long id) {
        log.debug("REST request to get SoldeComptable : {}", id);
        Optional<SoldeComptable> soldeComptable = soldeComptableRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(soldeComptable);
    }

    /**
     * {@code DELETE  /solde-comptables/:id} : delete the "id" soldeComptable.
     *
     * @param id the id of the soldeComptable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/solde-comptables/{id}")
    public ResponseEntity<Void> deleteSoldeComptable(@PathVariable Long id) {
        log.debug("REST request to delete SoldeComptable : {}", id);
        soldeComptableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
