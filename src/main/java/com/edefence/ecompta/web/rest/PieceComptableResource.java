package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.PieceComptable;
import com.edefence.ecompta.repository.PieceComptableRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.PieceComptable}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PieceComptableResource {

    private final Logger log = LoggerFactory.getLogger(PieceComptableResource.class);

    private static final String ENTITY_NAME = "pieceComptable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PieceComptableRepository pieceComptableRepository;

    public PieceComptableResource(PieceComptableRepository pieceComptableRepository) {
        this.pieceComptableRepository = pieceComptableRepository;
    }

    /**
     * {@code POST  /piece-comptables} : Create a new pieceComptable.
     *
     * @param pieceComptable the pieceComptable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pieceComptable, or with status {@code 400 (Bad Request)} if the pieceComptable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/piece-comptables")
    public ResponseEntity<PieceComptable> createPieceComptable(@RequestBody PieceComptable pieceComptable) throws URISyntaxException {
        log.debug("REST request to save PieceComptable : {}", pieceComptable);
        if (pieceComptable.getId() != null) {
            throw new BadRequestAlertException("A new pieceComptable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PieceComptable result = pieceComptableRepository.save(pieceComptable);
        return ResponseEntity
            .created(new URI("/api/piece-comptables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /piece-comptables/:id} : Updates an existing pieceComptable.
     *
     * @param id the id of the pieceComptable to save.
     * @param pieceComptable the pieceComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pieceComptable,
     * or with status {@code 400 (Bad Request)} if the pieceComptable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pieceComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/piece-comptables/{id}")
    public ResponseEntity<PieceComptable> updatePieceComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PieceComptable pieceComptable
    ) throws URISyntaxException {
        log.debug("REST request to update PieceComptable : {}, {}", id, pieceComptable);
        if (pieceComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pieceComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pieceComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PieceComptable result = pieceComptableRepository.save(pieceComptable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pieceComptable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /piece-comptables/:id} : Partial updates given fields of an existing pieceComptable, field will ignore if it is null
     *
     * @param id the id of the pieceComptable to save.
     * @param pieceComptable the pieceComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pieceComptable,
     * or with status {@code 400 (Bad Request)} if the pieceComptable is not valid,
     * or with status {@code 404 (Not Found)} if the pieceComptable is not found,
     * or with status {@code 500 (Internal Server Error)} if the pieceComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/piece-comptables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PieceComptable> partialUpdatePieceComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PieceComptable pieceComptable
    ) throws URISyntaxException {
        log.debug("REST request to partial update PieceComptable partially : {}, {}", id, pieceComptable);
        if (pieceComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pieceComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pieceComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PieceComptable> result = pieceComptableRepository
            .findById(pieceComptable.getId())
            .map(existingPieceComptable -> {
                if (pieceComptable.getNumeroPiece() != null) {
                    existingPieceComptable.setNumeroPiece(pieceComptable.getNumeroPiece());
                }
                if (pieceComptable.getDatePiece() != null) {
                    existingPieceComptable.setDatePiece(pieceComptable.getDatePiece());
                }
                if (pieceComptable.getDescription() != null) {
                    existingPieceComptable.setDescription(pieceComptable.getDescription());
                }

                return existingPieceComptable;
            })
            .map(pieceComptableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pieceComptable.getId().toString())
        );
    }

    /**
     * {@code GET  /piece-comptables} : get all the pieceComptables.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pieceComptables in body.
     */
    @GetMapping("/piece-comptables")
    public List<PieceComptable> getAllPieceComptables(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all PieceComptables");
        if (eagerload) {
            return pieceComptableRepository.findAllWithEagerRelationships();
        } else {
            return pieceComptableRepository.findAll();
        }
    }

    /**
     * {@code GET  /piece-comptables/:id} : get the "id" pieceComptable.
     *
     * @param id the id of the pieceComptable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pieceComptable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/piece-comptables/{id}")
    public ResponseEntity<PieceComptable> getPieceComptable(@PathVariable Long id) {
        log.debug("REST request to get PieceComptable : {}", id);
        Optional<PieceComptable> pieceComptable = pieceComptableRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(pieceComptable);
    }

    /**
     * {@code DELETE  /piece-comptables/:id} : delete the "id" pieceComptable.
     *
     * @param id the id of the pieceComptable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/piece-comptables/{id}")
    public ResponseEntity<Void> deletePieceComptable(@PathVariable Long id) {
        log.debug("REST request to delete PieceComptable : {}", id);
        pieceComptableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
