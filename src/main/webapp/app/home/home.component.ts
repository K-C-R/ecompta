import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EcritureComptableComponent } from 'app/entities/ecriture-comptable/list/ecriture-comptable.component';
import { CompteComponent } from 'app/entities/compte/list/compte.component';
import { CompteService, EntityResponseType } from 'app/entities/compte/service/compte.service';
import { ICompte } from 'app/entities/compte/compte.model';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, RouterModule, AccordionModule, CardModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private modalService: NgbModal,
    private compteService: CompteService,
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listeEcritureComptable(): void {
    const modalRef = this.modalService.open(CompteComponent, { size: 'lg', backdrop: 'static' });

    // unsubscribe not needed because closed completes on modal close
    modalRef.closed;
  }
}
