import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBilan } from '../bilan.model';
import { BilanService } from '../service/bilan.service';

@Component({
  standalone: true,
  templateUrl: './bilan-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BilanDeleteDialogComponent {
  bilan?: IBilan;

  constructor(
    protected bilanService: BilanService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bilanService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
