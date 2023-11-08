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
import { IJournalDefinitif } from '../journal-definitif.model';
import { JournalDefinitifService } from '../service/journal-definitif.service';
import { JournalDefinitifFormService } from './journal-definitif-form.service';

import { JournalDefinitifUpdateComponent } from './journal-definitif-update.component';

describe('JournalDefinitif Management Update Component', () => {
  let comp: JournalDefinitifUpdateComponent;
  let fixture: ComponentFixture<JournalDefinitifUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let journalDefinitifFormService: JournalDefinitifFormService;
  let journalDefinitifService: JournalDefinitifService;
  let compteService: CompteService;
  let balanceService: BalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), JournalDefinitifUpdateComponent],
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
      .overrideTemplate(JournalDefinitifUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JournalDefinitifUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    journalDefinitifFormService = TestBed.inject(JournalDefinitifFormService);
    journalDefinitifService = TestBed.inject(JournalDefinitifService);
    compteService = TestBed.inject(CompteService);
    balanceService = TestBed.inject(BalanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const journalDefinitif: IJournalDefinitif = { id: 456 };
      const compte: ICompte = { id: 24171 };
      journalDefinitif.compte = compte;

      const compteCollection: ICompte[] = [{ id: 28087 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [compte];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ journalDefinitif });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Balance query and add missing value', () => {
      const journalDefinitif: IJournalDefinitif = { id: 456 };
      const balance: IBalance = { id: 15571 };
      journalDefinitif.balance = balance;

      const balanceCollection: IBalance[] = [{ id: 13544 }];
      jest.spyOn(balanceService, 'query').mockReturnValue(of(new HttpResponse({ body: balanceCollection })));
      const additionalBalances = [balance];
      const expectedCollection: IBalance[] = [...additionalBalances, ...balanceCollection];
      jest.spyOn(balanceService, 'addBalanceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ journalDefinitif });
      comp.ngOnInit();

      expect(balanceService.query).toHaveBeenCalled();
      expect(balanceService.addBalanceToCollectionIfMissing).toHaveBeenCalledWith(
        balanceCollection,
        ...additionalBalances.map(expect.objectContaining),
      );
      expect(comp.balancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const journalDefinitif: IJournalDefinitif = { id: 456 };
      const compte: ICompte = { id: 6346 };
      journalDefinitif.compte = compte;
      const balance: IBalance = { id: 13841 };
      journalDefinitif.balance = balance;

      activatedRoute.data = of({ journalDefinitif });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(compte);
      expect(comp.balancesSharedCollection).toContain(balance);
      expect(comp.journalDefinitif).toEqual(journalDefinitif);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJournalDefinitif>>();
      const journalDefinitif = { id: 123 };
      jest.spyOn(journalDefinitifFormService, 'getJournalDefinitif').mockReturnValue(journalDefinitif);
      jest.spyOn(journalDefinitifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ journalDefinitif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: journalDefinitif }));
      saveSubject.complete();

      // THEN
      expect(journalDefinitifFormService.getJournalDefinitif).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(journalDefinitifService.update).toHaveBeenCalledWith(expect.objectContaining(journalDefinitif));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJournalDefinitif>>();
      const journalDefinitif = { id: 123 };
      jest.spyOn(journalDefinitifFormService, 'getJournalDefinitif').mockReturnValue({ id: null });
      jest.spyOn(journalDefinitifService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ journalDefinitif: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: journalDefinitif }));
      saveSubject.complete();

      // THEN
      expect(journalDefinitifFormService.getJournalDefinitif).toHaveBeenCalled();
      expect(journalDefinitifService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJournalDefinitif>>();
      const journalDefinitif = { id: 123 };
      jest.spyOn(journalDefinitifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ journalDefinitif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(journalDefinitifService.update).toHaveBeenCalled();
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
