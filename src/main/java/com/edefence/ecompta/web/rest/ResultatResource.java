package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.Resultat;
import com.edefence.ecompta.repository.ResultatRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.Resultat}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ResultatResource {

    private final Logger log = LoggerFactory.getLogger(ResultatResource.class);

    private static final String ENTITY_NAME = "resultat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResultatRepository resultatRepository;

    public ResultatResource(ResultatRepository resultatRepository) {
        this.resultatRepository = resultatRepository;
    }

    /**
     * {@code POST  /resultats} : Create a new resultat.
     *
     * @param resultat the resultat to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resultat, or with status {@code 400 (Bad Request)} if the resultat has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/resultats")
    public ResponseEntity<Resultat> createResultat(@RequestBody Resultat resultat) throws URISyntaxException {
        log.debug("REST request to save Resultat : {}", resultat);
        if (resultat.getId() != null) {
            throw new BadRequestAlertException("A new resultat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Resultat result = resultatRepository.save(resultat);
        return ResponseEntity
            .created(new URI("/api/resultats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /resultats/:id} : Updates an existing resultat.
     *
     * @param id the id of the resultat to save.
     * @param resultat the resultat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resultat,
     * or with status {@code 400 (Bad Request)} if the resultat is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resultat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/resultats/{id}")
    public ResponseEntity<Resultat> updateResultat(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Resultat resultat
    ) throws URISyntaxException {
        log.debug("REST request to update Resultat : {}, {}", id, resultat);
        if (resultat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resultat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resultatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Resultat result = resultatRepository.save(resultat);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resultat.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /resultats/:id} : Partial updates given fields of an existing resultat, field will ignore if it is null
     *
     * @param id the id of the resultat to save.
     * @param resultat the resultat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resultat,
     * or with status {@code 400 (Bad Request)} if the resultat is not valid,
     * or with status {@code 404 (Not Found)} if the resultat is not found,
     * or with status {@code 500 (Internal Server Error)} if the resultat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/resultats/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Resultat> partialUpdateResultat(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Resultat resultat
    ) throws URISyntaxException {
        log.debug("REST request to partial update Resultat partially : {}, {}", id, resultat);
        if (resultat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resultat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resultatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Resultat> result = resultatRepository
            .findById(resultat.getId())
            .map(existingResultat -> {
                if (resultat.getExercice() != null) {
                    existingResultat.setExercice(resultat.getExercice());
                }
                if (resultat.getResultatNet() != null) {
                    existingResultat.setResultatNet(resultat.getResultatNet());
                }

                return existingResultat;
            })
            .map(resultatRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resultat.getId().toString())
        );
    }

    /**
     * {@code GET  /resultats} : get all the resultats.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resultats in body.
     */
    @GetMapping("/resultats")
    public List<Resultat> getAllResultats() {
        log.debug("REST request to get all Resultats");
        return resultatRepository.findAll();
    }

    /**
     * {@code GET  /resultats/:id} : get the "id" resultat.
     *
     * @param id the id of the resultat to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resultat, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/resultats/{id}")
    public ResponseEntity<Resultat> getResultat(@PathVariable Long id) {
        log.debug("REST request to get Resultat : {}", id);
        Optional<Resultat> resultat = resultatRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(resultat);
    }

    /**
     * {@code DELETE  /resultats/:id} : delete the "id" resultat.
     *
     * @param id the id of the resultat to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/resultats/{id}")
    public ResponseEntity<Void> deleteResultat(@PathVariable Long id) {
        log.debug("REST request to delete Resultat : {}", id);
        resultatRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
