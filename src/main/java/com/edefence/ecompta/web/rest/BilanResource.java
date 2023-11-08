package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.Bilan;
import com.edefence.ecompta.repository.BilanRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.Bilan}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BilanResource {

    private final Logger log = LoggerFactory.getLogger(BilanResource.class);

    private static final String ENTITY_NAME = "bilan";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BilanRepository bilanRepository;

    public BilanResource(BilanRepository bilanRepository) {
        this.bilanRepository = bilanRepository;
    }

    /**
     * {@code POST  /bilans} : Create a new bilan.
     *
     * @param bilan the bilan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bilan, or with status {@code 400 (Bad Request)} if the bilan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bilans")
    public ResponseEntity<Bilan> createBilan(@RequestBody Bilan bilan) throws URISyntaxException {
        log.debug("REST request to save Bilan : {}", bilan);
        if (bilan.getId() != null) {
            throw new BadRequestAlertException("A new bilan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bilan result = bilanRepository.save(bilan);
        return ResponseEntity
            .created(new URI("/api/bilans/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bilans/:id} : Updates an existing bilan.
     *
     * @param id the id of the bilan to save.
     * @param bilan the bilan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bilan,
     * or with status {@code 400 (Bad Request)} if the bilan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bilan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bilans/{id}")
    public ResponseEntity<Bilan> updateBilan(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bilan bilan)
        throws URISyntaxException {
        log.debug("REST request to update Bilan : {}, {}", id, bilan);
        if (bilan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bilan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bilanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bilan result = bilanRepository.save(bilan);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bilan.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bilans/:id} : Partial updates given fields of an existing bilan, field will ignore if it is null
     *
     * @param id the id of the bilan to save.
     * @param bilan the bilan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bilan,
     * or with status {@code 400 (Bad Request)} if the bilan is not valid,
     * or with status {@code 404 (Not Found)} if the bilan is not found,
     * or with status {@code 500 (Internal Server Error)} if the bilan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bilans/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bilan> partialUpdateBilan(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bilan bilan)
        throws URISyntaxException {
        log.debug("REST request to partial update Bilan partially : {}, {}", id, bilan);
        if (bilan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bilan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bilanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bilan> result = bilanRepository
            .findById(bilan.getId())
            .map(existingBilan -> {
                if (bilan.getExercice() != null) {
                    existingBilan.setExercice(bilan.getExercice());
                }
                if (bilan.getActifTotal() != null) {
                    existingBilan.setActifTotal(bilan.getActifTotal());
                }
                if (bilan.getPassifTotal() != null) {
                    existingBilan.setPassifTotal(bilan.getPassifTotal());
                }

                return existingBilan;
            })
            .map(bilanRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bilan.getId().toString())
        );
    }

    /**
     * {@code GET  /bilans} : get all the bilans.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bilans in body.
     */
    @GetMapping("/bilans")
    public List<Bilan> getAllBilans() {
        log.debug("REST request to get all Bilans");
        return bilanRepository.findAll();
    }

    /**
     * {@code GET  /bilans/:id} : get the "id" bilan.
     *
     * @param id the id of the bilan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bilan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bilans/{id}")
    public ResponseEntity<Bilan> getBilan(@PathVariable Long id) {
        log.debug("REST request to get Bilan : {}", id);
        Optional<Bilan> bilan = bilanRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bilan);
    }

    /**
     * {@code DELETE  /bilans/:id} : delete the "id" bilan.
     *
     * @param id the id of the bilan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bilans/{id}")
    public ResponseEntity<Void> deleteBilan(@PathVariable Long id) {
        log.debug("REST request to delete Bilan : {}", id);
        bilanRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
