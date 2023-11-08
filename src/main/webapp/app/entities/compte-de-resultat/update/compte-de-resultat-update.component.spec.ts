import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IResultat } from 'app/entities/resultat/resultat.model';
import { ResultatService } from 'app/entities/resultat/service/resultat.service';
import { CompteDeResultatService } from '../service/compte-de-resultat.service';
import { ICompteDeResultat } from '../compte-de-resultat.model';
import { CompteDeResultatFormService } from './compte-de-resultat-form.service';

import { CompteDeResultatUpdateComponent } from './compte-de-resultat-update.component';

describe('CompteDeResultat Management Update Component', () => {
  let comp: CompteDeResultatUpdateComponent;
  let fixture: ComponentFixture<CompteDeResultatUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let compteDeResultatFormService: CompteDeResultatFormService;
  let compteDeResultatService: CompteDeResultatService;
  let resultatService: ResultatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CompteDeResultatUpdateComponent],
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
      .overrideTemplate(CompteDeResultatUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteDeResultatUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    compteDeResultatFormService = TestBed.inject(CompteDeResultatFormService);
    compteDeResultatService = TestBed.inject(CompteDeResultatService);
    resultatService = TestBed.inject(ResultatService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Resultat query and add missing value', () => {
      const compteDeResultat: ICompteDeResultat = { id: 456 };
      const resultat: IResultat = { id: 21658 };
      compteDeResultat.resultat = resultat;

      const resultatCollection: IResultat[] = [{ id: 16212 }];
      jest.spyOn(resultatService, 'query').mockReturnValue(of(new HttpResponse({ body: resultatCollection })));
      const additionalResultats = [resultat];
      const expectedCollection: IResultat[] = [...additionalResultats, ...resultatCollection];
      jest.spyOn(resultatService, 'addResultatToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ compteDeResultat });
      comp.ngOnInit();

      expect(resultatService.query).toHaveBeenCalled();
      expect(resultatService.addResultatToCollectionIfMissing).toHaveBeenCalledWith(
        resultatCollection,
        ...additionalResultats.map(expect.objectContaining),
      );
      expect(comp.resultatsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const compteDeResultat: ICompteDeResultat = { id: 456 };
      const resultat: IResultat = { id: 10440 };
      compteDeResultat.resultat = resultat;

      activatedRoute.data = of({ compteDeResultat });
      comp.ngOnInit();

      expect(comp.resultatsSharedCollection).toContain(resultat);
      expect(comp.compteDeResultat).toEqual(compteDeResultat);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteDeResultat>>();
      const compteDeResultat = { id: 123 };
      jest.spyOn(compteDeResultatFormService, 'getCompteDeResultat').mockReturnValue(compteDeResultat);
      jest.spyOn(compteDeResultatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteDeResultat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compteDeResultat }));
      saveSubject.complete();

      // THEN
      expect(compteDeResultatFormService.getCompteDeResultat).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(compteDeResultatService.update).toHaveBeenCalledWith(expect.objectContaining(compteDeResultat));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteDeResultat>>();
      const compteDeResultat = { id: 123 };
      jest.spyOn(compteDeResultatFormService, 'getCompteDeResultat').mockReturnValue({ id: null });
      jest.spyOn(compteDeResultatService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteDeResultat: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compteDeResultat }));
      saveSubject.complete();

      // THEN
      expect(compteDeResultatFormService.getCompteDeResultat).toHaveBeenCalled();
      expect(compteDeResultatService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompteDeResultat>>();
      const compteDeResultat = { id: 123 };
      jest.spyOn(compteDeResultatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compteDeResultat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(compteDeResultatService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareResultat', () => {
      it('Should forward to resultatService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(resultatService, 'compareResultat');
        comp.compareResultat(entity, entity2);
        expect(resultatService.compareResultat).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
