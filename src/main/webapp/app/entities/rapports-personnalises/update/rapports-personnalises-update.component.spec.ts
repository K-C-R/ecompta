import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RapportsPersonnalisesService } from '../service/rapports-personnalises.service';
import { IRapportsPersonnalises } from '../rapports-personnalises.model';
import { RapportsPersonnalisesFormService } from './rapports-personnalises-form.service';

import { RapportsPersonnalisesUpdateComponent } from './rapports-personnalises-update.component';

describe('RapportsPersonnalises Management Update Component', () => {
  let comp: RapportsPersonnalisesUpdateComponent;
  let fixture: ComponentFixture<RapportsPersonnalisesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rapportsPersonnalisesFormService: RapportsPersonnalisesFormService;
  let rapportsPersonnalisesService: RapportsPersonnalisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), RapportsPersonnalisesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RapportsPersonnalisesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RapportsPersonnalisesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rapportsPersonnalisesFormService = TestBed.inject(RapportsPersonnalisesFormService);
    rapportsPersonnalisesService = TestBed.inject(RapportsPersonnalisesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const rapportsPersonnalises: IRapportsPersonnalises = { id: 456 };

      activatedRoute.data = of({ rapportsPersonnalises });
      comp.ngOnInit();

      expect(comp.rapportsPersonnalises).toEqual(rapportsPersonnalises);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRapportsPersonnalises>>();
      const rapportsPersonnalises = { id: 123 };
      jest.spyOn(rapportsPersonnalisesFormService, 'getRapportsPersonnalises').mockReturnValue(rapportsPersonnalises);
      jest.spyOn(rapportsPersonnalisesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rapportsPersonnalises });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rapportsPersonnalises }));
      saveSubject.complete();

      // THEN
      expect(rapportsPersonnalisesFormService.getRapportsPersonnalises).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rapportsPersonnalisesService.update).toHaveBeenCalledWith(expect.objectContaining(rapportsPersonnalises));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRapportsPersonnalises>>();
      const rapportsPersonnalises = { id: 123 };
      jest.spyOn(rapportsPersonnalisesFormService, 'getRapportsPersonnalises').mockReturnValue({ id: null });
      jest.spyOn(rapportsPersonnalisesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rapportsPersonnalises: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rapportsPersonnalises }));
      saveSubject.complete();

      // THEN
      expect(rapportsPersonnalisesFormService.getRapportsPersonnalises).toHaveBeenCalled();
      expect(rapportsPersonnalisesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRapportsPersonnalises>>();
      const rapportsPersonnalises = { id: 123 };
      jest.spyOn(rapportsPersonnalisesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rapportsPersonnalises });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rapportsPersonnalisesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
