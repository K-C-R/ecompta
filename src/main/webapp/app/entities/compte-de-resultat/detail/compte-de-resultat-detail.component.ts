import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICompteDeResultat } from '../compte-de-resultat.model';

@Component({
  standalone: true,
  selector: 'jhi-compte-de-resultat-detail',
  templateUrl: './compte-de-resultat-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CompteDeResultatDetailComponent {
  @Input() compteDeResultat: ICompteDeResultat | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
