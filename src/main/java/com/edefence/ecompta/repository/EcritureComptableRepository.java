package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.EcritureComptable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the EcritureComptable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EcritureComptableRepository extends JpaRepository<EcritureComptable, Long>, JpaSpecificationExecutor<EcritureComptable> {}
