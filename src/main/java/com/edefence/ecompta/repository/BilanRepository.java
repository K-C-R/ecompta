package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.Bilan;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Bilan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BilanRepository extends JpaRepository<Bilan, Long> {}
