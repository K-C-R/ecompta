/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { SortService } from 'app/shared/sort/sort.service';
import { ICompte } from '../compte.model';
import { EntityArrayResponseType, CompteService, EntityResponseType } from '../service/compte.service';
import { CompteDeleteDialogComponent } from '../delete/compte-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-compte',
  templateUrl: './compte.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class CompteComponent implements OnInit {
  comptes?: ICompte[];
  compte?: ICompte;
  isLoading = false;
  routeActuelle: string | undefined;
  checked?: boolean;

  predicate = 'id';
  ascending = true;

  constructor(
    protected compteService: CompteService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected activeModal: NgbActiveModal,
  ) {}

  trackId = (_index: number, item: ICompte): number => this.compteService.getCompteIdentifier(item);

  ngOnInit(): void {
    this.routeActuelle = this.actuelle();
    if (this.routeActuelle !== '/compte') {
      this.list();
      console.log('---------routeActuelle--------------', this.routeActuelle);
    } else {
      this.load();
      console.log('---------load()--------------', this.routeActuelle);
    }
  }

  delete(compte: ICompte): void {
    const modalRef = this.modalService.open(CompteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.compte = compte;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  list(): void {
    this.isLoading = true;
    this.compteService.query().subscribe({
      next: res => {
        this.comptes = res.body ?? res.body!;
        console.log('=-------------this.comptes---------------', this.comptes);
      },
      error(res) {
        console.error(res);
      },
    });

    this.isLoading = false;
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.comptes = this.refineData(dataFromBody);
  }

  protected refineData(data: ICompte[]): ICompte[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ICompte[] | null): ICompte[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.compteService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  protected actuelle(): string {
    const routeActuelle = this.router.url;
    return routeActuelle;
  }

  protected cloture(compte: ICompte, bool: boolean): ICompte[] {
    this.isLoading = true;
    this.checked = false;

    if (bool) {
      compte.cloture = bool;
      console.log('------------false-----------------', compte);
    } else {
      compte.cloture = bool;
      console.log('------------true-----------------', compte);
    }

    this.compteService.update(compte).subscribe({
      next: res => {
        this.compte = res.body ?? res.body!;
        this.list();
      },
      error(err) {
        console.error(err);
      },
    });

    this.isLoading = false;
    return this.comptes!;
  }
  protected cancel(): void {
    this.activeModal.dismiss();
  }
}
