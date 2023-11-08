import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IResultat } from '../resultat.model';
import { ResultatService } from '../service/resultat.service';
import { ResultatFormService, ResultatFormGroup } from './resultat-form.service';

@Component({
  standalone: true,
  selector: 'jhi-resultat-update',
  templateUrl: './resultat-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ResultatUpdateComponent implements OnInit {
  isSaving = false;
  resultat: IResultat | null = null;

  editForm: ResultatFormGroup = this.resultatFormService.createResultatFormGroup();

  constructor(
    protected resultatService: ResultatService,
    protected resultatFormService: ResultatFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultat }) => {
      this.resultat = resultat;
      if (resultat) {
        this.updateForm(resultat);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resultat = this.resultatFormService.getResultat(this.editForm);
    if (resultat.id !== null) {
      this.subscribeToSaveResponse(this.resultatService.update(resultat));
    } else {
      this.subscribeToSaveResponse(this.resultatService.create(resultat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResultat>>): void {
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

  protected updateForm(resultat: IResultat): void {
    this.resultat = resultat;
    this.resultatFormService.resetForm(this.editForm, resultat);
  }
}
