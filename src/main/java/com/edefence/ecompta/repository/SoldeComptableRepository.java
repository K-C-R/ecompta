package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.SoldeComptable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SoldeComptable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SoldeComptableRepository extends JpaRepository<SoldeComptable, Long> {}
