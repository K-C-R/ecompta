import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { EcritureComptableService } from '../service/ecriture-comptable.service';
import { IEcritureComptable } from '../ecriture-comptable.model';
import { EcritureComptableFormService } from './ecriture-comptable-form.service';

import { EcritureComptableUpdateComponent } from './ecriture-comptable-update.component';

describe('EcritureComptable Management Update Component', () => {
  let comp: EcritureComptableUpdateComponent;
  let fixture: ComponentFixture<EcritureComptableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ecritureComptableFormService: EcritureComptableFormService;
  let ecritureComptableService: EcritureComptableService;
  let compteService: CompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EcritureComptableUpdateComponent],
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
      .overrideTemplate(EcritureComptableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EcritureComptableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ecritureComptableFormService = TestBed.inject(EcritureComptableFormService);
    ecritureComptableService = TestBed.inject(EcritureComptableService);
    compteService = TestBed.inject(CompteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const ecritureComptable: IEcritureComptable = { id: 456 };
      const compte: ICompte = { id: 2018 };
      ecritureComptable.compte = compte;

      const compteCollection: ICompte[] = [{ id: 9990 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [compte];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ecritureComptable });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ecritureComptable: IEcritureComptable = { id: 456 };
      const compte: ICompte = { id: 31338 };
      ecritureComptable.compte = compte;

      activatedRoute.data = of({ ecritureComptable });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(compte);
      expect(comp.ecritureComptable).toEqual(ecritureComptable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEcritureComptable>>();
      const ecritureComptable = { id: 123 };
      jest.spyOn(ecritureComptableFormService, 'getEcritureComptable').mockReturnValue(ecritureComptable);
      jest.spyOn(ecritureComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ecritureComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ecritureComptable }));
      saveSubject.complete();

      // THEN
      expect(ecritureComptableFormService.getEcritureComptable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ecritureComptableService.update).toHaveBeenCalledWith(expect.objectContaining(ecritureComptable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEcritureComptable>>();
      const ecritureComptable = { id: 123 };
      jest.spyOn(ecritureComptableFormService, 'getEcritureComptable').mockReturnValue({ id: null });
      jest.spyOn(ecritureComptableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ecritureComptable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ecritureComptable }));
      saveSubject.complete();

      // THEN
      expect(ecritureComptableFormService.getEcritureComptable).toHaveBeenCalled();
      expect(ecritureComptableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEcritureComptable>>();
      const ecritureComptable = { id: 123 };
      jest.spyOn(ecritureComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ecritureComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ecritureComptableService.update).toHaveBeenCalled();
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
