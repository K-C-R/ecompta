package com.edefence.ecompta.repository;

import com.edefence.ecompta.domain.PieceComptable;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PieceComptableRepositoryWithBagRelationships {
    Optional<PieceComptable> fetchBagRelationships(Optional<PieceComptable> pieceComptable);

    List<PieceComptable> fetchBagRelationships(List<PieceComptable> pieceComptables);

    Page<PieceComptable> fetchBagRelationships(Page<PieceComptable> pieceComptables);
}
