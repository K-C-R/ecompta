package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CompteTransfertTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompteTransfert.class);
        CompteTransfert compteTransfert1 = new CompteTransfert();
        compteTransfert1.setId(1L);
        CompteTransfert compteTransfert2 = new CompteTransfert();
        compteTransfert2.setId(compteTransfert1.getId());
        assertThat(compteTransfert1).isEqualTo(compteTransfert2);
        compteTransfert2.setId(2L);
        assertThat(compteTransfert1).isNotEqualTo(compteTransfert2);
        compteTransfert1.setId(null);
        assertThat(compteTransfert1).isNotEqualTo(compteTransfert2);
    }
}
