import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPieceComptable } from '../piece-comptable.model';
import { PieceComptableService } from '../service/piece-comptable.service';

@Component({
  standalone: true,
  templateUrl: './piece-comptable-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PieceComptableDeleteDialogComponent {
  pieceComptable?: IPieceComptable;

  constructor(
    protected pieceComptableService: PieceComptableService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pieceComptableService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
