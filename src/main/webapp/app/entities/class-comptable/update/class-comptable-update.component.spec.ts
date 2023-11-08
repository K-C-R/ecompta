import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { ClassComptableService } from '../service/class-comptable.service';
import { IClassComptable } from '../class-comptable.model';
import { ClassComptableFormService } from './class-comptable-form.service';

import { ClassComptableUpdateComponent } from './class-comptable-update.component';

describe('ClassComptable Management Update Component', () => {
  let comp: ClassComptableUpdateComponent;
  let fixture: ComponentFixture<ClassComptableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let classComptableFormService: ClassComptableFormService;
  let classComptableService: ClassComptableService;
  let compteService: CompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ClassComptableUpdateComponent],
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
      .overrideTemplate(ClassComptableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClassComptableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    classComptableFormService = TestBed.inject(ClassComptableFormService);
    classComptableService = TestBed.inject(ClassComptableService);
    compteService = TestBed.inject(CompteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const classComptable: IClassComptable = { id: 456 };
      const compte: ICompte = { id: 18025 };
      classComptable.compte = compte;

      const compteCollection: ICompte[] = [{ id: 4399 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [compte];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ classComptable });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const classComptable: IClassComptable = { id: 456 };
      const compte: ICompte = { id: 24527 };
      classComptable.compte = compte;

      activatedRoute.data = of({ classComptable });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(compte);
      expect(comp.classComptable).toEqual(classComptable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClassComptable>>();
      const classComptable = { id: 123 };
      jest.spyOn(classComptableFormService, 'getClassComptable').mockReturnValue(classComptable);
      jest.spyOn(classComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classComptable }));
      saveSubject.complete();

      // THEN
      expect(classComptableFormService.getClassComptable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(classComptableService.update).toHaveBeenCalledWith(expect.objectContaining(classComptable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClassComptable>>();
      const classComptable = { id: 123 };
      jest.spyOn(classComptableFormService, 'getClassComptable').mockReturnValue({ id: null });
      jest.spyOn(classComptableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classComptable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classComptable }));
      saveSubject.complete();

      // THEN
      expect(classComptableFormService.getClassComptable).toHaveBeenCalled();
      expect(classComptableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClassComptable>>();
      const classComptable = { id: 123 };
      jest.spyOn(classComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(classComptableService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCompte', () => {
      it('Should forward to compteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(compteService, 'compareCompte');
        comp.compareCompte(entity, entity2);
        expect(compteService.compareCompte).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
