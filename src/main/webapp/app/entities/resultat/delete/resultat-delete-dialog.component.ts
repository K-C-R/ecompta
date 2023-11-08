import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IResultat } from '../resultat.model';
import { ResultatService } from '../service/resultat.service';

@Component({
  standalone: true,
  templateUrl: './resultat-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ResultatDeleteDialogComponent {
  resultat?: IResultat;

  constructor(
    protected resultatService: ResultatService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resultatService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
