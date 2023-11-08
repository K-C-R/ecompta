import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICompteDeResultat } from '../compte-de-resultat.model';
import { CompteDeResultatService } from '../service/compte-de-resultat.service';

@Component({
  standalone: true,
  templateUrl: './compte-de-resultat-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CompteDeResultatDeleteDialogComponent {
  compteDeResultat?: ICompteDeResultat;

  constructor(
    protected compteDeResultatService: CompteDeResultatService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.compteDeResultatService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
