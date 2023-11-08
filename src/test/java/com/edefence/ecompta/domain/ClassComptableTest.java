package com.edefence.ecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.edefence.ecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClassComptableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClassComptable.class);
        ClassComptable classComptable1 = new ClassComptable();
        classComptable1.setId(1L);
        ClassComptable classComptable2 = new ClassComptable();
        classComptable2.setId(classComptable1.getId());
        assertThat(classComptable1).isEqualTo(classComptable2);
        classComptable2.setId(2L);
        assertThat(classComptable1).isNotEqualTo(classComptable2);
        classComptable1.setId(null);
        assertThat(classComptable1).isNotEqualTo(classComptable2);
    }
}
