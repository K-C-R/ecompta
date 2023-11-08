package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.CompteComptable;
import com.edefence.ecompta.repository.CompteComptableRepository;
import com.edefence.ecompta.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.edefence.ecompta.domain.CompteComptable}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompteComptableResource {

    private final Logger log = LoggerFactory.getLogger(CompteComptableResource.class);

    private static final String ENTITY_NAME = "compteComptable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompteComptableRepository compteComptableRepository;

    public CompteComptableResource(CompteComptableRepository compteComptableRepository) {
        this.compteComptableRepository = compteComptableRepository;
    }

    /**
     * {@code POST  /compte-comptables} : Create a new compteComptable.
     *
     * @param compteComptable the compteComptable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new compteComptable, or with status {@code 400 (Bad Request)} if the compteComptable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/compte-comptables")
    public ResponseEntity<CompteComptable> createCompteComptable(@Valid @RequestBody CompteComptable compteComptable)
        throws URISyntaxException {
        log.debug("REST request to save CompteComptable : {}", compteComptable);
        if (compteComptable.getId() != null) {
            throw new BadRequestAlertException("A new compteComptable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompteComptable result = compteComptableRepository.save(compteComptable);
        return ResponseEntity
            .created(new URI("/api/compte-comptables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /compte-comptables/:id} : Updates an existing compteComptable.
     *
     * @param id the id of the compteComptable to save.
     * @param compteComptable the compteComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compteComptable,
     * or with status {@code 400 (Bad Request)} if the compteComptable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the compteComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/compte-comptables/{id}")
    public ResponseEntity<CompteComptable> updateCompteComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CompteComptable compteComptable
    ) throws URISyntaxException {
        log.debug("REST request to update CompteComptable : {}, {}", id, compteComptable);
        if (compteComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compteComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compteComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompteComptable result = compteComptableRepository.save(compteComptable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, compteComptable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /compte-comptables/:id} : Partial updates given fields of an existing compteComptable, field will ignore if it is null
     *
     * @param id the id of the compteComptable to save.
     * @param compteComptable the compteComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compteComptable,
     * or with status {@code 400 (Bad Request)} if the compteComptable is not valid,
     * or with status {@code 404 (Not Found)} if the compteComptable is not found,
     * or with status {@code 500 (Internal Server Error)} if the compteComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/compte-comptables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompteComptable> partialUpdateCompteComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CompteComptable compteComptable
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompteComptable partially : {}, {}", id, compteComptable);
        if (compteComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compteComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compteComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompteComptable> result = compteComptableRepository
            .findById(compteComptable.getId())
            .map(existingCompteComptable -> {
                if (compteComptable.getNumero() != null) {
                    existingCompteComptable.setNumero(compteComptable.getNumero());
                }
                if (compteComptable.getNom() != null) {
                    existingCompteComptable.setNom(compteComptable.getNom());
                }
                if (compteComptable.getDescription() != null) {
                    existingCompteComptable.setDescription(compteComptable.getDescription());
                }

                return existingCompteComptable;
            })
            .map(compteComptableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, compteComptable.getId().toString())
        );
    }

    /**
     * {@code GET  /compte-comptables} : get all the compteComptables.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of compteComptables in body.
     */
    @GetMapping("/compte-comptables")
    public ResponseEntity<List<CompteComptable>> getAllCompteComptables(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of CompteComptables");
        Page<CompteComptable> page = compteComptableRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /compte-comptables/:id} : get the "id" compteComptable.
     *
     * @param id the id of the compteComptable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the compteComptable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/compte-comptables/{id}")
    public ResponseEntity<CompteComptable> getCompteComptable(@PathVariable Long id) {
        log.debug("REST request to get CompteComptable : {}", id);
        Optional<CompteComptable> compteComptable = compteComptableRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(compteComptable);
    }

    /**
     * {@code DELETE  /compte-comptables/:id} : delete the "id" compteComptable.
     *
     * @param id the id of the compteComptable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/compte-comptables/{id}")
    public ResponseEntity<Void> deleteCompteComptable(@PathVariable Long id) {
        log.debug("REST request to delete CompteComptable : {}", id);
        compteComptableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
