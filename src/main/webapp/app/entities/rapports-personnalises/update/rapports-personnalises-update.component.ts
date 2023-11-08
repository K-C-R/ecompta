import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IRapportsPersonnalises } from '../rapports-personnalises.model';
import { RapportsPersonnalisesService } from '../service/rapports-personnalises.service';
import { RapportsPersonnalisesFormService, RapportsPersonnalisesFormGroup } from './rapports-personnalises-form.service';

@Component({
  standalone: true,
  selector: 'jhi-rapports-personnalises-update',
  templateUrl: './rapports-personnalises-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RapportsPersonnalisesUpdateComponent implements OnInit {
  isSaving = false;
  rapportsPersonnalises: IRapportsPersonnalises | null = null;

  editForm: RapportsPersonnalisesFormGroup = this.rapportsPersonnalisesFormService.createRapportsPersonnalisesFormGroup();

  constructor(
    protected rapportsPersonnalisesService: RapportsPersonnalisesService,
    protected rapportsPersonnalisesFormService: RapportsPersonnalisesFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rapportsPersonnalises }) => {
      this.rapportsPersonnalises = rapportsPersonnalises;
      if (rapportsPersonnalises) {
        this.updateForm(rapportsPersonnalises);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rapportsPersonnalises = this.rapportsPersonnalisesFormService.getRapportsPersonnalises(this.editForm);
    if (rapportsPersonnalises.id !== null) {
      this.subscribeToSaveResponse(this.rapportsPersonnalisesService.update(rapportsPersonnalises));
    } else {
      this.subscribeToSaveResponse(this.rapportsPersonnalisesService.create(rapportsPersonnalises));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRapportsPersonnalises>>): void {
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

  protected updateForm(rapportsPersonnalises: IRapportsPersonnalises): void {
    this.rapportsPersonnalises = rapportsPersonnalises;
    this.rapportsPersonnalisesFormService.resetForm(this.editForm, rapportsPersonnalises);
  }
}
