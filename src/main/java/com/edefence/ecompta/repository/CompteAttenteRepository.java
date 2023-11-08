package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.CompteAttente;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CompteAttente entity.
 */
@Repository
public interface CompteAttenteRepository extends JpaRepository<CompteAttente, Long> {
    default Optional<CompteAttente> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<CompteAttente> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<CompteAttente> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select compteAttente from CompteAttente compteAttente left join fetch compteAttente.compte",
        countQuery = "select count(compteAttente) from CompteAttente compteAttente"
    )
    Page<CompteAttente> findAllWithToOneRelationships(Pageable pageable);

    @Query("select compteAttente from CompteAttente compteAttente left join fetch compteAttente.compte")
    List<CompteAttente> findAllWithToOneRelationships();

    @Query("select compteAttente from CompteAttente compteAttente left join fetch compteAttente.compte where compteAttente.id =:id")
    Optional<CompteAttente> findOneWithToOneRelationships(@Param("id") Long id);
}
