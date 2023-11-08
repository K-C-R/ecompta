package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JournalDefinitifTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JournalDefinitif.class);
        JournalDefinitif journalDefinitif1 = new JournalDefinitif();
        journalDefinitif1.setId(1L);
        JournalDefinitif journalDefinitif2 = new JournalDefinitif();
        journalDefinitif2.setId(journalDefinitif1.getId());
        assertThat(journalDefinitif1).isEqualTo(journalDefinitif2);
        journalDefinitif2.setId(2L);
        assertThat(journalDefinitif1).isNotEqualTo(journalDefinitif2);
        journalDefinitif1.setId(null);
        assertThat(journalDefinitif1).isNotEqualTo(journalDefinitif2);
    }
}
