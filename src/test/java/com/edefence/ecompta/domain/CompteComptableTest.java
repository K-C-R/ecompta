package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CompteComptableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompteComptable.class);
        CompteComptable compteComptable1 = new CompteComptable();
        compteComptable1.setId(1L);
        CompteComptable compteComptable2 = new CompteComptable();
        compteComptable2.setId(compteComptable1.getId());
        assertThat(compteComptable1).isEqualTo(compteComptable2);
        compteComptable2.setId(2L);
        assertThat(compteComptable1).isNotEqualTo(compteComptable2);
        compteComptable1.setId(null);
        assertThat(compteComptable1).isNotEqualTo(compteComptable2);
    }
}
