import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BilanService } from '../service/bilan.service';
import { IBilan } from '../bilan.model';
import { BilanFormService } from './bilan-form.service';

import { BilanUpdateComponent } from './bilan-update.component';

describe('Bilan Management Update Component', () => {
  let comp: BilanUpdateComponent;
  let fixture: ComponentFixture<BilanUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bilanFormService: BilanFormService;
  let bilanService: BilanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BilanUpdateComponent],
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
      .overrideTemplate(BilanUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BilanUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bilanFormService = TestBed.inject(BilanFormService);
    bilanService = TestBed.inject(BilanService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bilan: IBilan = { id: 456 };

      activatedRoute.data = of({ bilan });
      comp.ngOnInit();

      expect(comp.bilan).toEqual(bilan);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBilan>>();
      const bilan = { id: 123 };
      jest.spyOn(bilanFormService, 'getBilan').mockReturnValue(bilan);
      jest.spyOn(bilanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bilan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bilan }));
      saveSubject.complete();

      // THEN
      expect(bilanFormService.getBilan).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bilanService.update).toHaveBeenCalledWith(expect.objectContaining(bilan));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBilan>>();
      const bilan = { id: 123 };
      jest.spyOn(bilanFormService, 'getBilan').mockReturnValue({ id: null });
      jest.spyOn(bilanService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bilan: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bilan }));
      saveSubject.complete();

      // THEN
      expect(bilanFormService.getBilan).toHaveBeenCalled();
      expect(bilanService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBilan>>();
      const bilan = { id: 123 };
      jest.spyOn(bilanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bilan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bilanService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
