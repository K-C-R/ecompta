package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.CompteComptable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CompteComptable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompteComptableRepository extends JpaRepository<CompteComptable, Long> {}
