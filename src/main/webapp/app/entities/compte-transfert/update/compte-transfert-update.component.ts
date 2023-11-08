import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { ICompteTransfert } from '../compte-transfert.model';
import { CompteTransfertService } from '../service/compte-transfert.service';
import { CompteTransfertFormService, CompteTransfertFormGroup } from './compte-transfert-form.service';

@Component({
  standalone: true,
  selector: 'jhi-compte-transfert-update',
  templateUrl: './compte-transfert-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CompteTransfertUpdateComponent implements OnInit {
  isSaving = false;
  compteTransfert: ICompteTransfert | null = null;

  comptesSharedCollection: ICompte[] = [];

  editForm: CompteTransfertFormGroup = this.compteTransfertFormService.createCompteTransfertFormGroup();

  constructor(
    protected compteTransfertService: CompteTransfertService,
    protected compteTransfertFormService: CompteTransfertFormService,
    protected compteService: CompteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compteTransfert }) => {
      this.compteTransfert = compteTransfert;
      if (compteTransfert) {
        this.updateForm(compteTransfert);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compteTransfert = this.compteTransfertFormService.getCompteTransfert(this.editForm);
    if (compteTransfert.id !== null) {
      this.subscribeToSaveResponse(this.compteTransfertService.update(compteTransfert));
    } else {
      this.subscribeToSaveResponse(this.compteTransfertService.create(compteTransfert));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompteTransfert>>): void {
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

  protected updateForm(compteTransfert: ICompteTransfert): void {
    this.compteTransfert = compteTransfert;
    this.compteTransfertFormService.resetForm(this.editForm, compteTransfert);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(
      this.comptesSharedCollection,
      compteTransfert.compte,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, this.compteTransfert?.compte)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));
  }
}
