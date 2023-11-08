import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompteComptable } from '../compte-comptable.model';
import { CompteComptableService } from '../service/compte-comptable.service';
import { CompteComptableFormService, CompteComptableFormGroup } from './compte-comptable-form.service';

@Component({
  standalone: true,
  selector: 'jhi-compte-comptable-update',
  templateUrl: './compte-comptable-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CompteComptableUpdateComponent implements OnInit {
  isSaving = false;
  compteComptable: ICompteComptable | null = null;

  editForm: CompteComptableFormGroup = this.compteComptableFormService.createCompteComptableFormGroup();

  constructor(
    protected compteComptableService: CompteComptableService,
    protected compteComptableFormService: CompteComptableFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compteComptable }) => {
      this.compteComptable = compteComptable;
      if (compteComptable) {
        this.updateForm(compteComptable);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compteComptable = this.compteComptableFormService.getCompteComptable(this.editForm);
    if (compteComptable.id !== null) {
      this.subscribeToSaveResponse(this.compteComptableService.update(compteComptable));
    } else {
      this.subscribeToSaveResponse(this.compteComptableService.create(compteComptable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompteComptable>>): void {
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

  protected updateForm(compteComptable: ICompteComptable): void {
    this.compteComptable = compteComptable;
    this.compteComptableFormService.resetForm(this.editForm, compteComptable);
  }
}
