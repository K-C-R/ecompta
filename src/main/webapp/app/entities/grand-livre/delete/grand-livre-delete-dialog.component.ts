import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGrandLivre } from '../grand-livre.model';
import { GrandLivreService } from '../service/grand-livre.service';

@Component({
  standalone: true,
  templateUrl: './grand-livre-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GrandLivreDeleteDialogComponent {
  grandLivre?: IGrandLivre;

  constructor(
    protected grandLivreService: GrandLivreService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grandLivreService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
