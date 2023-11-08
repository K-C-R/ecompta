package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PieceComptableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PieceComptable.class);
        PieceComptable pieceComptable1 = new PieceComptable();
        pieceComptable1.setId(1L);
        PieceComptable pieceComptable2 = new PieceComptable();
        pieceComptable2.setId(pieceComptable1.getId());
        assertThat(pieceComptable1).isEqualTo(pieceComptable2);
        pieceComptable2.setId(2L);
        assertThat(pieceComptable1).isNotEqualTo(pieceComptable2);
        pieceComptable1.setId(null);
        assertThat(pieceComptable1).isNotEqualTo(pieceComptable2);
    }
}
