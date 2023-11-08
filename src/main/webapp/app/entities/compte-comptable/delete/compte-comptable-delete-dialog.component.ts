import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICompteComptable } from '../compte-comptable.model';
import { CompteComptableService } from '../service/compte-comptable.service';

@Component({
  standalone: true,
  templateUrl: './compte-comptable-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CompteComptableDeleteDialogComponent {
  compteComptable?: ICompteComptable;

  constructor(
    protected compteComptableService: CompteComptableService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.compteComptableService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
