import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IBilan } from 'app/entities/bilan/bilan.model';
import { BilanService } from 'app/entities/bilan/service/bilan.service';
import { CompteService } from '../service/compte.service';
import { ICompte } from '../compte.model';
import { CompteFormService } from './compte-form.service';

import { CompteUpdateComponent } from './compte-update.component';

describe('Compte Management Update Component', () => {
  let comp: CompteUpdateComponent;
  let fixture: ComponentFixture<CompteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let compteFormService: CompteFormService;
  let compteService: CompteService;
  let bilanService: BilanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CompteUpdateComponent],
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
      .overrideTemplate(CompteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    compteFormService = TestBed.inject(CompteFormService);
    compteService = TestBed.inject(CompteService);
    bilanService = TestBed.inject(BilanService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Bilan query and add missing value', () => {
      const compte: ICompte = { id: 456 };
      const bilan: IBilan = { id: 22377 };
      compte.bilan = bilan;

      const bilanCollection: IBilan[] = [{ id: 7912 }];
      jest.spyOn(bilanService, 'query').mockReturnValue(of(new HttpResponse({ body: bilanCollection })));
      const additionalBilans = [bilan];
      const expectedCollection: IBilan[] = [...additionalBilans, ...bilanCollection];
      jest.spyOn(bilanService, 'addBilanToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      expect(bilanService.query).toHaveBeenCalled();
      expect(bilanService.addBilanToCollectionIfMissing).toHaveBeenCalledWith(
        bilanCollection,
        ...additionalBilans.map(expect.objectContaining),
      );
      expect(comp.bilansSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const compte: ICompte = { id: 456 };
      const bilan: IBilan = { id: 4005 };
      compte.bilan = bilan;

      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      expect(comp.bilansSharedCollection).toContain(bilan);
      expect(comp.compte).toEqual(compte);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompte>>();
      const compte = { id: 123 };
      jest.spyOn(compteFormService, 'getCompte').mockReturnValue(compte);
      jest.spyOn(compteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compte }));
      saveSubject.complete();

      // THEN
      expect(compteFormService.getCompte).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(compteService.update).toHaveBeenCalledWith(expect.objectContaining(compte));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompte>>();
      const compte = { id: 123 };
      jest.spyOn(compteFormService, 'getCompte').mockReturnValue({ id: null });
      jest.spyOn(compteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compte: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compte }));
      saveSubject.complete();

      // THEN
      expect(compteFormService.getCompte).toHaveBeenCalled();
      expect(compteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompte>>();
      const compte = { id: 123 };
      jest.spyOn(compteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(compteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBilan', () => {
      it('Should forward to bilanService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bilanService, 'compareBilan');
        comp.compareBilan(entity, entity2);
        expect(bilanService.compareBilan).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
