package com.edefence.ecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Resultat.
 */
@Entity
@Table(name = "resultat")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Resultat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "exercice")
    private Instant exercice;

    @Column(name = "resultat_net")
    private Long resultatNet;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "resultat")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "resultat" }, allowSetters = true)
    private Set<CompteDeResultat> comptesDeResultats = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Resultat id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getExercice() {
        return this.exercice;
    }

    public Resultat exercice(Instant exercice) {
        this.setExercice(exercice);
        return this;
    }

    public void setExercice(Instant exercice) {
        this.exercice = exercice;
    }

    public Long getResultatNet() {
        return this.resultatNet;
    }

    public Resultat resultatNet(Long resultatNet) {
        this.setResultatNet(resultatNet);
        return this;
    }

    public void setResultatNet(Long resultatNet) {
        this.resultatNet = resultatNet;
    }

    public Set<CompteDeResultat> getComptesDeResultats() {
        return this.comptesDeResultats;
    }

    public void setComptesDeResultats(Set<CompteDeResultat> compteDeResultats) {
        if (this.comptesDeResultats != null) {
            this.comptesDeResultats.forEach(i -> i.setResultat(null));
        }
        if (compteDeResultats != null) {
            compteDeResultats.forEach(i -> i.setResultat(this));
        }
        this.comptesDeResultats = compteDeResultats;
    }

    public Resultat comptesDeResultats(Set<CompteDeResultat> compteDeResultats) {
        this.setComptesDeResultats(compteDeResultats);
        return this;
    }

    public Resultat addComptesDeResultat(CompteDeResultat compteDeResultat) {
        this.comptesDeResultats.add(compteDeResultat);
        compteDeResultat.setResultat(this);
        return this;
    }

    public Resultat removeComptesDeResultat(CompteDeResultat compteDeResultat) {
        this.comptesDeResultats.remove(compteDeResultat);
        compteDeResultat.setResultat(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Resultat)) {
            return false;
        }
        return getId() != null && getId().equals(((Resultat) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Resultat{" +
            "id=" + getId() +
            ", exercice='" + getExercice() + "'" +
            ", resultatNet=" + getResultatNet() +
            "}";
    }
}
