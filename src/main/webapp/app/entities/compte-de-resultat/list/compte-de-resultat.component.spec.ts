import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompteDeResultatService } from '../service/compte-de-resultat.service';

import { CompteDeResultatComponent } from './compte-de-resultat.component';

describe('CompteDeResultat Management Component', () => {
  let comp: CompteDeResultatComponent;
  let fixture: ComponentFixture<CompteDeResultatComponent>;
  let service: CompteDeResultatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'compte-de-resultat', component: CompteDeResultatComponent }]),
        HttpClientTestingModule,
        CompteDeResultatComponent,
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
      .overrideTemplate(CompteDeResultatComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteDeResultatComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompteDeResultatService);

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
    expect(comp.compteDeResultats?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to compteDeResultatService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompteDeResultatIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompteDeResultatIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
