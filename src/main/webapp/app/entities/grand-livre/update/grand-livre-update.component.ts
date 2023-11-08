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
import { GrandLivreService } from '../service/grand-livre.service';
import { IGrandLivre } from '../grand-livre.model';
import { GrandLivreFormService, GrandLivreFormGroup } from './grand-livre-form.service';

@Component({
  standalone: true,
  selector: 'jhi-grand-livre-update',
  templateUrl: './grand-livre-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GrandLivreUpdateComponent implements OnInit {
  isSaving = false;
  grandLivre: IGrandLivre | null = null;

  comptesSharedCollection: ICompte[] = [];
  balancesSharedCollection: IBalance[] = [];

  editForm: GrandLivreFormGroup = this.grandLivreFormService.createGrandLivreFormGroup();

  constructor(
    protected grandLivreService: GrandLivreService,
    protected grandLivreFormService: GrandLivreFormService,
    protected compteService: CompteService,
    protected balanceService: BalanceService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCompte = (o1: ICompte | null, o2: ICompte | null): boolean => this.compteService.compareCompte(o1, o2);

  compareBalance = (o1: IBalance | null, o2: IBalance | null): boolean => this.balanceService.compareBalance(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grandLivre }) => {
      this.grandLivre = grandLivre;
      if (grandLivre) {
        this.updateForm(grandLivre);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grandLivre = this.grandLivreFormService.getGrandLivre(this.editForm);
    if (grandLivre.id !== null) {
      this.subscribeToSaveResponse(this.grandLivreService.update(grandLivre));
    } else {
      this.subscribeToSaveResponse(this.grandLivreService.create(grandLivre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrandLivre>>): void {
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

  protected updateForm(grandLivre: IGrandLivre): void {
    this.grandLivre = grandLivre;
    this.grandLivreFormService.resetForm(this.editForm, grandLivre);

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing<ICompte>(
      this.comptesSharedCollection,
      grandLivre.compte,
    );
    this.balancesSharedCollection = this.balanceService.addBalanceToCollectionIfMissing<IBalance>(
      this.balancesSharedCollection,
      grandLivre.balance,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing<ICompte>(comptes, this.grandLivre?.compte)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));

    this.balanceService
      .query()
      .pipe(map((res: HttpResponse<IBalance[]>) => res.body ?? []))
      .pipe(
        map((balances: IBalance[]) => this.balanceService.addBalanceToCollectionIfMissing<IBalance>(balances, this.grandLivre?.balance)),
      )
      .subscribe((balances: IBalance[]) => (this.balancesSharedCollection = balances));
  }
}
