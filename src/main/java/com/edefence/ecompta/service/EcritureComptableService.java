package com.edefence.ecompta.service;

import com.edefence.ecompta.domain.EcritureComptable;
import com.edefence.ecompta.repository.EcritureComptableRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.edefence.ecompta.domain.EcritureComptable}.
 */
@Service
@Transactional
public class EcritureComptableService {

    private final Logger log = LoggerFactory.getLogger(EcritureComptableService.class);

    private final EcritureComptableRepository ecritureComptableRepository;

    public EcritureComptableService(EcritureComptableRepository ecritureComptableRepository) {
        this.ecritureComptableRepository = ecritureComptableRepository;
    }

    /**
     * Save a ecritureComptable.
     *
     * @param ecritureComptable the entity to save.
     * @return the persisted entity.
     */
    public EcritureComptable save(EcritureComptable ecritureComptable) {
        log.debug("Request to save EcritureComptable : {}", ecritureComptable);
        return ecritureComptableRepository.save(ecritureComptable);
    }

    /**
     * Update a ecritureComptable.
     *
     * @param ecritureComptable the entity to save.
     * @return the persisted entity.
     */
    public EcritureComptable update(EcritureComptable ecritureComptable) {
        log.debug("Request to update EcritureComptable : {}", ecritureComptable);
        return ecritureComptableRepository.save(ecritureComptable);
    }

    /**
     * Partially update a ecritureComptable.
     *
     * @param ecritureComptable the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<EcritureComptable> partialUpdate(EcritureComptable ecritureComptable) {
        log.debug("Request to partially update EcritureComptable : {}", ecritureComptable);

        return ecritureComptableRepository
            .findById(ecritureComptable.getId())
            .map(existingEcritureComptable -> {
                if (ecritureComptable.getDate() != null) {
                    existingEcritureComptable.setDate(ecritureComptable.getDate());
                }
                if (ecritureComptable.getMontant() != null) {
                    existingEcritureComptable.setMontant(ecritureComptable.getMontant());
                }
                if (ecritureComptable.getLibelle() != null) {
                    existingEcritureComptable.setLibelle(ecritureComptable.getLibelle());
                }
                if (ecritureComptable.getTypeEcriture() != null) {
                    existingEcritureComptable.setTypeEcriture(ecritureComptable.getTypeEcriture());
                }
                if (ecritureComptable.getReference() != null) {
                    existingEcritureComptable.setReference(ecritureComptable.getReference());
                }
                if (ecritureComptable.getAutreInfos() != null) {
                    existingEcritureComptable.setAutreInfos(ecritureComptable.getAutreInfos());
                }
                if (ecritureComptable.getPieces() != null) {
                    existingEcritureComptable.setPieces(ecritureComptable.getPieces());
                }

                return existingEcritureComptable;
            })
            .map(ecritureComptableRepository::save);
    }

    /**
     * Get all the ecritureComptables.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<EcritureComptable> findAll(Pageable pageable) {
        log.debug("Request to get all EcritureComptables");
        return ecritureComptableRepository.findAll(pageable);
    }

    /**
     * Get one ecritureComptable by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<EcritureComptable> findOne(Long id) {
        log.debug("Request to get EcritureComptable : {}", id);
        return ecritureComptableRepository.findById(id);
    }

    /**
     * Delete the ecritureComptable by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete EcritureComptable : {}", id);
        ecritureComptableRepository.deleteById(id);
    }
}
