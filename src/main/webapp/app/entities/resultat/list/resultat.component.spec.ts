import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResultatService } from '../service/resultat.service';

import { ResultatComponent } from './resultat.component';

describe('Resultat Management Component', () => {
  let comp: ResultatComponent;
  let fixture: ComponentFixture<ResultatComponent>;
  let service: ResultatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'resultat', component: ResultatComponent }]),
        HttpClientTestingModule,
        ResultatComponent,
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
      .overrideTemplate(ResultatComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResultatComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ResultatService);

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
    expect(comp.resultats?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to resultatService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getResultatIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getResultatIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
