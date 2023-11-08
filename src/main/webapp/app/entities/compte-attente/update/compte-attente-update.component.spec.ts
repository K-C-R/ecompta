import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { CompteAttenteService } from '../service/compte-attente.service';
import { ICompteAttente } from '../compte-attente.model';
import { CompteAttenteFormService } from './compte-attente-form.service';

import { CompteAttenteUpdateComponent } from './compte-attente-update.component';

describe('CompteAttente Management Update Component', () => {
  let comp: CompteAttenteUpdateComponent;
  let fixture: ComponentFixture<CompteAttenteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let compteAttenteFormService: CompteAttenteFormService;
  let compteAttenteService: CompteAttenteService;
  let compteService: CompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CompteAttenteUpdateComponent],
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
      .overrideTemplate(CompteAttenteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteAttenteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    compteAttenteFormService = TestBed.inject(CompteAttenteFormService);
    compteAttenteService = TestBed.inject(CompteAttenteService);
    compteService = TestBed.inject(CompteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const compteAttente: ICompteAttente = { id: 456 };
      const compte: ICompte = { id: 31870 };
      compteAttente.compte = compte;

      const compteCollection: ICompte[] = [{ id: 19007 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [compte];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ compteAttente });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const compteAttente: ICompteAttente = { id: 456 };
      const compte: ICompte = { id: 26540 };
      compteAttente.compte = compte;

      activatedRoute.data = of({ compteAttente });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(compte);
      expect(comp.compteAttente).toEqual(compteAttente);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteAttente>>();
      const compteAttente = { id: 123 };
      jest.spyOn(compteAttenteFormService, 'getCompteAttente').mockReturnValue(compteAttente);
      jest.spyOn(compteAttenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteAttente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compteAttente }));
      saveSubject.complete();

      // THEN
      expect(compteAttenteFormService.getCompteAttente).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(compteAttenteService.update).toHaveBeenCalledWith(expect.objectContaining(compteAttente));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteAttente>>();
      const compteAttente = { id: 123 };
      jest.spyOn(compteAttenteFormService, 'getCompteAttente').mockReturnValue({ id: null });
      jest.spyOn(compteAttenteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteAttente: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compteAttente }));
      saveSubject.complete();

      // THEN
      expect(compteAttenteFormService.getCompteAttente).toHaveBeenCalled();
      expect(compteAttenteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteAttente>>();
      const compteAttente = { id: 123 };
      jest.spyOn(compteAttenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteAttente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(compteAttenteService.update).toHaveBeenCalled();
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
