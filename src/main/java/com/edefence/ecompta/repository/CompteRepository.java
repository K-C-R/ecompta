package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.Compte;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Compte entity.
 */
@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {
    default Optional<Compte> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Compte> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Compte> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select compte from Compte compte left join fetch compte.bilan", countQuery = "select count(compte) from Compte compte")
    Page<Compte> findAllWithToOneRelationships(Pageable pageable);

    @Query("select compte from Compte compte left join fetch compte.bilan")
    List<Compte> findAllWithToOneRelationships();

    @Query("select compte from Compte compte left join fetch compte.bilan where compte.id =:id")
    Optional<Compte> findOneWithToOneRelationships(@Param("id") Long id);
}
