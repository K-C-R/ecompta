package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.GrandLivre;
import com.edefence.ecompta.repository.GrandLivreRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.GrandLivre}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GrandLivreResource {

    private final Logger log = LoggerFactory.getLogger(GrandLivreResource.class);

    private static final String ENTITY_NAME = "grandLivre";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrandLivreRepository grandLivreRepository;

    public GrandLivreResource(GrandLivreRepository grandLivreRepository) {
        this.grandLivreRepository = grandLivreRepository;
    }

    /**
     * {@code POST  /grand-livres} : Create a new grandLivre.
     *
     * @param grandLivre the grandLivre to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grandLivre, or with status {@code 400 (Bad Request)} if the grandLivre has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grand-livres")
    public ResponseEntity<GrandLivre> createGrandLivre(@Valid @RequestBody GrandLivre grandLivre) throws URISyntaxException {
        log.debug("REST request to save GrandLivre : {}", grandLivre);
        if (grandLivre.getId() != null) {
            throw new BadRequestAlertException("A new grandLivre cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GrandLivre result = grandLivreRepository.save(grandLivre);
        return ResponseEntity
            .created(new URI("/api/grand-livres/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /grand-livres/:id} : Updates an existing grandLivre.
     *
     * @param id the id of the grandLivre to save.
     * @param grandLivre the grandLivre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grandLivre,
     * or with status {@code 400 (Bad Request)} if the grandLivre is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grandLivre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grand-livres/{id}")
    public ResponseEntity<GrandLivre> updateGrandLivre(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GrandLivre grandLivre
    ) throws URISyntaxException {
        log.debug("REST request to update GrandLivre : {}, {}", id, grandLivre);
        if (grandLivre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grandLivre.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grandLivreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GrandLivre result = grandLivreRepository.save(grandLivre);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grandLivre.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /grand-livres/:id} : Partial updates given fields of an existing grandLivre, field will ignore if it is null
     *
     * @param id the id of the grandLivre to save.
     * @param grandLivre the grandLivre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grandLivre,
     * or with status {@code 400 (Bad Request)} if the grandLivre is not valid,
     * or with status {@code 404 (Not Found)} if the grandLivre is not found,
     * or with status {@code 500 (Internal Server Error)} if the grandLivre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grand-livres/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GrandLivre> partialUpdateGrandLivre(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GrandLivre grandLivre
    ) throws URISyntaxException {
        log.debug("REST request to partial update GrandLivre partially : {}, {}", id, grandLivre);
        if (grandLivre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grandLivre.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grandLivreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GrandLivre> result = grandLivreRepository
            .findById(grandLivre.getId())
            .map(existingGrandLivre -> {
                if (grandLivre.getDate() != null) {
                    existingGrandLivre.setDate(grandLivre.getDate());
                }
                if (grandLivre.getDescription() != null) {
                    existingGrandLivre.setDescription(grandLivre.getDescription());
                }
                if (grandLivre.getMontant() != null) {
                    existingGrandLivre.setMontant(grandLivre.getMontant());
                }
                if (grandLivre.getReference() != null) {
                    existingGrandLivre.setReference(grandLivre.getReference());
                }

                return existingGrandLivre;
            })
            .map(grandLivreRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grandLivre.getId().toString())
        );
    }

    /**
     * {@code GET  /grand-livres} : get all the grandLivres.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grandLivres in body.
     */
    @GetMapping("/grand-livres")
    public ResponseEntity<List<GrandLivre>> getAllGrandLivres(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of GrandLivres");
        Page<GrandLivre> page = grandLivreRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /grand-livres/:id} : get the "id" grandLivre.
     *
     * @param id the id of the grandLivre to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grandLivre, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grand-livres/{id}")
    public ResponseEntity<GrandLivre> getGrandLivre(@PathVariable Long id) {
        log.debug("REST request to get GrandLivre : {}", id);
        Optional<GrandLivre> grandLivre = grandLivreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(grandLivre);
    }

    /**
     * {@code DELETE  /grand-livres/:id} : delete the "id" grandLivre.
     *
     * @param id the id of the grandLivre to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grand-livres/{id}")
    public ResponseEntity<Void> deleteGrandLivre(@PathVariable Long id) {
        log.debug("REST request to delete GrandLivre : {}", id);
        grandLivreRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
