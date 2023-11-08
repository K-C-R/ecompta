package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.RapportsPersonnalises;
import com.edefence.ecompta.repository.RapportsPersonnalisesRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.RapportsPersonnalises}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RapportsPersonnalisesResource {

    private final Logger log = LoggerFactory.getLogger(RapportsPersonnalisesResource.class);

    private static final String ENTITY_NAME = "rapportsPersonnalises";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RapportsPersonnalisesRepository rapportsPersonnalisesRepository;

    public RapportsPersonnalisesResource(RapportsPersonnalisesRepository rapportsPersonnalisesRepository) {
        this.rapportsPersonnalisesRepository = rapportsPersonnalisesRepository;
    }

    /**
     * {@code POST  /rapports-personnalises} : Create a new rapportsPersonnalises.
     *
     * @param rapportsPersonnalises the rapportsPersonnalises to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rapportsPersonnalises, or with status {@code 400 (Bad Request)} if the rapportsPersonnalises has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rapports-personnalises")
    public ResponseEntity<RapportsPersonnalises> createRapportsPersonnalises(@RequestBody RapportsPersonnalises rapportsPersonnalises)
        throws URISyntaxException {
        log.debug("REST request to save RapportsPersonnalises : {}", rapportsPersonnalises);
        if (rapportsPersonnalises.getId() != null) {
            throw new BadRequestAlertException("A new rapportsPersonnalises cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RapportsPersonnalises result = rapportsPersonnalisesRepository.save(rapportsPersonnalises);
        return ResponseEntity
            .created(new URI("/api/rapports-personnalises/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rapports-personnalises/:id} : Updates an existing rapportsPersonnalises.
     *
     * @param id the id of the rapportsPersonnalises to save.
     * @param rapportsPersonnalises the rapportsPersonnalises to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rapportsPersonnalises,
     * or with status {@code 400 (Bad Request)} if the rapportsPersonnalises is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rapportsPersonnalises couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rapports-personnalises/{id}")
    public ResponseEntity<RapportsPersonnalises> updateRapportsPersonnalises(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RapportsPersonnalises rapportsPersonnalises
    ) throws URISyntaxException {
        log.debug("REST request to update RapportsPersonnalises : {}, {}", id, rapportsPersonnalises);
        if (rapportsPersonnalises.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rapportsPersonnalises.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rapportsPersonnalisesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RapportsPersonnalises result = rapportsPersonnalisesRepository.save(rapportsPersonnalises);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rapportsPersonnalises.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rapports-personnalises/:id} : Partial updates given fields of an existing rapportsPersonnalises, field will ignore if it is null
     *
     * @param id the id of the rapportsPersonnalises to save.
     * @param rapportsPersonnalises the rapportsPersonnalises to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rapportsPersonnalises,
     * or with status {@code 400 (Bad Request)} if the rapportsPersonnalises is not valid,
     * or with status {@code 404 (Not Found)} if the rapportsPersonnalises is not found,
     * or with status {@code 500 (Internal Server Error)} if the rapportsPersonnalises couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rapports-personnalises/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RapportsPersonnalises> partialUpdateRapportsPersonnalises(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RapportsPersonnalises rapportsPersonnalises
    ) throws URISyntaxException {
        log.debug("REST request to partial update RapportsPersonnalises partially : {}, {}", id, rapportsPersonnalises);
        if (rapportsPersonnalises.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rapportsPersonnalises.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rapportsPersonnalisesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RapportsPersonnalises> result = rapportsPersonnalisesRepository
            .findById(rapportsPersonnalises.getId())
            .map(existingRapportsPersonnalises -> {
                if (rapportsPersonnalises.getNom() != null) {
                    existingRapportsPersonnalises.setNom(rapportsPersonnalises.getNom());
                }
                if (rapportsPersonnalises.getDescription() != null) {
                    existingRapportsPersonnalises.setDescription(rapportsPersonnalises.getDescription());
                }
                if (rapportsPersonnalises.getContenu() != null) {
                    existingRapportsPersonnalises.setContenu(rapportsPersonnalises.getContenu());
                }

                return existingRapportsPersonnalises;
            })
            .map(rapportsPersonnalisesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rapportsPersonnalises.getId().toString())
        );
    }

    /**
     * {@code GET  /rapports-personnalises} : get all the rapportsPersonnalises.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rapportsPersonnalises in body.
     */
    @GetMapping("/rapports-personnalises")
    public List<RapportsPersonnalises> getAllRapportsPersonnalises() {
        log.debug("REST request to get all RapportsPersonnalises");
        return rapportsPersonnalisesRepository.findAll();
    }

    /**
     * {@code GET  /rapports-personnalises/:id} : get the "id" rapportsPersonnalises.
     *
     * @param id the id of the rapportsPersonnalises to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rapportsPersonnalises, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rapports-personnalises/{id}")
    public ResponseEntity<RapportsPersonnalises> getRapportsPersonnalises(@PathVariable Long id) {
        log.debug("REST request to get RapportsPersonnalises : {}", id);
        Optional<RapportsPersonnalises> rapportsPersonnalises = rapportsPersonnalisesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rapportsPersonnalises);
    }

    /**
     * {@code DELETE  /rapports-personnalises/:id} : delete the "id" rapportsPersonnalises.
     *
     * @param id the id of the rapportsPersonnalises to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rapports-personnalises/{id}")
    public ResponseEntity<Void> deleteRapportsPersonnalises(@PathVariable Long id) {
        log.debug("REST request to delete RapportsPersonnalises : {}", id);
        rapportsPersonnalisesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
