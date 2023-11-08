package com.edefence.ecompta.service.criteria;

import com.edefence.ecompta.domain.enumeration.TypeEcriture;
import java.io.Serializable;
import java.util.Objects;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.edefence.ecompta.domain.EcritureComptable} entity. This class is used
 * in {@link com.edefence.ecompta.web.rest.EcritureComptableResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /ecriture-comptables?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EcritureComptableCriteria implements Serializable, Criteria {

    /**
     * Class for filtering TypeEcriture
     */
    public static class TypeEcritureFilter extends Filter<TypeEcriture> {

        public TypeEcritureFilter() {}

        public TypeEcritureFilter(TypeEcritureFilter filter) {
            super(filter);
        }

        @Override
        public TypeEcritureFilter copy() {
            return new TypeEcritureFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private InstantFilter date;

    private LongFilter montant;

    private StringFilter libelle;

    private TypeEcritureFilter typeEcriture;

    private StringFilter reference;

    private StringFilter autreInfos;

    private StringFilter pieces;

    private LongFilter compteId;

    private Boolean distinct;

    public EcritureComptableCriteria() {}

    public EcritureComptableCriteria(EcritureComptableCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.date = other.date == null ? null : other.date.copy();
        this.montant = other.montant == null ? null : other.montant.copy();
        this.libelle = other.libelle == null ? null : other.libelle.copy();
        this.typeEcriture = other.typeEcriture == null ? null : other.typeEcriture.copy();
        this.reference = other.reference == null ? null : other.reference.copy();
        this.autreInfos = other.autreInfos == null ? null : other.autreInfos.copy();
        this.pieces = other.pieces == null ? null : other.pieces.copy();
        this.compteId = other.compteId == null ? null : other.compteId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public EcritureComptableCriteria copy() {
        return new EcritureComptableCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public InstantFilter getDate() {
        return date;
    }

    public InstantFilter date() {
        if (date == null) {
            date = new InstantFilter();
        }
        return date;
    }

    public void setDate(InstantFilter date) {
        this.date = date;
    }

    public LongFilter getMontant() {
        return montant;
    }

    public LongFilter montant() {
        if (montant == null) {
            montant = new LongFilter();
        }
        return montant;
    }

    public void setMontant(LongFilter montant) {
        this.montant = montant;
    }

    public StringFilter getLibelle() {
        return libelle;
    }

    public StringFilter libelle() {
        if (libelle == null) {
            libelle = new StringFilter();
        }
        return libelle;
    }

    public void setLibelle(StringFilter libelle) {
        this.libelle = libelle;
    }

    public TypeEcritureFilter getTypeEcriture() {
        return typeEcriture;
    }

    public TypeEcritureFilter typeEcriture() {
        if (typeEcriture == null) {
            typeEcriture = new TypeEcritureFilter();
        }
        return typeEcriture;
    }

    public void setTypeEcriture(TypeEcritureFilter typeEcriture) {
        this.typeEcriture = typeEcriture;
    }

    public StringFilter getReference() {
        return reference;
    }

    public StringFilter reference() {
        if (reference == null) {
            reference = new StringFilter();
        }
        return reference;
    }

    public void setReference(StringFilter reference) {
        this.reference = reference;
    }

    public StringFilter getAutreInfos() {
        return autreInfos;
    }

    public StringFilter autreInfos() {
        if (autreInfos == null) {
            autreInfos = new StringFilter();
        }
        return autreInfos;
    }

    public void setAutreInfos(StringFilter autreInfos) {
        this.autreInfos = autreInfos;
    }

    public StringFilter getPieces() {
        return pieces;
    }

    public StringFilter pieces() {
        if (pieces == null) {
            pieces = new StringFilter();
        }
        return pieces;
    }

    public void setPieces(StringFilter pieces) {
        this.pieces = pieces;
    }

    public LongFilter getCompteId() {
        return compteId;
    }

    public LongFilter compteId() {
        if (compteId == null) {
            compteId = new LongFilter();
        }
        return compteId;
    }

    public void setCompteId(LongFilter compteId) {
        this.compteId = compteId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final EcritureComptableCriteria that = (EcritureComptableCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(date, that.date) &&
            Objects.equals(montant, that.montant) &&
            Objects.equals(libelle, that.libelle) &&
            Objects.equals(typeEcriture, that.typeEcriture) &&
            Objects.equals(reference, that.reference) &&
            Objects.equals(autreInfos, that.autreInfos) &&
            Objects.equals(pieces, that.pieces) &&
            Objects.equals(compteId, that.compteId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, montant, libelle, typeEcriture, reference, autreInfos, pieces, compteId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EcritureComptableCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (date != null ? "date=" + date + ", " : "") +
            (montant != null ? "montant=" + montant + ", " : "") +
            (libelle != null ? "libelle=" + libelle + ", " : "") +
            (typeEcriture != null ? "typeEcriture=" + typeEcriture + ", " : "") +
            (reference != null ? "reference=" + reference + ", " : "") +
            (autreInfos != null ? "autreInfos=" + autreInfos + ", " : "") +
            (pieces != null ? "pieces=" + pieces + ", " : "") +
            (compteId != null ? "compteId=" + compteId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
