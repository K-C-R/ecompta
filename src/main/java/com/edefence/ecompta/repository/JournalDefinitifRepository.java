package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.JournalDefinitif;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the JournalDefinitif entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JournalDefinitifRepository extends JpaRepository<JournalDefinitif, Long> {}
