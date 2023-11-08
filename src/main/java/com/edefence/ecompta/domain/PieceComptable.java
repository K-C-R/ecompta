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
 * A PieceComptable.
 */
@Entity
@Table(name = "piece_comptable")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PieceComptable implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "numero_piece")
    private String numeroPiece;

    @Column(name = "date_piece")
    private Instant datePiece;

    @Column(name = "description")
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_piece_comptable__comptes",
        joinColumns = @JoinColumn(name = "piece_comptable_id"),
        inverseJoinColumns = @JoinColumn(name = "comptes_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "transactions", "soldeComptables", "compteAttentes", "compteTransferts", "audits", "bilan", "pieceComptables" },
        allowSetters = true
    )
    private Set<Compte> comptes = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_piece_comptable__transactions",
        joinColumns = @JoinColumn(name = "piece_comptable_id"),
        inverseJoinColumns = @JoinColumn(name = "transactions_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compte", "pieceComptables" }, allowSetters = true)
    private Set<Transaction> transactions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PieceComptable id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroPiece() {
        return this.numeroPiece;
    }

    public PieceComptable numeroPiece(String numeroPiece) {
        this.setNumeroPiece(numeroPiece);
        return this;
    }

    public void setNumeroPiece(String numeroPiece) {
        this.numeroPiece = numeroPiece;
    }

    public Instant getDatePiece() {
        return this.datePiece;
    }

    public PieceComptable datePiece(Instant datePiece) {
        this.setDatePiece(datePiece);
        return this;
    }

    public void setDatePiece(Instant datePiece) {
        this.datePiece = datePiece;
    }

    public String getDescription() {
        return this.description;
    }

    public PieceComptable description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Compte> getComptes() {
        return this.comptes;
    }

    public void setComptes(Set<Compte> comptes) {
        this.comptes = comptes;
    }

    public PieceComptable comptes(Set<Compte> comptes) {
        this.setComptes(comptes);
        return this;
    }

    public PieceComptable addComptes(Compte compte) {
        this.comptes.add(compte);
        compte.getPieceComptables().add(this);
        return this;
    }

    public PieceComptable removeComptes(Compte compte) {
        this.comptes.remove(compte);
        compte.getPieceComptables().remove(this);
        return this;
    }

    public Set<Transaction> getTransactions() {
        return this.transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        this.transactions = transactions;
    }

    public PieceComptable transactions(Set<Transaction> transactions) {
        this.setTransactions(transactions);
        return this;
    }

    public PieceComptable addTransactions(Transaction transaction) {
        this.transactions.add(transaction);
        transaction.getPieceComptables().add(this);
        return this;
    }

    public PieceComptable removeTransactions(Transaction transaction) {
        this.transactions.remove(transaction);
        transaction.getPieceComptables().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PieceComptable)) {
            return false;
        }
        return getId() != null && getId().equals(((PieceComptable) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PieceComptable{" +
            "id=" + getId() +
            ", numeroPiece='" + getNumeroPiece() + "'" +
            ", datePiece='" + getDatePiece() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
