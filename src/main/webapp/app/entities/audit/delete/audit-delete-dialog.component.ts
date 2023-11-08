import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAudit } from '../audit.model';
import { AuditService } from '../service/audit.service';

@Component({
  standalone: true,
  templateUrl: './audit-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AuditDeleteDialogComponent {
  audit?: IAudit;

  constructor(
    protected auditService: AuditService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.auditService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
