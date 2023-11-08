import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IRapportsPersonnalises } from '../rapports-personnalises.model';

@Component({
  standalone: true,
  selector: 'jhi-rapports-personnalises-detail',
  templateUrl: './rapports-personnalises-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class RapportsPersonnalisesDetailComponent {
  @Input() rapportsPersonnalises: IRapportsPersonnalises | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
