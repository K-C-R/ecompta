package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.CompteDeResultat;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CompteDeResultat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompteDeResultatRepository extends JpaRepository<CompteDeResultat, Long> {}
