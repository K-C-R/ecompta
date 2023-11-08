import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICompteTransfert } from '../compte-transfert.model';
import { CompteTransfertService } from '../service/compte-transfert.service';

@Component({
  standalone: true,
  templateUrl: './compte-transfert-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CompteTransfertDeleteDialogComponent {
  compteTransfert?: ICompteTransfert;

  constructor(
    protected compteTransfertService: CompteTransfertService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.compteTransfertService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
