import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { CompteTransfertService } from '../service/compte-transfert.service';
import { ICompteTransfert } from '../compte-transfert.model';
import { CompteTransfertFormService } from './compte-transfert-form.service';

import { CompteTransfertUpdateComponent } from './compte-transfert-update.component';

describe('CompteTransfert Management Update Component', () => {
  let comp: CompteTransfertUpdateComponent;
  let fixture: ComponentFixture<CompteTransfertUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let compteTransfertFormService: CompteTransfertFormService;
  let compteTransfertService: CompteTransfertService;
  let compteService: CompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CompteTransfertUpdateComponent],
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
      .overrideTemplate(CompteTransfertUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteTransfertUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    compteTransfertFormService = TestBed.inject(CompteTransfertFormService);
    compteTransfertService = TestBed.inject(CompteTransfertService);
    compteService = TestBed.inject(CompteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const compteTransfert: ICompteTransfert = { id: 456 };
      const compte: ICompte = { id: 3490 };
      compteTransfert.compte = compte;

      const compteCollection: ICompte[] = [{ id: 19585 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [compte];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ compteTransfert });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const compteTransfert: ICompteTransfert = { id: 456 };
      const compte: ICompte = { id: 15770 };
      compteTransfert.compte = compte;

      activatedRoute.data = of({ compteTransfert });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(compte);
      expect(comp.compteTransfert).toEqual(compteTransfert);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteTransfert>>();
      const compteTransfert = { id: 123 };
      jest.spyOn(compteTransfertFormService, 'getCompteTransfert').mockReturnValue(compteTransfert);
      jest.spyOn(compteTransfertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteTransfert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compteTransfert }));
      saveSubject.complete();

      // THEN
      expect(compteTransfertFormService.getCompteTransfert).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(compteTransfertService.update).toHaveBeenCalledWith(expect.objectContaining(compteTransfert));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteTransfert>>();
      const compteTransfert = { id: 123 };
      jest.spyOn(compteTransfertFormService, 'getCompteTransfert').mockReturnValue({ id: null });
      jest.spyOn(compteTransfertService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteTransfert: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compteTransfert }));
      saveSubject.complete();

      // THEN
      expect(compteTransfertFormService.getCompteTransfert).toHaveBeenCalled();
      expect(compteTransfertService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteTransfert>>();
      const compteTransfert = { id: 123 };
      jest.spyOn(compteTransfertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteTransfert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(compteTransfertService.update).toHaveBeenCalled();
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
