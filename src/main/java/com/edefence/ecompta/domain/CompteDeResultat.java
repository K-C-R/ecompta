package com.edefence.ecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CompteDeResultat.
 */
@Entity
@Table(name = "compte_de_resultat")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CompteDeResultat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "exercice")
    private Instant exercice;

    @Column(name = "produits_total")
    private Long produitsTotal;

    @Column(name = "charges_total")
    private Long chargesTotal;

    @Column(name = "resultat_net")
    private Long resultatNet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "comptesDeResultats" }, allowSetters = true)
    private Resultat resultat;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CompteDeResultat id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getExercice() {
        return this.exercice;
    }

    public CompteDeResultat exercice(Instant exercice) {
        this.setExercice(exercice);
        return this;
    }

    public void setExercice(Instant exercice) {
        this.exercice = exercice;
    }

    public Long getProduitsTotal() {
        return this.produitsTotal;
    }

    public CompteDeResultat produitsTotal(Long produitsTotal) {
        this.setProduitsTotal(produitsTotal);
        return this;
    }

    public void setProduitsTotal(Long produitsTotal) {
        this.produitsTotal = produitsTotal;
    }

    public Long getChargesTotal() {
        return this.chargesTotal;
    }

    public CompteDeResultat chargesTotal(Long chargesTotal) {
        this.setChargesTotal(chargesTotal);
        return this;
    }

    public void setChargesTotal(Long chargesTotal) {
        this.chargesTotal = chargesTotal;
    }

    public Long getResultatNet() {
        return this.resultatNet;
    }

    public CompteDeResultat resultatNet(Long resultatNet) {
        this.setResultatNet(resultatNet);
        return this;
    }

    public void setResultatNet(Long resultatNet) {
        this.resultatNet = resultatNet;
    }

    public Resultat getResultat() {
        return this.resultat;
    }

    public void setResultat(Resultat resultat) {
        this.resultat = resultat;
    }

    public CompteDeResultat resultat(Resultat resultat) {
        this.setResultat(resultat);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CompteDeResultat)) {
            return false;
        }
        return getId() != null && getId().equals(((CompteDeResultat) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CompteDeResultat{" +
            "id=" + getId() +
            ", exercice='" + getExercice() + "'" +
            ", produitsTotal=" + getProduitsTotal() +
            ", chargesTotal=" + getChargesTotal() +
            ", resultatNet=" + getResultatNet() +
            "}";
    }
}
