import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SoldeComptableService } from '../service/solde-comptable.service';

import { SoldeComptableComponent } from './solde-comptable.component';

describe('SoldeComptable Management Component', () => {
  let comp: SoldeComptableComponent;
  let fixture: ComponentFixture<SoldeComptableComponent>;
  let service: SoldeComptableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'solde-comptable', component: SoldeComptableComponent }]),
        HttpClientTestingModule,
        SoldeComptableComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SoldeComptableComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SoldeComptableComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SoldeComptableService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.soldeComptables?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to soldeComptableService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSoldeComptableIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSoldeComptableIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
