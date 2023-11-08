import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IClassComptable } from '../class-comptable.model';
import { ClassComptableService } from '../service/class-comptable.service';
import { ClassComptableFormService, ClassComptableFormGroup } from './class-comptable-form.service';

@Component({
  standalone: true,
  selector: 'jhi-class-comptable-update',
  templateUrl: './class-comptable-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClassComptableUpdateComponent implements OnInit {
  isSaving = false;
  classComptable: IClassComptable | null = null;

  comptesSharedCollection: ICompte[] = [];

  editForm: ClassComptableFormGroup = this.classComptableFormService.createClassComptableFormGroup();

  constructor(
    protected classComptableService: ClassComptableService,
    protected classComptableFormService: ClassComptableFormService,
    protected compteService: CompteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ classComptable }) => {
      this.classComptable = classComptable;
      if (classComptable) {
        this.updateForm(classComptable);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const classComptable = this.classComptableFormService.getClassComptable(this.editForm);
    if (classComptable.id !== null) {
      this.subscribeToSaveResponse(this.classComptableService.update(classComptable));
    } else {
      this.subscribeToSaveResponse(this.classComptableService.create(classComptable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClassComptable>>): void {
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

  protected updateForm(classComptable: IClassComptable): void {
    this.classComptable = classComptable;
    this.classComptableFormService.resetForm(this.editForm, classComptable);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(
      this.comptesSharedCollection,
      classComptable.compte,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, this.classComptable?.compte)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));
  }
}
