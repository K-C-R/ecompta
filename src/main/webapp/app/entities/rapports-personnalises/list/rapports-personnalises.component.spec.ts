import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RapportsPersonnalisesService } from '../service/rapports-personnalises.service';

import { RapportsPersonnalisesComponent } from './rapports-personnalises.component';

describe('RapportsPersonnalises Management Component', () => {
  let comp: RapportsPersonnalisesComponent;
  let fixture: ComponentFixture<RapportsPersonnalisesComponent>;
  let service: RapportsPersonnalisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'rapports-personnalises', component: RapportsPersonnalisesComponent }]),
        HttpClientTestingModule,
        RapportsPersonnalisesComponent,
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
      .overrideTemplate(RapportsPersonnalisesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RapportsPersonnalisesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RapportsPersonnalisesService);

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
    expect(comp.rapportsPersonnalises?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to rapportsPersonnalisesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRapportsPersonnalisesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRapportsPersonnalisesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
