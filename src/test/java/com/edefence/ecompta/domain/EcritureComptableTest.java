package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EcritureComptableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EcritureComptable.class);
        EcritureComptable ecritureComptable1 = new EcritureComptable();
        ecritureComptable1.setId(1L);
        EcritureComptable ecritureComptable2 = new EcritureComptable();
        ecritureComptable2.setId(ecritureComptable1.getId());
        assertThat(ecritureComptable1).isEqualTo(ecritureComptable2);
        ecritureComptable2.setId(2L);
        assertThat(ecritureComptable1).isNotEqualTo(ecritureComptable2);
        ecritureComptable1.setId(null);
        assertThat(ecritureComptable1).isNotEqualTo(ecritureComptable2);
    }
}
