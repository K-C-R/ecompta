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
 * A Bilan.
 */
@Entity
@Table(name = "bilan")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Bilan implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "exercice")
    private Instant exercice;

    @Column(name = "actif_total")
    private Long actifTotal;

    @Column(name = "passif_total")
    private Long passifTotal;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "bilan")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "transactions", "soldeComptables", "compteAttentes", "compteTransferts", "audits", "bilan", "pieceComptables" },
        allowSetters = true
    )
    private Set<Compte> comptes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bilan id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getExercice() {
        return this.exercice;
    }

    public Bilan exercice(Instant exercice) {
        this.setExercice(exercice);
        return this;
    }

    public void setExercice(Instant exercice) {
        this.exercice = exercice;
    }

    public Long getActifTotal() {
        return this.actifTotal;
    }

    public Bilan actifTotal(Long actifTotal) {
        this.setActifTotal(actifTotal);
        return this;
    }

    public void setActifTotal(Long actifTotal) {
        this.actifTotal = actifTotal;
    }

    public Long getPassifTotal() {
        return this.passifTotal;
    }

    public Bilan passifTotal(Long passifTotal) {
        this.setPassifTotal(passifTotal);
        return this;
    }

    public void setPassifTotal(Long passifTotal) {
        this.passifTotal = passifTotal;
    }

    public Set<Compte> getComptes() {
        return this.comptes;
    }

    public void setComptes(Set<Compte> comptes) {
        if (this.comptes != null) {
            this.comptes.forEach(i -> i.setBilan(null));
        }
        if (comptes != null) {
            comptes.forEach(i -> i.setBilan(this));
        }
        this.comptes = comptes;
    }

    public Bilan comptes(Set<Compte> comptes) {
        this.setComptes(comptes);
        return this;
    }

    public Bilan addCompte(Compte compte) {
        this.comptes.add(compte);
        compte.setBilan(this);
        return this;
    }

    public Bilan removeCompte(Compte compte) {
        this.comptes.remove(compte);
        compte.setBilan(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bilan)) {
            return false;
        }
        return getId() != null && getId().equals(((Bilan) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bilan{" +
            "id=" + getId() +
            ", exercice='" + getExercice() + "'" +
            ", actifTotal=" + getActifTotal() +
            ", passifTotal=" + getPassifTotal() +
            "}";
    }
}
