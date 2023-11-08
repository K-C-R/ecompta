import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISoldeComptable } from '../solde-comptable.model';
import { SoldeComptableService } from '../service/solde-comptable.service';

@Component({
  standalone: true,
  templateUrl: './solde-comptable-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SoldeComptableDeleteDialogComponent {
  soldeComptable?: ISoldeComptable;

  constructor(
    protected soldeComptableService: SoldeComptableService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.soldeComptableService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
