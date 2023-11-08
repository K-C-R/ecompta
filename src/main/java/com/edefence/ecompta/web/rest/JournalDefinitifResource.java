package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.JournalDefinitif;
import com.edefence.ecompta.repository.JournalDefinitifRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.JournalDefinitif}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JournalDefinitifResource {

    private final Logger log = LoggerFactory.getLogger(JournalDefinitifResource.class);

    private static final String ENTITY_NAME = "journalDefinitif";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JournalDefinitifRepository journalDefinitifRepository;

    public JournalDefinitifResource(JournalDefinitifRepository journalDefinitifRepository) {
        this.journalDefinitifRepository = journalDefinitifRepository;
    }

    /**
     * {@code POST  /journal-definitifs} : Create a new journalDefinitif.
     *
     * @param journalDefinitif the journalDefinitif to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new journalDefinitif, or with status {@code 400 (Bad Request)} if the journalDefinitif has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/journal-definitifs")
    public ResponseEntity<JournalDefinitif> createJournalDefinitif(@Valid @RequestBody JournalDefinitif journalDefinitif)
        throws URISyntaxException {
        log.debug("REST request to save JournalDefinitif : {}", journalDefinitif);
        if (journalDefinitif.getId() != null) {
            throw new BadRequestAlertException("A new journalDefinitif cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JournalDefinitif result = journalDefinitifRepository.save(journalDefinitif);
        return ResponseEntity
            .created(new URI("/api/journal-definitifs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /journal-definitifs/:id} : Updates an existing journalDefinitif.
     *
     * @param id the id of the journalDefinitif to save.
     * @param journalDefinitif the journalDefinitif to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated journalDefinitif,
     * or with status {@code 400 (Bad Request)} if the journalDefinitif is not valid,
     * or with status {@code 500 (Internal Server Error)} if the journalDefinitif couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/journal-definitifs/{id}")
    public ResponseEntity<JournalDefinitif> updateJournalDefinitif(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody JournalDefinitif journalDefinitif
    ) throws URISyntaxException {
        log.debug("REST request to update JournalDefinitif : {}, {}", id, journalDefinitif);
        if (journalDefinitif.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, journalDefinitif.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!journalDefinitifRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JournalDefinitif result = journalDefinitifRepository.save(journalDefinitif);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, journalDefinitif.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /journal-definitifs/:id} : Partial updates given fields of an existing journalDefinitif, field will ignore if it is null
     *
     * @param id the id of the journalDefinitif to save.
     * @param journalDefinitif the journalDefinitif to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated journalDefinitif,
     * or with status {@code 400 (Bad Request)} if the journalDefinitif is not valid,
     * or with status {@code 404 (Not Found)} if the journalDefinitif is not found,
     * or with status {@code 500 (Internal Server Error)} if the journalDefinitif couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/journal-definitifs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<JournalDefinitif> partialUpdateJournalDefinitif(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody JournalDefinitif journalDefinitif
    ) throws URISyntaxException {
        log.debug("REST request to partial update JournalDefinitif partially : {}, {}", id, journalDefinitif);
        if (journalDefinitif.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, journalDefinitif.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!journalDefinitifRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JournalDefinitif> result = journalDefinitifRepository
            .findById(journalDefinitif.getId())
            .map(existingJournalDefinitif -> {
                if (journalDefinitif.getDate() != null) {
                    existingJournalDefinitif.setDate(journalDefinitif.getDate());
                }
                if (journalDefinitif.getDescription() != null) {
                    existingJournalDefinitif.setDescription(journalDefinitif.getDescription());
                }
                if (journalDefinitif.getMontant() != null) {
                    existingJournalDefinitif.setMontant(journalDefinitif.getMontant());
                }
                if (journalDefinitif.getReference() != null) {
                    existingJournalDefinitif.setReference(journalDefinitif.getReference());
                }

                return existingJournalDefinitif;
            })
            .map(journalDefinitifRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, journalDefinitif.getId().toString())
        );
    }

    /**
     * {@code GET  /journal-definitifs} : get all the journalDefinitifs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of journalDefinitifs in body.
     */
    @GetMapping("/journal-definitifs")
    public ResponseEntity<List<JournalDefinitif>> getAllJournalDefinitifs(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of JournalDefinitifs");
        Page<JournalDefinitif> page = journalDefinitifRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /journal-definitifs/:id} : get the "id" journalDefinitif.
     *
     * @param id the id of the journalDefinitif to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the journalDefinitif, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/journal-definitifs/{id}")
    public ResponseEntity<JournalDefinitif> getJournalDefinitif(@PathVariable Long id) {
        log.debug("REST request to get JournalDefinitif : {}", id);
        Optional<JournalDefinitif> journalDefinitif = journalDefinitifRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(journalDefinitif);
    }

    /**
     * {@code DELETE  /journal-definitifs/:id} : delete the "id" journalDefinitif.
     *
     * @param id the id of the journalDefinitif to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/journal-definitifs/{id}")
    public ResponseEntity<Void> deleteJournalDefinitif(@PathVariable Long id) {
        log.debug("REST request to delete JournalDefinitif : {}", id);
        journalDefinitifRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
