package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.RapportsPersonnalises;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RapportsPersonnalises entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RapportsPersonnalisesRepository extends JpaRepository<RapportsPersonnalises, Long> {}
