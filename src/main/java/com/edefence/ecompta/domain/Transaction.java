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
 * A Transaction.
 */
@Entity
@Table(name = "transaction")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private Instant date;

    @Column(name = "libelle")
    private String libelle;

    @Column(name = "montant")
    private Long montant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_crediter_id")
    @JsonIgnoreProperties(
        value = {
            "transactionsCrediter",
            "transactionsDebiter",
            "transactions",
            "soldeComptables",
            "compteAttentes",
            "compteTransferts",
            "audits",
            "bilan",
            "pieceComptables",
        },
        allowSetters = true
    )
    private Compte compteCrediter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_debiter_id")
    @JsonIgnoreProperties(
        value = {
            "transactionsCrediter",
            "transactionsDebiter",
            "transactions",
            "soldeComptables",
            "compteAttentes",
            "compteTransferts",
            "audits",
            "bilan",
            "pieceComptables",
        },
        allowSetters = true
    )
    private Compte compteDebiter;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "transactions")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comptes", "transactions" }, allowSetters = true)
    private Set<PieceComptable> pieceComptables = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Transaction id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Transaction date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Transaction libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Long getMontant() {
        return this.montant;
    }

    public Transaction montant(Long montant) {
        this.setMontant(montant);
        return this;
    }

    public void setMontant(Long montant) {
        this.montant = montant;
    }

    public Compte getCompteCrediter() {
        return this.compteCrediter;
    }

    public Compte getCompteDebiter() {
        return this.compteDebiter;
    }

    public void setCompteCrediter(Compte compteCrediter) {
        this.compteCrediter = compteCrediter;
    }

    public void setCompteDebiter(Compte compteDebiter) {
        this.compteDebiter = compteDebiter;
    }

    public Transaction compteCrediter(Compte compteCrediter) {
        this.setCompteCrediter(compteCrediter);
        return this;
    }

    public Transaction compteDebiter(Compte compteDebiter) {
        this.setCompteDebiter(compteDebiter);
        return this;
    }

    public Set<PieceComptable> getPieceComptables() {
        return this.pieceComptables;
    }

    public void setPieceComptables(Set<PieceComptable> pieceComptables) {
        if (this.pieceComptables != null) {
            this.pieceComptables.forEach(i -> i.removeTransactions(this));
        }
        if (pieceComptables != null) {
            pieceComptables.forEach(i -> i.addTransactions(this));
        }
        this.pieceComptables = pieceComptables;
    }

    public Transaction pieceComptables(Set<PieceComptable> pieceComptables) {
        this.setPieceComptables(pieceComptables);
        return this;
    }

    public Transaction addPieceComptable(PieceComptable pieceComptable) {
        this.pieceComptables.add(pieceComptable);
        pieceComptable.getTransactions().add(this);
        return this;
    }

    public Transaction removePieceComptable(PieceComptable pieceComptable) {
        this.pieceComptables.remove(pieceComptable);
        pieceComptable.getTransactions().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transaction)) {
            return false;
        }
        return getId() != null && getId().equals(((Transaction) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transaction{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", libelle='" + getLibelle() + "'" +
            ", montant=" + getMontant() +

            "}";
    }
}
