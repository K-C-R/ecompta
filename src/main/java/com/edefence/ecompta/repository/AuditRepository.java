package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.Audit;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Audit entity.
 */
@Repository
public interface AuditRepository extends JpaRepository<Audit, Long> {
    default Optional<Audit> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Audit> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Audit> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select audit from Audit audit left join fetch audit.compte", countQuery = "select count(audit) from Audit audit")
    Page<Audit> findAllWithToOneRelationships(Pageable pageable);

    @Query("select audit from Audit audit left join fetch audit.compte")
    List<Audit> findAllWithToOneRelationships();

    @Query("select audit from Audit audit left join fetch audit.compte where audit.id =:id")
    Optional<Audit> findOneWithToOneRelationships(@Param("id") Long id);
}
