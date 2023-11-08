package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BilanTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bilan.class);
        Bilan bilan1 = new Bilan();
        bilan1.setId(1L);
        Bilan bilan2 = new Bilan();
        bilan2.setId(bilan1.getId());
        assertThat(bilan1).isEqualTo(bilan2);
        bilan2.setId(2L);
        assertThat(bilan1).isNotEqualTo(bilan2);
        bilan1.setId(null);
        assertThat(bilan1).isNotEqualTo(bilan2);
    }
}
