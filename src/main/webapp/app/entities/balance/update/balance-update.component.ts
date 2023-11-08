import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBalance } from '../balance.model';
import { BalanceService } from '../service/balance.service';
import { BalanceFormService, BalanceFormGroup } from './balance-form.service';

@Component({
  standalone: true,
  selector: 'jhi-balance-update',
  templateUrl: './balance-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BalanceUpdateComponent implements OnInit {
  isSaving = false;
  balance: IBalance | null = null;

  editForm: BalanceFormGroup = this.balanceFormService.createBalanceFormGroup();

  constructor(
    protected balanceService: BalanceService,
    protected balanceFormService: BalanceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ balance }) => {
      this.balance = balance;
      if (balance) {
        this.updateForm(balance);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const balance = this.balanceFormService.getBalance(this.editForm);
    if (balance.id !== null) {
      this.subscribeToSaveResponse(this.balanceService.update(balance));
    } else {
      this.subscribeToSaveResponse(this.balanceService.create(balance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBalance>>): void {
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

  protected updateForm(balance: IBalance): void {
    this.balance = balance;
    this.balanceFormService.resetForm(this.editForm, balance);
  }
}
