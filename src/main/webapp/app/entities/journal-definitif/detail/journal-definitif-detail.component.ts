import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IJournalDefinitif } from '../journal-definitif.model';

@Component({
  standalone: true,
  selector: 'jhi-journal-definitif-detail',
  templateUrl: './journal-definitif-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class JournalDefinitifDetailComponent {
  @Input() journalDefinitif: IJournalDefinitif | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
