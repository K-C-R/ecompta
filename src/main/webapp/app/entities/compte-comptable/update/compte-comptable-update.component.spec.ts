import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompteComptableService } from '../service/compte-comptable.service';
import { ICompteComptable } from '../compte-comptable.model';
import { CompteComptableFormService } from './compte-comptable-form.service';

import { CompteComptableUpdateComponent } from './compte-comptable-update.component';

describe('CompteComptable Management Update Component', () => {
  let comp: CompteComptableUpdateComponent;
  let fixture: ComponentFixture<CompteComptableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let compteComptableFormService: CompteComptableFormService;
  let compteComptableService: CompteComptableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CompteComptableUpdateComponent],
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
      .overrideTemplate(CompteComptableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteComptableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    compteComptableFormService = TestBed.inject(CompteComptableFormService);
    compteComptableService = TestBed.inject(CompteComptableService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const compteComptable: ICompteComptable = { id: 456 };

      activatedRoute.data = of({ compteComptable });
      comp.ngOnInit();

      expect(comp.compteComptable).toEqual(compteComptable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteComptable>>();
      const compteComptable = { id: 123 };
      jest.spyOn(compteComptableFormService, 'getCompteComptable').mockReturnValue(compteComptable);
      jest.spyOn(compteComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compteComptable }));
      saveSubject.complete();

      // THEN
      expect(compteComptableFormService.getCompteComptable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(compteComptableService.update).toHaveBeenCalledWith(expect.objectContaining(compteComptable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteComptable>>();
      const compteComptable = { id: 123 };
      jest.spyOn(compteComptableFormService, 'getCompteComptable').mockReturnValue({ id: null });
      jest.spyOn(compteComptableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteComptable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compteComptable }));
      saveSubject.complete();

      // THEN
      expect(compteComptableFormService.getCompteComptable).toHaveBeenCalled();
      expect(compteComptableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteComptable>>();
      const compteComptable = { id: 123 };
      jest.spyOn(compteComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(compteComptableService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
