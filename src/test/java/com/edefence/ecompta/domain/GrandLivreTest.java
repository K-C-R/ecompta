package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GrandLivreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GrandLivre.class);
        GrandLivre grandLivre1 = new GrandLivre();
        grandLivre1.setId(1L);
        GrandLivre grandLivre2 = new GrandLivre();
        grandLivre2.setId(grandLivre1.getId());
        assertThat(grandLivre1).isEqualTo(grandLivre2);
        grandLivre2.setId(2L);
        assertThat(grandLivre1).isNotEqualTo(grandLivre2);
        grandLivre1.setId(null);
        assertThat(grandLivre1).isNotEqualTo(grandLivre2);
    }
}
