import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRapportsPersonnalises } from '../rapports-personnalises.model';
import { RapportsPersonnalisesService } from '../service/rapports-personnalises.service';

@Component({
  standalone: true,
  templateUrl: './rapports-personnalises-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RapportsPersonnalisesDeleteDialogComponent {
  rapportsPersonnalises?: IRapportsPersonnalises;

  constructor(
    protected rapportsPersonnalisesService: RapportsPersonnalisesService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rapportsPersonnalisesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
