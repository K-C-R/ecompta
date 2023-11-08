package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CompteAttenteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompteAttente.class);
        CompteAttente compteAttente1 = new CompteAttente();
        compteAttente1.setId(1L);
        CompteAttente compteAttente2 = new CompteAttente();
        compteAttente2.setId(compteAttente1.getId());
        assertThat(compteAttente1).isEqualTo(compteAttente2);
        compteAttente2.setId(2L);
        assertThat(compteAttente1).isNotEqualTo(compteAttente2);
        compteAttente1.setId(null);
        assertThat(compteAttente1).isNotEqualTo(compteAttente2);
    }
}
