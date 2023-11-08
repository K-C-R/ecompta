import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBalance } from '../balance.model';
import { BalanceService } from '../service/balance.service';

@Component({
  standalone: true,
  templateUrl: './balance-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BalanceDeleteDialogComponent {
  balance?: IBalance;

  constructor(
    protected balanceService: BalanceService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.balanceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
