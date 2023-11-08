package com.edefence.ecompta.domain;

import com.edefence.ecompta.domain.enumeration.TypeEcriture;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EcritureComptable.
 */
@Entity
@Table(name = "ecriture_comptable")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EcritureComptable implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @NotNull
    @Min(value = 0L)
    @Column(name = "montant", nullable = false)
    private Long montant;

    @Column(name = "libelle")
    private String libelle;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type_ecriture", nullable = false)
    private TypeEcriture typeEcriture;

    @Column(name = "reference")
    private String reference;

    @Column(name = "autre_infos")
    private String autreInfos;

    @Column(name = "pieces")
    private String pieces;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = { "transactions", "soldeComptables", "compteAttentes", "compteTransferts", "audits", "bilan", "pieceComptables" },
        allowSetters = true
    )
    private Compte compte;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EcritureComptable id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public EcritureComptable date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Long getMontant() {
        return this.montant;
    }

    public EcritureComptable montant(Long montant) {
        this.setMontant(montant);
        return this;
    }

    public void setMontant(Long montant) {
        this.montant = montant;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public EcritureComptable libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public TypeEcriture getTypeEcriture() {
        return this.typeEcriture;
    }

    public EcritureComptable typeEcriture(TypeEcriture typeEcriture) {
        this.setTypeEcriture(typeEcriture);
        return this;
    }

    public void setTypeEcriture(TypeEcriture typeEcriture) {
        this.typeEcriture = typeEcriture;
    }

    public String getReference() {
        return this.reference;
    }

    public EcritureComptable reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getAutreInfos() {
        return this.autreInfos;
    }

    public EcritureComptable autreInfos(String autreInfos) {
        this.setAutreInfos(autreInfos);
        return this;
    }

    public void setAutreInfos(String autreInfos) {
        this.autreInfos = autreInfos;
    }

    public String getPieces() {
        return this.pieces;
    }

    public EcritureComptable pieces(String pieces) {
        this.setPieces(pieces);
        return this;
    }

    public void setPieces(String pieces) {
        this.pieces = pieces;
    }

    public Compte getCompte() {
        return this.compte;
    }

    public void setCompte(Compte compte) {
        this.compte = compte;
    }

    public EcritureComptable compte(Compte compte) {
        this.setCompte(compte);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EcritureComptable)) {
            return false;
        }
        return getId() != null && getId().equals(((EcritureComptable) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EcritureComptable{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", montant=" + getMontant() +
            ", libelle='" + getLibelle() + "'" +
            ", typeEcriture='" + getTypeEcriture() + "'" +
            ", reference='" + getReference() + "'" +
            ", autreInfos='" + getAutreInfos() + "'" +
            ", pieces='" + getPieces() + "'" +
            "}";
    }
}
