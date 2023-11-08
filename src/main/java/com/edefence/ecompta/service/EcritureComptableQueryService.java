package com.edefence.ecompta.service;

import com.edefence.ecompta.domain.*; // for static metamodels
import com.edefence.ecompta.domain.EcritureComptable;
import com.edefence.ecompta.repository.EcritureComptableRepository;
import com.edefence.ecompta.service.criteria.EcritureComptableCriteria;
import jakarta.persistence.criteria.JoinType;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link EcritureComptable} entities in the database.
 * The main input is a {@link EcritureComptableCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link EcritureComptable} or a {@link Page} of {@link EcritureComptable} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class EcritureComptableQueryService extends QueryService<EcritureComptable> {

    private final Logger log = LoggerFactory.getLogger(EcritureComptableQueryService.class);

    private final EcritureComptableRepository ecritureComptableRepository;

    public EcritureComptableQueryService(EcritureComptableRepository ecritureComptableRepository) {
        this.ecritureComptableRepository = ecritureComptableRepository;
    }

    /**
     * Return a {@link List} of {@link EcritureComptable} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<EcritureComptable> findByCriteria(EcritureComptableCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<EcritureComptable> specification = createSpecification(criteria);
        return ecritureComptableRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link EcritureComptable} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<EcritureComptable> findByCriteria(EcritureComptableCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<EcritureComptable> specification = createSpecification(criteria);
        return ecritureComptableRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(EcritureComptableCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<EcritureComptable> specification = createSpecification(criteria);
        return ecritureComptableRepository.count(specification);
    }

    /**
     * Function to convert {@link EcritureComptableCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<EcritureComptable> createSpecification(EcritureComptableCriteria criteria) {
        Specification<EcritureComptable> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), EcritureComptable_.id));
            }
            if (criteria.getDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getDate(), EcritureComptable_.date));
            }
            if (criteria.getMontant() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getMontant(), EcritureComptable_.montant));
            }
            if (criteria.getLibelle() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLibelle(), EcritureComptable_.libelle));
            }
            if (criteria.getTypeEcriture() != null) {
                specification = specification.and(buildSpecification(criteria.getTypeEcriture(), EcritureComptable_.typeEcriture));
            }
            if (criteria.getReference() != null) {
                specification = specification.and(buildStringSpecification(criteria.getReference(), EcritureComptable_.reference));
            }
            if (criteria.getAutreInfos() != null) {
                specification = specification.and(buildStringSpecification(criteria.getAutreInfos(), EcritureComptable_.autreInfos));
            }
            if (criteria.getPieces() != null) {
                specification = specification.and(buildStringSpecification(criteria.getPieces(), EcritureComptable_.pieces));
            }
            if (criteria.getCompteId() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getCompteId(),
                            root -> root.join(EcritureComptable_.compte, JoinType.LEFT).get(Compte_.id)
                        )
                    );
            }
        }
        return specification;
    }
}
