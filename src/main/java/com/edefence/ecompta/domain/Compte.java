package com.edefence.ecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Compte.
 */
@Entity
@Table(name = "compte")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Compte implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "numero_compte")
    private String numeroCompte;

    @Column(name = "nom")
    private String nom;

    @Column(name = "description")
    private String description;

    @Column(name = "cloture")
    private Boolean cloture;

    @OneToMany(mappedBy = "compteCrediter")
    @JsonIgnoreProperties(value = { "compteCrediter", "compteDebiter", "pieceComptables" }, allowSetters = true)
    private Set<Transaction> transactionsCrediter = new HashSet<>();

    @OneToMany(mappedBy = "compteDebiter")
    @JsonIgnoreProperties(value = { "compteCrediter", "compteDebiter", "pieceComptables" }, allowSetters = true)
    private Set<Transaction> transactionsDebiter = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "compte")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compte" }, allowSetters = true)
    private Set<SoldeComptable> soldeComptables = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "compte")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compte" }, allowSetters = true)
    private Set<CompteAttente> compteAttentes = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "compte")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compte" }, allowSetters = true)
    private Set<CompteTransfert> compteTransferts = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "compte")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compte" }, allowSetters = true)
    private Set<Audit> audits = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "comptes" }, allowSetters = true)
    private Bilan bilan;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "comptes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comptes", "transactions" }, allowSetters = true)
    private Set<PieceComptable> pieceComptables = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Compte id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroCompte() {
        return this.numeroCompte;
    }

    public Compte numeroCompte(String numeroCompte) {
        this.setNumeroCompte(numeroCompte);
        return this;
    }

    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public String getNom() {
        return this.nom;
    }

    public Compte nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public Compte description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getCloture() {
        return this.cloture;
    }

    public Compte cloture(Boolean cloture) {
        this.setCloture(cloture);
        return this;
    }

    public void setCloture(Boolean cloture) {
        this.cloture = cloture;
    }

    public Set<Transaction> getTransactionsCrediter() {
        return this.transactionsCrediter;
    }

    public Set<Transaction> getTransactionsDebiter() {
        return this.transactionsDebiter;
    }

    public void setTransactionsCrediter(Set<Transaction> transactionsCrediter) {
        if (this.transactionsCrediter != null) {
            this.transactionsCrediter.forEach(i -> i.setCompteCrediter(null));
        }
        if (transactionsCrediter != null) {
            transactionsCrediter.forEach(i -> i.setCompteCrediter(this));
        }
        this.transactionsCrediter = transactionsCrediter;
    }

    public void setTransactionsDebiter(Set<Transaction> transactionsDebiter) {
        if (this.transactionsDebiter != null) {
            this.transactionsDebiter.forEach(i -> i.setCompteCrediter(null));
        }
        if (transactionsDebiter != null) {
            transactionsDebiter.forEach(i -> i.setCompteCrediter(this));
        }
        this.transactionsDebiter = transactionsDebiter;
    }

    public Compte transactionsCrediter(Set<Transaction> transactionsCrediter) {
        this.setTransactionsCrediter(transactionsCrediter);
        return this;
    }

    public Compte transactionsDebiter(Set<Transaction> transactionsDebiter) {
        this.setTransactionsDebiter(transactionsDebiter);
        return this;
    }

    public Compte addTransactionCrediter(Transaction transactionsCrediter) {
        this.transactionsCrediter.add(transactionsCrediter);
        transactionsCrediter.setCompteCrediter(this);
        return this;
    }

    public Compte addTransactionDebiter(Transaction transactionsDebiter) {
        this.transactionsDebiter.add(transactionsDebiter);
        transactionsDebiter.setCompteDebiter(this);
        return this;
    }

    public Compte removeTransaction(Transaction transactionsCrediter) {
        this.transactionsCrediter.remove(transactionsCrediter);
        transactionsCrediter.setCompteCrediter(null);
        return this;
    }

    public Compte removeTransactionDebiter(Transaction transactionsDebiter) {
        this.transactionsDebiter.remove(transactionsDebiter);
        transactionsDebiter.setCompteDebiter(null);
        return this;
    }

    public Set<SoldeComptable> getSoldeComptables() {
        return this.soldeComptables;
    }

    public void setSoldeComptables(Set<SoldeComptable> soldeComptables) {
        if (this.soldeComptables != null) {
            this.soldeComptables.forEach(i -> i.setCompte(null));
        }
        if (soldeComptables != null) {
            soldeComptables.forEach(i -> i.setCompte(this));
        }
        this.soldeComptables = soldeComptables;
    }

    public Compte soldeComptables(Set<SoldeComptable> soldeComptables) {
        this.setSoldeComptables(soldeComptables);
        return this;
    }

    public Compte addSoldeComptable(SoldeComptable soldeComptable) {
        this.soldeComptables.add(soldeComptable);
        soldeComptable.setCompte(this);
        return this;
    }

    public Compte removeSoldeComptable(SoldeComptable soldeComptable) {
        this.soldeComptables.remove(soldeComptable);
        soldeComptable.setCompte(null);
        return this;
    }

    public Set<CompteAttente> getCompteAttentes() {
        return this.compteAttentes;
    }

    public void setCompteAttentes(Set<CompteAttente> compteAttentes) {
        if (this.compteAttentes != null) {
            this.compteAttentes.forEach(i -> i.setCompte(null));
        }
        if (compteAttentes != null) {
            compteAttentes.forEach(i -> i.setCompte(this));
        }
        this.compteAttentes = compteAttentes;
    }

    public Compte compteAttentes(Set<CompteAttente> compteAttentes) {
        this.setCompteAttentes(compteAttentes);
        return this;
    }

    public Compte addCompteAttente(CompteAttente compteAttente) {
        this.compteAttentes.add(compteAttente);
        compteAttente.setCompte(this);
        return this;
    }

    public Compte removeCompteAttente(CompteAttente compteAttente) {
        this.compteAttentes.remove(compteAttente);
        compteAttente.setCompte(null);
        return this;
    }

    public Set<CompteTransfert> getCompteTransferts() {
        return this.compteTransferts;
    }

    public void setCompteTransferts(Set<CompteTransfert> compteTransferts) {
        if (this.compteTransferts != null) {
            this.compteTransferts.forEach(i -> i.setCompte(null));
        }
        if (compteTransferts != null) {
            compteTransferts.forEach(i -> i.setCompte(this));
        }
        this.compteTransferts = compteTransferts;
    }

    public Compte compteTransferts(Set<CompteTransfert> compteTransferts) {
        this.setCompteTransferts(compteTransferts);
        return this;
    }

    public Compte addCompteTransfert(CompteTransfert compteTransfert) {
        this.compteTransferts.add(compteTransfert);
        compteTransfert.setCompte(this);
        return this;
    }

    public Compte removeCompteTransfert(CompteTransfert compteTransfert) {
        this.compteTransferts.remove(compteTransfert);
        compteTransfert.setCompte(null);
        return this;
    }

    public Set<Audit> getAudits() {
        return this.audits;
    }

    public void setAudits(Set<Audit> audits) {
        if (this.audits != null) {
            this.audits.forEach(i -> i.setCompte(null));
        }
        if (audits != null) {
            audits.forEach(i -> i.setCompte(this));
        }
        this.audits = audits;
    }

    public Compte audits(Set<Audit> audits) {
        this.setAudits(audits);
        return this;
    }

    public Compte addAudit(Audit audit) {
        this.audits.add(audit);
        audit.setCompte(this);
        return this;
    }

    public Compte removeAudit(Audit audit) {
        this.audits.remove(audit);
        audit.setCompte(null);
        return this;
    }

    public Bilan getBilan() {
        return this.bilan;
    }

    public void setBilan(Bilan bilan) {
        this.bilan = bilan;
    }

    public Compte bilan(Bilan bilan) {
        this.setBilan(bilan);
        return this;
    }

    public Set<PieceComptable> getPieceComptables() {
        return this.pieceComptables;
    }

    public void setPieceComptables(Set<PieceComptable> pieceComptables) {
        if (this.pieceComptables != null) {
            this.pieceComptables.forEach(i -> i.removeComptes(this));
        }
        if (pieceComptables != null) {
            pieceComptables.forEach(i -> i.addComptes(this));
        }
        this.pieceComptables = pieceComptables;
    }

    public Compte pieceComptables(Set<PieceComptable> pieceComptables) {
        this.setPieceComptables(pieceComptables);
        return this;
    }

    public Compte addPieceComptable(PieceComptable pieceComptable) {
        this.pieceComptables.add(pieceComptable);
        pieceComptable.getComptes().add(this);
        return this;
    }

    public Compte removePieceComptable(PieceComptable pieceComptable) {
        this.pieceComptables.remove(pieceComptable);
        pieceComptable.getComptes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Compte)) {
            return false;
        }
        return getId() != null && getId().equals(((Compte) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Compte{" +
            "id=" + getId() +
            ", numeroCompte='" + getNumeroCompte() + "'" +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", cloture='" + getCloture() + "'" +
            "}";
    }
}
