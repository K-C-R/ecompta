import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { ITransaction } from 'app/entities/transaction/transaction.model';
import { TransactionService } from 'app/entities/transaction/service/transaction.service';
import { PieceComptableService } from '../service/piece-comptable.service';
import { IPieceComptable } from '../piece-comptable.model';
import { PieceComptableFormService, PieceComptableFormGroup } from './piece-comptable-form.service';

@Component({
  standalone: true,
  selector: 'jhi-piece-comptable-update',
  templateUrl: './piece-comptable-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PieceComptableUpdateComponent implements OnInit {
  isSaving = false;
  pieceComptable: IPieceComptable | null = null;

  comptesSharedCollection: ICompte[] = [];
  transactionsSharedCollection: ITransaction[] = [];

  editForm: PieceComptableFormGroup = this.pieceComptableFormService.createPieceComptableFormGroup();

  constructor(
    protected pieceComptableService: PieceComptableService,
    protected pieceComptableFormService: PieceComptableFormService,
    protected compteService: CompteService,
    protected transactionService: TransactionService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  compareTransaction = (o1: ITransaction | null, o2: ITransaction | null): boolean => this.transactionService.compareTransaction(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pieceComptable }) => {
      this.pieceComptable = pieceComptable;
      if (pieceComptable) {
        this.updateForm(pieceComptable);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pieceComptable = this.pieceComptableFormService.getPieceComptable(this.editForm);
    if (pieceComptable.id !== null) {
      this.subscribeToSaveResponse(this.pieceComptableService.update(pieceComptable));
    } else {
      this.subscribeToSaveResponse(this.pieceComptableService.create(pieceComptable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPieceComptable>>): void {
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

  protected updateForm(pieceComptable: IPieceComptable): void {
    this.pieceComptable = pieceComptable;
    this.pieceComptableFormService.resetForm(this.editForm, pieceComptable);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(
      this.comptesSharedCollection,
      ...(pieceComptable.comptes ?? []),
    );
    this.transactionsSharedCollection = this.transactionService.addTransactionToCollectionIfMissing<ITransaction>(
      this.transactionsSharedCollection,
      ...(pieceComptable.transactions ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(
        map((comptes: ICompte[]) =>
          this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, ...(this.pieceComptable?.comptes ?? [])),
        ),
      )
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));

    this.transactionService
      .query()
      .pipe(map((res: HttpResponse<ITransaction[]>) => res.body ?? []))
      .pipe(
        map((transactions: ITransaction[]) =>
          this.transactionService.addTransactionToCollectionIfMissing<ITransaction>(
            transactions,
            ...(this.pieceComptable?.transactions ?? []),
          ),
        ),
      )
      .subscribe((transactions: ITransaction[]) => (this.transactionsSharedCollection = transactions));
  }
}
