package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.CompteTransfert;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CompteTransfert entity.
 */
@Repository
public interface CompteTransfertRepository extends JpaRepository<CompteTransfert, Long> {
    default Optional<CompteTransfert> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<CompteTransfert> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<CompteTransfert> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select compteTransfert from CompteTransfert compteTransfert left join fetch compteTransfert.compte",
        countQuery = "select count(compteTransfert) from CompteTransfert compteTransfert"
    )
    Page<CompteTransfert> findAllWithToOneRelationships(Pageable pageable);

    @Query("select compteTransfert from CompteTransfert compteTransfert left join fetch compteTransfert.compte")
    List<CompteTransfert> findAllWithToOneRelationships();

    @Query(
        "select compteTransfert from CompteTransfert compteTransfert left join fetch compteTransfert.compte where compteTransfert.id =:id"
    )
    Optional<CompteTransfert> findOneWithToOneRelationships(@Param("id") Long id);
}
