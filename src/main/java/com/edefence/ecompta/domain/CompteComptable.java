package com.edefence.ecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CompteComptable.
 */
@Entity
@Table(name = "compte_comptable")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CompteComptable implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "numero")
    private Long numero;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "description")
    private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "compteComptable")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compte", "compteComptable" }, allowSetters = true)
    private Set<ClassComptable> classComptables = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CompteComptable id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNumero() {
        return this.numero;
    }

    public CompteComptable numero(Long numero) {
        this.setNumero(numero);
        return this;
    }

    public void setNumero(Long numero) {
        this.numero = numero;
    }

    public String getNom() {
        return this.nom;
    }

    public CompteComptable nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public CompteComptable description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<ClassComptable> getClassComptables() {
        return this.classComptables;
    }

    public void setClassComptables(Set<ClassComptable> classComptables) {
        if (this.classComptables != null) {
            this.classComptables.forEach(i -> i.setCompteComptable(null));
        }
        if (classComptables != null) {
            classComptables.forEach(i -> i.setCompteComptable(this));
        }
        this.classComptables = classComptables;
    }

    public CompteComptable classComptables(Set<ClassComptable> classComptables) {
        this.setClassComptables(classComptables);
        return this;
    }

    public CompteComptable addClassComptable(ClassComptable classComptable) {
        this.classComptables.add(classComptable);
        classComptable.setCompteComptable(this);
        return this;
    }

    public CompteComptable removeClassComptable(ClassComptable classComptable) {
        this.classComptables.remove(classComptable);
        classComptable.setCompteComptable(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CompteComptable)) {
            return false;
        }
        return getId() != null && getId().equals(((CompteComptable) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CompteComptable{" +
            "id=" + getId() +
            ", numero=" + getNumero() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
