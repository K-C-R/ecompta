import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IBalance } from 'app/entities/balance/balance.model';
import { BalanceService } from 'app/entities/balance/service/balance.service';
import { JournalDefinitifService } from '../service/journal-definitif.service';
import { IJournalDefinitif } from '../journal-definitif.model';
import { JournalDefinitifFormService, JournalDefinitifFormGroup } from './journal-definitif-form.service';

@Component({
  standalone: true,
  selector: 'jhi-journal-definitif-update',
  templateUrl: './journal-definitif-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JournalDefinitifUpdateComponent implements OnInit {
  isSaving = false;
  journalDefinitif: IJournalDefinitif | null = null;

  comptesSharedCollection: ICompte[] = [];
  balancesSharedCollection: IBalance[] = [];

  editForm: JournalDefinitifFormGroup = this.journalDefinitifFormService.createJournalDefinitifFormGroup();

  constructor(
    protected journalDefinitifService: JournalDefinitifService,
    protected journalDefinitifFormService: JournalDefinitifFormService,
    protected compteService: CompteService,
    protected balanceService: BalanceService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  compareBalance = (o1: IBalance | null, o2: IBalance | null): boolean => this.balanceService.compareBalance(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ journalDefinitif }) => {
      this.journalDefinitif = journalDefinitif;
      if (journalDefinitif) {
        this.updateForm(journalDefinitif);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const journalDefinitif = this.journalDefinitifFormService.getJournalDefinitif(this.editForm);
    if (journalDefinitif.id !== null) {
      this.subscribeToSaveResponse(this.journalDefinitifService.update(journalDefinitif));
    } else {
      this.subscribeToSaveResponse(this.journalDefinitifService.create(journalDefinitif));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJournalDefinitif>>): void {
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

  protected updateForm(journalDefinitif: IJournalDefinitif): void {
    this.journalDefinitif = journalDefinitif;
    this.journalDefinitifFormService.resetForm(this.editForm, journalDefinitif);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(
      this.comptesSharedCollection,
      journalDefinitif.compte,
    );
    this.balancesSharedCollection = this.balanceService.addBalanceToCollectionIfMissing<IBalance>(
      this.balancesSharedCollection,
      journalDefinitif.balance,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, this.journalDefinitif?.compte)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));

    this.balanceService
      .query()
      .pipe(map((res: HttpResponse<IBalance[]>) => res.body ?? []))
      .pipe(
        map((balances: IBalance[]) =>
          this.balanceService.addBalanceToCollectionIfMissing<IBalance>(balances, this.journalDefinitif?.balance),
        ),
      )
      .subscribe((balances: IBalance[]) => (this.balancesSharedCollection = balances));
  }
}
