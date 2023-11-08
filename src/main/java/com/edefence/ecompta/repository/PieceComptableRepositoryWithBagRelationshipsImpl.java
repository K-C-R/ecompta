package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.PieceComptable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class PieceComptableRepositoryWithBagRelationshipsImpl implements PieceComptableRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<PieceComptable> fetchBagRelationships(Optional<PieceComptable> pieceComptable) {
        return pieceComptable.map(this::fetchComptes).map(this::fetchTransactions);
    }

    @Override
    public Page<PieceComptable> fetchBagRelationships(Page<PieceComptable> pieceComptables) {
        return new PageImpl<>(
            fetchBagRelationships(pieceComptables.getContent()),
            pieceComptables.getPageable(),
            pieceComptables.getTotalElements()
        );
    }

    @Override
    public List<PieceComptable> fetchBagRelationships(List<PieceComptable> pieceComptables) {
        return Optional.of(pieceComptables).map(this::fetchComptes).map(this::fetchTransactions).orElse(Collections.emptyList());
    }

    PieceComptable fetchComptes(PieceComptable result) {
        return entityManager
            .createQuery(
                "select pieceComptable from PieceComptable pieceComptable left join fetch pieceComptable.comptes where pieceComptable.id = :id",
                PieceComptable.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<PieceComptable> fetchComptes(List<PieceComptable> pieceComptables) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, pieceComptables.size()).forEach(index -> order.put(pieceComptables.get(index).getId(), index));
        List<PieceComptable> result = entityManager
            .createQuery(
                "select pieceComptable from PieceComptable pieceComptable left join fetch pieceComptable.comptes where pieceComptable in :pieceComptables",
                PieceComptable.class
            )
            .setParameter("pieceComptables", pieceComptables)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    PieceComptable fetchTransactions(PieceComptable result) {
        return entityManager
            .createQuery(
                "select pieceComptable from PieceComptable pieceComptable left join fetch pieceComptable.transactions where pieceComptable.id = :id",
                PieceComptable.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<PieceComptable> fetchTransactions(List<PieceComptable> pieceComptables) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, pieceComptables.size()).forEach(index -> order.put(pieceComptables.get(index).getId(), index));
        List<PieceComptable> result = entityManager
            .createQuery(
                "select pieceComptable from PieceComptable pieceComptable left join fetch pieceComptable.transactions where pieceComptable in :pieceComptables",
                PieceComptable.class
            )
            .setParameter("pieceComptables", pieceComptables)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
