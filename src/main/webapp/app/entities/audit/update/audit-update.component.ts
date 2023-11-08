import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IAudit } from '../audit.model';
import { AuditService } from '../service/audit.service';
import { AuditFormService, AuditFormGroup } from './audit-form.service';

@Component({
  standalone: true,
  selector: 'jhi-audit-update',
  templateUrl: './audit-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AuditUpdateComponent implements OnInit {
  isSaving = false;
  audit: IAudit | null = null;

  comptesSharedCollection: ICompte[] = [];

  editForm: AuditFormGroup = this.auditFormService.createAuditFormGroup();

  constructor(
    protected auditService: AuditService,
    protected auditFormService: AuditFormService,
    protected compteService: CompteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ audit }) => {
      this.audit = audit;
      if (audit) {
        this.updateForm(audit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const audit = this.auditFormService.getAudit(this.editForm);
    if (audit.id !== null) {
      this.subscribeToSaveResponse(this.auditService.update(audit));
    } else {
      this.subscribeToSaveResponse(this.auditService.create(audit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAudit>>): void {
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

  protected updateForm(audit: IAudit): void {
    this.audit = audit;
    this.auditFormService.resetForm(this.editForm, audit);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(this.comptesSharedCollection, audit.compte);
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, this.audit?.compte)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));
  }
}
