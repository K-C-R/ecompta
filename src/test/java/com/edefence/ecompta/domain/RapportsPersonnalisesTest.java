package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RapportsPersonnalisesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RapportsPersonnalises.class);
        RapportsPersonnalises rapportsPersonnalises1 = new RapportsPersonnalises();
        rapportsPersonnalises1.setId(1L);
        RapportsPersonnalises rapportsPersonnalises2 = new RapportsPersonnalises();
        rapportsPersonnalises2.setId(rapportsPersonnalises1.getId());
        assertThat(rapportsPersonnalises1).isEqualTo(rapportsPersonnalises2);
        rapportsPersonnalises2.setId(2L);
        assertThat(rapportsPersonnalises1).isNotEqualTo(rapportsPersonnalises2);
        rapportsPersonnalises1.setId(null);
        assertThat(rapportsPersonnalises1).isNotEqualTo(rapportsPersonnalises2);
    }
}
