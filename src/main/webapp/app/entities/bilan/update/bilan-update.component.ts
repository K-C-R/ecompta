import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBilan } from '../bilan.model';
import { BilanService } from '../service/bilan.service';
import { BilanFormService, BilanFormGroup } from './bilan-form.service';

@Component({
  standalone: true,
  selector: 'jhi-bilan-update',
  templateUrl: './bilan-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BilanUpdateComponent implements OnInit {
  isSaving = false;
  bilan: IBilan | null = null;

  editForm: BilanFormGroup = this.bilanFormService.createBilanFormGroup();

  constructor(
    protected bilanService: BilanService,
    protected bilanFormService: BilanFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bilan }) => {
      this.bilan = bilan;
      if (bilan) {
        this.updateForm(bilan);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bilan = this.bilanFormService.getBilan(this.editForm);
    if (bilan.id !== null) {
      this.subscribeToSaveResponse(this.bilanService.update(bilan));
    } else {
      this.subscribeToSaveResponse(this.bilanService.create(bilan));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBilan>>): void {
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

  protected updateForm(bilan: IBilan): void {
    this.bilan = bilan;
    this.bilanFormService.resetForm(this.editForm, bilan);
  }
}
