import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IBalance } from 'app/entities/balance/balance.model';
import { BalanceService } from 'app/entities/balance/service/balance.service';
import { IGrandLivre } from '../grand-livre.model';
import { GrandLivreService } from '../service/grand-livre.service';
import { GrandLivreFormService } from './grand-livre-form.service';

import { GrandLivreUpdateComponent } from './grand-livre-update.component';

describe('GrandLivre Management Update Component', () => {
  let comp: GrandLivreUpdateComponent;
  let fixture: ComponentFixture<GrandLivreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grandLivreFormService: GrandLivreFormService;
  let grandLivreService: GrandLivreService;
  let compteService: CompteService;
  let balanceService: BalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), GrandLivreUpdateComponent],
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
      .overrideTemplate(GrandLivreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrandLivreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grandLivreFormService = TestBed.inject(GrandLivreFormService);
    grandLivreService = TestBed.inject(GrandLivreService);
    compteService = TestBed.inject(CompteService);
    balanceService = TestBed.inject(BalanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const grandLivre: IGrandLivre = { id: 456 };
      const compte: ICompte = { id: 6964 };
      grandLivre.compte = compte;

      const compteCollection: ICompte[] = [{ id: 17079 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [compte];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ grandLivre });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Balance query and add missing value', () => {
      const grandLivre: IGrandLivre = { id: 456 };
      const balance: IBalance = { id: 17035 };
      grandLivre.balance = balance;

      const balanceCollection: IBalance[] = [{ id: 11168 }];
      jest.spyOn(balanceService, 'query').mockReturnValue(of(new HttpResponse({ body: balanceCollection })));
      const additionalBalances = [balance];
      const expectedCollection: IBalance[] = [...additionalBalances, ...balanceCollection];
      jest.spyOn(balanceService, 'addBalanceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ grandLivre });
      comp.ngOnInit();

      expect(balanceService.query).toHaveBeenCalled();
      expect(balanceService.addBalanceToCollectionIfMissing).toHaveBeenCalledWith(
        balanceCollection,
        ...additionalBalances.map(expect.objectContaining),
      );
      expect(comp.balancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const grandLivre: IGrandLivre = { id: 456 };
      const compte: ICompte = { id: 9389 };
      grandLivre.compte = compte;
      const balance: IBalance = { id: 32081 };
      grandLivre.balance = balance;

      activatedRoute.data = of({ grandLivre });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(compte);
      expect(comp.balancesSharedCollection).toContain(balance);
      expect(comp.grandLivre).toEqual(grandLivre);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrandLivre>>();
      const grandLivre = { id: 123 };
      jest.spyOn(grandLivreFormService, 'getGrandLivre').mockReturnValue(grandLivre);
      jest.spyOn(grandLivreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grandLivre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grandLivre }));
      saveSubject.complete();

      // THEN
      expect(grandLivreFormService.getGrandLivre).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(grandLivreService.update).toHaveBeenCalledWith(expect.objectContaining(grandLivre));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrandLivre>>();
      const grandLivre = { id: 123 };
      jest.spyOn(grandLivreFormService, 'getGrandLivre').mockReturnValue({ id: null });
      jest.spyOn(grandLivreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grandLivre: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grandLivre }));
      saveSubject.complete();

      // THEN
      expect(grandLivreFormService.getGrandLivre).toHaveBeenCalled();
      expect(grandLivreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrandLivre>>();
      const grandLivre = { id: 123 };
      jest.spyOn(grandLivreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grandLivre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grandLivreService.update).toHaveBeenCalled();
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

    describe('compareBalance', () => {
      it('Should forward to balanceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(balanceService, 'compareBalance');
        comp.compareBalance(entity, entity2);
        expect(balanceService.compareBalance).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
