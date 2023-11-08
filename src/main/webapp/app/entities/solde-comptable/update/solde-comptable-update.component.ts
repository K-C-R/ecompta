import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { ISoldeComptable } from '../solde-comptable.model';
import { SoldeComptableService } from '../service/solde-comptable.service';
import { SoldeComptableFormService, SoldeComptableFormGroup } from './solde-comptable-form.service';

@Component({
  standalone: true,
  selector: 'jhi-solde-comptable-update',
  templateUrl: './solde-comptable-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SoldeComptableUpdateComponent implements OnInit {
  isSaving = false;
  soldeComptable: ISoldeComptable | null = null;

  comptesSharedCollection: ICompte[] = [];

  editForm: SoldeComptableFormGroup = this.soldeComptableFormService.createSoldeComptableFormGroup();

  constructor(
    protected soldeComptableService: SoldeComptableService,
    protected soldeComptableFormService: SoldeComptableFormService,
    protected compteService: CompteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ soldeComptable }) => {
      this.soldeComptable = soldeComptable;
      if (soldeComptable) {
        this.updateForm(soldeComptable);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const soldeComptable = this.soldeComptableFormService.getSoldeComptable(this.editForm);
    if (soldeComptable.id !== null) {
      this.subscribeToSaveResponse(this.soldeComptableService.update(soldeComptable));
    } else {
      this.subscribeToSaveResponse(this.soldeComptableService.create(soldeComptable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISoldeComptable>>): void {
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

  protected updateForm(soldeComptable: ISoldeComptable): void {
    this.soldeComptable = soldeComptable;
    this.soldeComptableFormService.resetForm(this.editForm, soldeComptable);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(
      this.comptesSharedCollection,
      soldeComptable.compte,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, this.soldeComptable?.compte)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));
  }
}
