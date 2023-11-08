import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IClassComptable } from '../class-comptable.model';
import { ClassComptableService } from '../service/class-comptable.service';

@Component({
  standalone: true,
  templateUrl: './class-comptable-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClassComptableDeleteDialogComponent {
  classComptable?: IClassComptable;

  constructor(
    protected classComptableService: ClassComptableService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.classComptableService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
