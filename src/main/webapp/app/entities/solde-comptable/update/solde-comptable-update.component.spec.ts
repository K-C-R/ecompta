import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { SoldeComptableService } from '../service/solde-comptable.service';
import { ISoldeComptable } from '../solde-comptable.model';
import { SoldeComptableFormService } from './solde-comptable-form.service';

import { SoldeComptableUpdateComponent } from './solde-comptable-update.component';

describe('SoldeComptable Management Update Component', () => {
  let comp: SoldeComptableUpdateComponent;
  let fixture: ComponentFixture<SoldeComptableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let soldeComptableFormService: SoldeComptableFormService;
  let soldeComptableService: SoldeComptableService;
  let compteService: CompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SoldeComptableUpdateComponent],
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
      .overrideTemplate(SoldeComptableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SoldeComptableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    soldeComptableFormService = TestBed.inject(SoldeComptableFormService);
    soldeComptableService = TestBed.inject(SoldeComptableService);
    compteService = TestBed.inject(CompteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const soldeComptable: ISoldeComptable = { id: 456 };
      const compte: ICompte = { id: 9784 };
      soldeComptable.compte = compte;

      const compteCollection: ICompte[] = [{ id: 7689 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [compte];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ soldeComptable });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const soldeComptable: ISoldeComptable = { id: 456 };
      const compte: ICompte = { id: 22299 };
      soldeComptable.compte = compte;

      activatedRoute.data = of({ soldeComptable });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(compte);
      expect(comp.soldeComptable).toEqual(soldeComptable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoldeComptable>>();
      const soldeComptable = { id: 123 };
      jest.spyOn(soldeComptableFormService, 'getSoldeComptable').mockReturnValue(soldeComptable);
      jest.spyOn(soldeComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soldeComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: soldeComptable }));
      saveSubject.complete();

      // THEN
      expect(soldeComptableFormService.getSoldeComptable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(soldeComptableService.update).toHaveBeenCalledWith(expect.objectContaining(soldeComptable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoldeComptable>>();
      const soldeComptable = { id: 123 };
      jest.spyOn(soldeComptableFormService, 'getSoldeComptable').mockReturnValue({ id: null });
      jest.spyOn(soldeComptableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soldeComptable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: soldeComptable }));
      saveSubject.complete();

      // THEN
      expect(soldeComptableFormService.getSoldeComptable).toHaveBeenCalled();
      expect(soldeComptableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoldeComptable>>();
      const soldeComptable = { id: 123 };
      jest.spyOn(soldeComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soldeComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(soldeComptableService.update).toHaveBeenCalled();
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
