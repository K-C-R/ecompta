import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PieceComptableService } from '../service/piece-comptable.service';

import { PieceComptableComponent } from './piece-comptable.component';

describe('PieceComptable Management Component', () => {
  let comp: PieceComptableComponent;
  let fixture: ComponentFixture<PieceComptableComponent>;
  let service: PieceComptableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'piece-comptable', component: PieceComptableComponent }]),
        HttpClientTestingModule,
        PieceComptableComponent,
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
      .overrideTemplate(PieceComptableComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PieceComptableComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PieceComptableService);

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
    expect(comp.pieceComptables?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pieceComptableService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPieceComptableIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPieceComptableIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
