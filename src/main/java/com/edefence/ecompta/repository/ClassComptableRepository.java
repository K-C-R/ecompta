package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.ClassComptable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ClassComptable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClassComptableRepository extends JpaRepository<ClassComptable, Long> {}
