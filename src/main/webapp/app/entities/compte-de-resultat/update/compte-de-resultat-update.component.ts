import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IResultat } from 'app/entities/resultat/resultat.model';
import { ResultatService } from 'app/entities/resultat/service/resultat.service';
import { ICompteDeResultat } from '../compte-de-resultat.model';
import { CompteDeResultatService } from '../service/compte-de-resultat.service';
import { CompteDeResultatFormService, CompteDeResultatFormGroup } from './compte-de-resultat-form.service';

@Component({
  standalone: true,
  selector: 'jhi-compte-de-resultat-update',
  templateUrl: './compte-de-resultat-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CompteDeResultatUpdateComponent implements OnInit {
  isSaving = false;
  compteDeResultat: ICompteDeResultat | null = null;

  resultatsSharedCollection: IResultat[] = [];

  editForm: CompteDeResultatFormGroup = this.compteDeResultatFormService.createCompteDeResultatFormGroup();

  constructor(
    protected compteDeResultatService: CompteDeResultatService,
    protected compteDeResultatFormService: CompteDeResultatFormService,
    protected resultatService: ResultatService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareResultat = (o1: IResultat | null, o2: IResultat | null): boolean => this.resultatService.compareResultat(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compteDeResultat }) => {
      this.compteDeResultat = compteDeResultat;
      if (compteDeResultat) {
        this.updateForm(compteDeResultat);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compteDeResultat = this.compteDeResultatFormService.getCompteDeResultat(this.editForm);
    if (compteDeResultat.id !== null) {
      this.subscribeToSaveResponse(this.compteDeResultatService.update(compteDeResultat));
    } else {
      this.subscribeToSaveResponse(this.compteDeResultatService.create(compteDeResultat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompteDeResultat>>): void {
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

  protected updateForm(compteDeResultat: ICompteDeResultat): void {
    this.compteDeResultat = compteDeResultat;
    this.compteDeResultatFormService.resetForm(this.editForm, compteDeResultat);

    this.resultatsSharedCollection = this.resultatService.addResultatToCollectionIfMissing<IResultat>(
      this.resultatsSharedCollection,
      compteDeResultat.resultat,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.resultatService
      .query()
      .pipe(map((res: HttpResponse<IResultat[]>) => res.body ?? []))
      .pipe(
        map((resultats: IResultat[]) =>
          this.resultatService.addResultatToCollectionIfMissing<IResultat>(resultats, this.compteDeResultat?.resultat),
        ),
      )
      .subscribe((resultats: IResultat[]) => (this.resultatsSharedCollection = resultats));
  }
}
