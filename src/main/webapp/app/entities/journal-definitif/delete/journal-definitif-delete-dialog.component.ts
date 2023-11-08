import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJournalDefinitif } from '../journal-definitif.model';
import { JournalDefinitifService } from '../service/journal-definitif.service';

@Component({
  standalone: true,
  templateUrl: './journal-definitif-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JournalDefinitifDeleteDialogComponent {
  journalDefinitif?: IJournalDefinitif;

  constructor(
    protected journalDefinitifService: JournalDefinitifService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.journalDefinitifService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
