package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SoldeComptableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SoldeComptable.class);
        SoldeComptable soldeComptable1 = new SoldeComptable();
        soldeComptable1.setId(1L);
        SoldeComptable soldeComptable2 = new SoldeComptable();
        soldeComptable2.setId(soldeComptable1.getId());
        assertThat(soldeComptable1).isEqualTo(soldeComptable2);
        soldeComptable2.setId(2L);
        assertThat(soldeComptable1).isNotEqualTo(soldeComptable2);
        soldeComptable1.setId(null);
        assertThat(soldeComptable1).isNotEqualTo(soldeComptable2);
    }
}
