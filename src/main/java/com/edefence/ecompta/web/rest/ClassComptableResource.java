package com.edefence.ecompta.web.rest;

import com.edefence.ecompta.domain.ClassComptable;
import com.edefence.ecompta.repository.ClassComptableRepository;
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
 * REST controller for managing {@link com.edefence.ecompta.domain.ClassComptable}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClassComptableResource {

    private final Logger log = LoggerFactory.getLogger(ClassComptableResource.class);

    private static final String ENTITY_NAME = "classComptable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClassComptableRepository classComptableRepository;

    public ClassComptableResource(ClassComptableRepository classComptableRepository) {
        this.classComptableRepository = classComptableRepository;
    }

    /**
     * {@code POST  /class-comptables} : Create a new classComptable.
     *
     * @param classComptable the classComptable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new classComptable, or with status {@code 400 (Bad Request)} if the classComptable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/class-comptables")
    public ResponseEntity<ClassComptable> createClassComptable(@Valid @RequestBody ClassComptable classComptable)
        throws URISyntaxException {
        log.debug("REST request to save ClassComptable : {}", classComptable);
        if (classComptable.getId() != null) {
            throw new BadRequestAlertException("A new classComptable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClassComptable result = classComptableRepository.save(classComptable);
        return ResponseEntity
            .created(new URI("/api/class-comptables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /class-comptables/:id} : Updates an existing classComptable.
     *
     * @param id the id of the classComptable to save.
     * @param classComptable the classComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classComptable,
     * or with status {@code 400 (Bad Request)} if the classComptable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the classComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/class-comptables/{id}")
    public ResponseEntity<ClassComptable> updateClassComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ClassComptable classComptable
    ) throws URISyntaxException {
        log.debug("REST request to update ClassComptable : {}, {}", id, classComptable);
        if (classComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClassComptable result = classComptableRepository.save(classComptable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classComptable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /class-comptables/:id} : Partial updates given fields of an existing classComptable, field will ignore if it is null
     *
     * @param id the id of the classComptable to save.
     * @param classComptable the classComptable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classComptable,
     * or with status {@code 400 (Bad Request)} if the classComptable is not valid,
     * or with status {@code 404 (Not Found)} if the classComptable is not found,
     * or with status {@code 500 (Internal Server Error)} if the classComptable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/class-comptables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClassComptable> partialUpdateClassComptable(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ClassComptable classComptable
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClassComptable partially : {}, {}", id, classComptable);
        if (classComptable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classComptable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classComptableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClassComptable> result = classComptableRepository
            .findById(classComptable.getId())
            .map(existingClassComptable -> {
                if (classComptable.getNom() != null) {
                    existingClassComptable.setNom(classComptable.getNom());
                }
                if (classComptable.getDescription() != null) {
                    existingClassComptable.setDescription(classComptable.getDescription());
                }

                return existingClassComptable;
            })
            .map(classComptableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classComptable.getId().toString())
        );
    }

    /**
     * {@code GET  /class-comptables} : get all the classComptables.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of classComptables in body.
     */
    @GetMapping("/class-comptables")
    public ResponseEntity<List<ClassComptable>> getAllClassComptables(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ClassComptables");
        Page<ClassComptable> page = classComptableRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /class-comptables/:id} : get the "id" classComptable.
     *
     * @param id the id of the classComptable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the classComptable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/class-comptables/{id}")
    public ResponseEntity<ClassComptable> getClassComptable(@PathVariable Long id) {
        log.debug("REST request to get ClassComptable : {}", id);
        Optional<ClassComptable> classComptable = classComptableRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(classComptable);
    }

    /**
     * {@code DELETE  /class-comptables/:id} : delete the "id" classComptable.
     *
     * @param id the id of the classComptable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/class-comptables/{id}")
    public ResponseEntity<Void> deleteClassComptable(@PathVariable Long id) {
        log.debug("REST request to delete ClassComptable : {}", id);
        classComptableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
