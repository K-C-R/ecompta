import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompteAttenteService } from '../service/compte-attente.service';

import { CompteAttenteComponent } from './compte-attente.component';

describe('CompteAttente Management Component', () => {
  let comp: CompteAttenteComponent;
  let fixture: ComponentFixture<CompteAttenteComponent>;
  let service: CompteAttenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'compte-attente', component: CompteAttenteComponent }]),
        HttpClientTestingModule,
        CompteAttenteComponent,
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
      .overrideTemplate(CompteAttenteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteAttenteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompteAttenteService);

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
    expect(comp.compteAttentes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to compteAttenteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompteAttenteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompteAttenteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
