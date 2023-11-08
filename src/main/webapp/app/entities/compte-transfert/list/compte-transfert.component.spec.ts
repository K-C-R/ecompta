import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompteTransfertService } from '../service/compte-transfert.service';

import { CompteTransfertComponent } from './compte-transfert.component';

describe('CompteTransfert Management Component', () => {
  let comp: CompteTransfertComponent;
  let fixture: ComponentFixture<CompteTransfertComponent>;
  let service: CompteTransfertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'compte-transfert', component: CompteTransfertComponent }]),
        HttpClientTestingModule,
        CompteTransfertComponent,
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
      .overrideTemplate(CompteTransfertComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteTransfertComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompteTransfertService);

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
    expect(comp.compteTransferts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to compteTransfertService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompteTransfertIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompteTransfertIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
