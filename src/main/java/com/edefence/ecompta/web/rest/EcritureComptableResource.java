package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.EcritureComptable;
import com.edefence.ecompta.repository.EcritureComptableRepository;
import com.edefence.ecompta.service.EcritureComptableQueryService;
import com.edefence.ecompta.service.EcritureComptableService;
import com.edefence.ecompta.service.criteria.EcritureComptableCriteria;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.edefence.ecompta.domain.EcritureComptable}.
 */
@RestController
@RequestMapping("/api")
public class EcritureComptableResource {

    private final Logger log = LoggerFactory.getLogger(EcritureComptableResource.class);

    private static final String ENTITY_NAME = "ecritureComptable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EcritureComptableService ecritureComptableService;

    private final EcritureComptableRepository ecritureComptableRepository;

    private final EcritureComptableQueryService ecritureComptableQueryService;

    public EcritureComptableResource(
        EcritureComptableService ecritureComptableService,
        EcritureComptableRepository ecritureComptableRepository,
        EcritureComptableQueryService ecritureComptableQueryService
    ) {
        this.ecritureComptableService = ecritureComptableService;
        this.ecritureComptableRepository = ecritureComptableRepository;
        this.ecritureComptableQueryService = ecritureComptableQueryService;
    }

    /**
     * {@code POST  /ecriture-comptables} : Create a new ecritureComptable.
     *
     * @param ecritureComptable the ecritureComptable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ecritureComptable, or with status {@code 400 (Bad Request)} if the ecritureComptable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ecriture-comptables")
    public ResponseEntity<EcritureComptable> createEcritureComptable(@Valid @RequestBody EcritureComptable ecritureComptable)
        throws URISyntaxException {
        log.debug("REST request to save EcritureComptable : {}", ecritureComptable);
        if (ecritureComptable.getId() != null) {
            throw new BadRequestAlertException("A new ecritureComptable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EcritureComptable result = ecritureComptableService.save(ecritureComptable);
        return ResponseEntity
            .created(new URI("/api/ecriture-comptables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ecriture-comptables/:id} : Updates an existing ecritureComptable.
     *
     * @param id the id of the ecritureComptable to save.
     * @param ecritureComptable the ecritureComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ecritureComptable,
     * or with status {@code 400 (Bad Request)} if the ecritureComptable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ecritureComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ecriture-comptables/{id}")
    public ResponseEntity<EcritureComptable> updateEcritureComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EcritureComptable ecritureComptable
    ) throws URISyntaxException {
        log.debug("REST request to update EcritureComptable : {}, {}", id, ecritureComptable);
        if (ecritureComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ecritureComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ecritureComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EcritureComptable result = ecritureComptableService.update(ecritureComptable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ecritureComptable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ecriture-comptables/:id} : Partial updates given fields of an existing ecritureComptable, field will ignore if it is null
     *
     * @param id the id of the ecritureComptable to save.
     * @param ecritureComptable the ecritureComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ecritureComptable,
     * or with status {@code 400 (Bad Request)} if the ecritureComptable is not valid,
     * or with status {@code 404 (Not Found)} if the ecritureComptable is not found,
     * or with status {@code 500 (Internal Server Error)} if the ecritureComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ecriture-comptables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EcritureComptable> partialUpdateEcritureComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EcritureComptable ecritureComptable
    ) throws URISyntaxException {
        log.debug("REST request to partial update EcritureComptable partially : {}, {}", id, ecritureComptable);
        if (ecritureComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ecritureComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ecritureComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EcritureComptable> result = ecritureComptableService.partialUpdate(ecritureComptable);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ecritureComptable.getId().toString())
        );
    }

    /**
     * {@code GET  /ecriture-comptables} : get all the ecritureComptables.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ecritureComptables in body.
     */
    @GetMapping("/ecriture-comptables")
    public ResponseEntity<List<EcritureComptable>> getAllEcritureComptables(
        EcritureComptableCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get EcritureComptables by criteria: {}", criteria);

        Page<EcritureComptable> page = ecritureComptableQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /ecriture-comptables/count} : count all the ecritureComptables.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/ecriture-comptables/count")
    public ResponseEntity<Long> countEcritureComptables(EcritureComptableCriteria criteria) {
        log.debug("REST request to count EcritureComptables by criteria: {}", criteria);
        return ResponseEntity.ok().body(ecritureComptableQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /ecriture-comptables/:id} : get the "id" ecritureComptable.
     *
     * @param id the id of the ecritureComptable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ecritureComptable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ecriture-comptables/{id}")
    public ResponseEntity<EcritureComptable> getEcritureComptable(@PathVariable Long id) {
        log.debug("REST request to get EcritureComptable : {}", id);
        Optional<EcritureComptable> ecritureComptable = ecritureComptableService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ecritureComptable);
    }

    /**
     * {@code DELETE  /ecriture-comptables/:id} : delete the "id" ecritureComptable.
     *
     * @param id the id of the ecritureComptable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ecriture-comptables/{id}")
    public ResponseEntity<Void> deleteEcritureComptable(@PathVariable Long id) {
        log.debug("REST request to delete EcritureComptable : {}", id);
        ecritureComptableService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
