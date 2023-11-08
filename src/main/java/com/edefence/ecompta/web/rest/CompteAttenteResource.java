package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.CompteAttente;
import com.edefence.ecompta.repository.CompteAttenteRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.CompteAttente}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompteAttenteResource {

    private final Logger log = LoggerFactory.getLogger(CompteAttenteResource.class);

    private static final String ENTITY_NAME = "compteAttente";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompteAttenteRepository compteAttenteRepository;

    public CompteAttenteResource(CompteAttenteRepository compteAttenteRepository) {
        this.compteAttenteRepository = compteAttenteRepository;
    }

    /**
     * {@code POST  /compte-attentes} : Create a new compteAttente.
     *
     * @param compteAttente the compteAttente to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new compteAttente, or with status {@code 400 (Bad Request)} if the compteAttente has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/compte-attentes")
    public ResponseEntity<CompteAttente> createCompteAttente(@RequestBody CompteAttente compteAttente) throws URISyntaxException {
        log.debug("REST request to save CompteAttente : {}", compteAttente);
        if (compteAttente.getId() != null) {
            throw new BadRequestAlertException("A new compteAttente cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompteAttente result = compteAttenteRepository.save(compteAttente);
        return ResponseEntity
            .created(new URI("/api/compte-attentes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /compte-attentes/:id} : Updates an existing compteAttente.
     *
     * @param id the id of the compteAttente to save.
     * @param compteAttente the compteAttente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compteAttente,
     * or with status {@code 400 (Bad Request)} if the compteAttente is not valid,
     * or with status {@code 500 (Internal Server Error)} if the compteAttente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/compte-attentes/{id}")
    public ResponseEntity<CompteAttente> updateCompteAttente(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompteAttente compteAttente
    ) throws URISyntaxException {
        log.debug("REST request to update CompteAttente : {}, {}", id, compteAttente);
        if (compteAttente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compteAttente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compteAttenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompteAttente result = compteAttenteRepository.save(compteAttente);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, compteAttente.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /compte-attentes/:id} : Partial updates given fields of an existing compteAttente, field will ignore if it is null
     *
     * @param id the id of the compteAttente to save.
     * @param compteAttente the compteAttente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compteAttente,
     * or with status {@code 400 (Bad Request)} if the compteAttente is not valid,
     * or with status {@code 404 (Not Found)} if the compteAttente is not found,
     * or with status {@code 500 (Internal Server Error)} if the compteAttente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/compte-attentes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompteAttente> partialUpdateCompteAttente(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompteAttente compteAttente
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompteAttente partially : {}, {}", id, compteAttente);
        if (compteAttente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compteAttente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compteAttenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompteAttente> result = compteAttenteRepository
            .findById(compteAttente.getId())
            .map(existingCompteAttente -> {
                if (compteAttente.getNumeroCompte() != null) {
                    existingCompteAttente.setNumeroCompte(compteAttente.getNumeroCompte());
                }
                if (compteAttente.getNom() != null) {
                    existingCompteAttente.setNom(compteAttente.getNom());
                }
                if (compteAttente.getDescription() != null) {
                    existingCompteAttente.setDescription(compteAttente.getDescription());
                }

                return existingCompteAttente;
            })
            .map(compteAttenteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, compteAttente.getId().toString())
        );
    }

    /**
     * {@code GET  /compte-attentes} : get all the compteAttentes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of compteAttentes in body.
     */
    @GetMapping("/compte-attentes")
    public List<CompteAttente> getAllCompteAttentes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all CompteAttentes");
        if (eagerload) {
            return compteAttenteRepository.findAllWithEagerRelationships();
        } else {
            return compteAttenteRepository.findAll();
        }
    }

    /**
     * {@code GET  /compte-attentes/:id} : get the "id" compteAttente.
     *
     * @param id the id of the compteAttente to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the compteAttente, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/compte-attentes/{id}")
    public ResponseEntity<CompteAttente> getCompteAttente(@PathVariable Long id) {
        log.debug("REST request to get CompteAttente : {}", id);
        Optional<CompteAttente> compteAttente = compteAttenteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(compteAttente);
    }

    /**
     * {@code DELETE  /compte-attentes/:id} : delete the "id" compteAttente.
     *
     * @param id the id of the compteAttente to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/compte-attentes/{id}")
    public ResponseEntity<Void> deleteCompteAttente(@PathVariable Long id) {
        log.debug("REST request to delete CompteAttente : {}", id);
        compteAttenteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
