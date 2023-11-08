import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { TypeEcriture } from 'app/entities/enumerations/type-ecriture.model';
import { EcritureComptableService } from '../service/ecriture-comptable.service';
import { IEcritureComptable } from '../ecriture-comptable.model';
import { EcritureComptableFormService, EcritureComptableFormGroup } from './ecriture-comptable-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ecriture-comptable-update',
  templateUrl: './ecriture-comptable-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EcritureComptableUpdateComponent implements OnInit {
  isSaving = false;
  ecritureComptable: IEcritureComptable | null = null;
  typeEcritureValues = Object.keys(TypeEcriture);

  comptesSharedCollection: ICompte[] = [];

  editForm: EcritureComptableFormGroup = this.ecritureComptableFormService.createEcritureComptableFormGroup();

  constructor(
    protected ecritureComptableService: EcritureComptableService,
    protected ecritureComptableFormService: EcritureComptableFormService,
    protected compteService: CompteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ecritureComptable }) => {
      this.ecritureComptable = ecritureComptable;
      if (ecritureComptable) {
        this.updateForm(ecritureComptable);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ecritureComptable = this.ecritureComptableFormService.getEcritureComptable(this.editForm);
    if (ecritureComptable.id !== null) {
      this.subscribeToSaveResponse(this.ecritureComptableService.update(ecritureComptable));
    } else {
      this.subscribeToSaveResponse(this.ecritureComptableService.create(ecritureComptable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEcritureComptable>>): void {
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

  protected updateForm(ecritureComptable: IEcritureComptable): void {
    this.ecritureComptable = ecritureComptable;
    this.ecritureComptableFormService.resetForm(this.editForm, ecritureComptable);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(
      this.comptesSharedCollection,
      ecritureComptable.compte,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(
        map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, this.ecritureComptable?.compte)),
      )
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));
  }
}
