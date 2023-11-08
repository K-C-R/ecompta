package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.GrandLivre;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GrandLivre entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrandLivreRepository extends JpaRepository<GrandLivre, Long> {}
