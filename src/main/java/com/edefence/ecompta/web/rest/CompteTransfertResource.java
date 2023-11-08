package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.CompteTransfert;
import com.edefence.ecompta.repository.CompteTransfertRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.CompteTransfert}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompteTransfertResource {

    private final Logger log = LoggerFactory.getLogger(CompteTransfertResource.class);

    private static final String ENTITY_NAME = "compteTransfert";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompteTransfertRepository compteTransfertRepository;

    public CompteTransfertResource(CompteTransfertRepository compteTransfertRepository) {
        this.compteTransfertRepository = compteTransfertRepository;
    }

    /**
     * {@code POST  /compte-transferts} : Create a new compteTransfert.
     *
     * @param compteTransfert the compteTransfert to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new compteTransfert, or with status {@code 400 (Bad Request)} if the compteTransfert has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/compte-transferts")
    public ResponseEntity<CompteTransfert> createCompteTransfert(@RequestBody CompteTransfert compteTransfert) throws URISyntaxException {
        log.debug("REST request to save CompteTransfert : {}", compteTransfert);
        if (compteTransfert.getId() != null) {
            throw new BadRequestAlertException("A new compteTransfert cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompteTransfert result = compteTransfertRepository.save(compteTransfert);
        return ResponseEntity
            .created(new URI("/api/compte-transferts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /compte-transferts/:id} : Updates an existing compteTransfert.
     *
     * @param id the id of the compteTransfert to save.
     * @param compteTransfert the compteTransfert to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compteTransfert,
     * or with status {@code 400 (Bad Request)} if the compteTransfert is not valid,
     * or with status {@code 500 (Internal Server Error)} if the compteTransfert couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/compte-transferts/{id}")
    public ResponseEntity<CompteTransfert> updateCompteTransfert(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompteTransfert compteTransfert
    ) throws URISyntaxException {
        log.debug("REST request to update CompteTransfert : {}, {}", id, compteTransfert);
        if (compteTransfert.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compteTransfert.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compteTransfertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompteTransfert result = compteTransfertRepository.save(compteTransfert);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, compteTransfert.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /compte-transferts/:id} : Partial updates given fields of an existing compteTransfert, field will ignore if it is null
     *
     * @param id the id of the compteTransfert to save.
     * @param compteTransfert the compteTransfert to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compteTransfert,
     * or with status {@code 400 (Bad Request)} if the compteTransfert is not valid,
     * or with status {@code 404 (Not Found)} if the compteTransfert is not found,
     * or with status {@code 500 (Internal Server Error)} if the compteTransfert couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/compte-transferts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompteTransfert> partialUpdateCompteTransfert(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompteTransfert compteTransfert
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompteTransfert partially : {}, {}", id, compteTransfert);
        if (compteTransfert.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compteTransfert.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compteTransfertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompteTransfert> result = compteTransfertRepository
            .findById(compteTransfert.getId())
            .map(existingCompteTransfert -> {
                if (compteTransfert.getNumeroCompte() != null) {
                    existingCompteTransfert.setNumeroCompte(compteTransfert.getNumeroCompte());
                }
                if (compteTransfert.getNom() != null) {
                    existingCompteTransfert.setNom(compteTransfert.getNom());
                }
                if (compteTransfert.getDescription() != null) {
                    existingCompteTransfert.setDescription(compteTransfert.getDescription());
                }

                return existingCompteTransfert;
            })
            .map(compteTransfertRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, compteTransfert.getId().toString())
        );
    }

    /**
     * {@code GET  /compte-transferts} : get all the compteTransferts.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of compteTransferts in body.
     */
    @GetMapping("/compte-transferts")
    public List<CompteTransfert> getAllCompteTransferts(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all CompteTransferts");
        if (eagerload) {
            return compteTransfertRepository.findAllWithEagerRelationships();
        } else {
            return compteTransfertRepository.findAll();
        }
    }

    /**
     * {@code GET  /compte-transferts/:id} : get the "id" compteTransfert.
     *
     * @param id the id of the compteTransfert to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the compteTransfert, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/compte-transferts/{id}")
    public ResponseEntity<CompteTransfert> getCompteTransfert(@PathVariable Long id) {
        log.debug("REST request to get CompteTransfert : {}", id);
        Optional<CompteTransfert> compteTransfert = compteTransfertRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(compteTransfert);
    }

    /**
     * {@code DELETE  /compte-transferts/:id} : delete the "id" compteTransfert.
     *
     * @param id the id of the compteTransfert to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/compte-transferts/{id}")
    public ResponseEntity<Void> deleteCompteTransfert(@PathVariable Long id) {
        log.debug("REST request to delete CompteTransfert : {}", id);
        compteTransfertRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
