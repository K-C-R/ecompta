package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CompteDeResultatTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompteDeResultat.class);
        CompteDeResultat compteDeResultat1 = new CompteDeResultat();
        compteDeResultat1.setId(1L);
        CompteDeResultat compteDeResultat2 = new CompteDeResultat();
        compteDeResultat2.setId(compteDeResultat1.getId());
        assertThat(compteDeResultat1).isEqualTo(compteDeResultat2);
        compteDeResultat2.setId(2L);
        assertThat(compteDeResultat1).isNotEqualTo(compteDeResultat2);
        compteDeResultat1.setId(null);
        assertThat(compteDeResultat1).isNotEqualTo(compteDeResultat2);
    }
}
