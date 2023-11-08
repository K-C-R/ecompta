import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { ITransaction } from 'app/entities/transaction/transaction.model';
import { TransactionService } from 'app/entities/transaction/service/transaction.service';
import { IPieceComptable } from '../piece-comptable.model';
import { PieceComptableService } from '../service/piece-comptable.service';
import { PieceComptableFormService } from './piece-comptable-form.service';

import { PieceComptableUpdateComponent } from './piece-comptable-update.component';

describe('PieceComptable Management Update Component', () => {
  let comp: PieceComptableUpdateComponent;
  let fixture: ComponentFixture<PieceComptableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pieceComptableFormService: PieceComptableFormService;
  let pieceComptableService: PieceComptableService;
  let compteService: CompteService;
  let transactionService: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PieceComptableUpdateComponent],
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
      .overrideTemplate(PieceComptableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PieceComptableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pieceComptableFormService = TestBed.inject(PieceComptableFormService);
    pieceComptableService = TestBed.inject(PieceComptableService);
    compteService = TestBed.inject(CompteService);
    transactionService = TestBed.inject(TransactionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const pieceComptable: IPieceComptable = { id: 456 };
      const comptes: ICompte[] = [{ id: 19420 }];
      pieceComptable.comptes = comptes;

      const compteCollection: ICompte[] = [{ id: 20061 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [...comptes];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pieceComptable });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Transaction query and add missing value', () => {
      const pieceComptable: IPieceComptable = { id: 456 };
      const transactions: ITransaction[] = [{ id: 18335 }];
      pieceComptable.transactions = transactions;

      const transactionCollection: ITransaction[] = [{ id: 20989 }];
      jest.spyOn(transactionService, 'query').mockReturnValue(of(new HttpResponse({ body: transactionCollection })));
      const additionalTransactions = [...transactions];
      const expectedCollection: ITransaction[] = [...additionalTransactions, ...transactionCollection];
      jest.spyOn(transactionService, 'addTransactionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pieceComptable });
      comp.ngOnInit();

      expect(transactionService.query).toHaveBeenCalled();
      expect(transactionService.addTransactionToCollectionIfMissing).toHaveBeenCalledWith(
        transactionCollection,
        ...additionalTransactions.map(expect.objectContaining),
      );
      expect(comp.transactionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pieceComptable: IPieceComptable = { id: 456 };
      const comptes: ICompte = { id: 11123 };
      pieceComptable.comptes = [comptes];
      const transactions: ITransaction = { id: 19338 };
      pieceComptable.transactions = [transactions];

      activatedRoute.data = of({ pieceComptable });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(comptes);
      expect(comp.transactionsSharedCollection).toContain(transactions);
      expect(comp.pieceComptable).toEqual(pieceComptable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPieceComptable>>();
      const pieceComptable = { id: 123 };
      jest.spyOn(pieceComptableFormService, 'getPieceComptable').mockReturnValue(pieceComptable);
      jest.spyOn(pieceComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pieceComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pieceComptable }));
      saveSubject.complete();

      // THEN
      expect(pieceComptableFormService.getPieceComptable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pieceComptableService.update).toHaveBeenCalledWith(expect.objectContaining(pieceComptable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPieceComptable>>();
      const pieceComptable = { id: 123 };
      jest.spyOn(pieceComptableFormService, 'getPieceComptable').mockReturnValue({ id: null });
      jest.spyOn(pieceComptableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pieceComptable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pieceComptable }));
      saveSubject.complete();

      // THEN
      expect(pieceComptableFormService.getPieceComptable).toHaveBeenCalled();
      expect(pieceComptableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPieceComptable>>();
      const pieceComptable = { id: 123 };
      jest.spyOn(pieceComptableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pieceComptable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pieceComptableService.update).toHaveBeenCalled();
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

    describe('compareTransaction', () => {
      it('Should forward to transactionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(transactionService, 'compareTransaction');
        comp.compareTransaction(entity, entity2);
        expect(transactionService.compareTransaction).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
