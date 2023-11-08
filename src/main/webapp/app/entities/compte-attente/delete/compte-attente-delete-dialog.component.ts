import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICompteAttente } from '../compte-attente.model';
import { CompteAttenteService } from '../service/compte-attente.service';

@Component({
  standalone: true,
  templateUrl: './compte-attente-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CompteAttenteDeleteDialogComponent {
  compteAttente?: ICompteAttente;

  constructor(
    protected compteAttenteService: CompteAttenteService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.compteAttenteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
