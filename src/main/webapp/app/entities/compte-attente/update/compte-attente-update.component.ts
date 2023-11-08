import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { ICompteAttente } from '../compte-attente.model';
import { CompteAttenteService } from '../service/compte-attente.service';
import { CompteAttenteFormService, CompteAttenteFormGroup } from './compte-attente-form.service';

@Component({
  standalone: true,
  selector: 'jhi-compte-attente-update',
  templateUrl: './compte-attente-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CompteAttenteUpdateComponent implements OnInit {
  isSaving = false;
  compteAttente: ICompteAttente | null = null;

  comptesSharedCollection: ICompte[] = [];

  editForm: CompteAttenteFormGroup = this.compteAttenteFormService.createCompteAttenteFormGroup();

  constructor(
    protected compteAttenteService: CompteAttenteService,
    protected compteAttenteFormService: CompteAttenteFormService,
    protected compteService: CompteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compteAttente }) => {
      this.compteAttente = compteAttente;
      if (compteAttente) {
        this.updateForm(compteAttente);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compteAttente = this.compteAttenteFormService.getCompteAttente(this.editForm);
    if (compteAttente.id !== null) {
      this.subscribeToSaveResponse(this.compteAttenteService.update(compteAttente));
    } else {
      this.subscribeToSaveResponse(this.compteAttenteService.create(compteAttente));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompteAttente>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(compteAttente: ICompteAttente): void {
    this.compteAttente = compteAttente;
    this.compteAttenteFormService.resetForm(this.editForm, compteAttente);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(
      this.comptesSharedCollection,
      compteAttente.compte,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, this.compteAttente?.compte)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));
  }
}
