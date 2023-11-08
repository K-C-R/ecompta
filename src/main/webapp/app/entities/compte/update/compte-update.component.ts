import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBilan } from 'app/entities/bilan/bilan.model';
import { BilanService } from 'app/entities/bilan/service/bilan.service';
import { ICompte } from '../compte.model';
import { CompteService } from '../service/compte.service';
import { CompteFormService, CompteFormGroup } from './compte-form.service';

@Component({
  standalone: true,
  selector: 'jhi-compte-update',
  templateUrl: './compte-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CompteUpdateComponent implements OnInit {
  isSaving = false;
  compte: ICompte | null = null;

  bilansSharedCollection: IBilan[] = [];

  editForm: CompteFormGroup = this.compteFormService.createCompteFormGroup();

  constructor(
    protected compteService: CompteService,
    protected compteFormService: CompteFormService,
    protected bilanService: BilanService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareBilan = (o1: IBilan | null, o2: IBilan | null): boolean => this.bilanService.compareBilan(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compte }) => {
      this.compte = compte;
      if (compte) {
        this.updateForm(compte);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compte = this.compteFormService.getCompte(this.editForm);
    if (compte.id !== null) {
      this.subscribeToSaveResponse(this.compteService.update(compte));
    } else {
      this.subscribeToSaveResponse(this.compteService.create(compte));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompte>>): void {
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

  protected updateForm(compte: ICompte): void {
    this.compte = compte;
    this.compteFormService.resetForm(this.editForm, compte);

    this.bilansSharedCollection = this.bilanService.addBilanToCollectionIfMissing<IBilan>(this.bilansSharedCollection, compte.bilan);
  }

  protected loadRelationshipsOptions(): void {
    this.bilanService
      .query()
      .pipe(map((res: HttpResponse<IBilan[]>) => res.body ?? []))
      .pipe(map((bilans: IBilan[]) => this.bilanService.addBilanToCollectionIfMissing<IBilan>(bilans, this.compte?.bilan)))
      .subscribe((bilans: IBilan[]) => (this.bilansSharedCollection = bilans));
  }
}
