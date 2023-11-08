import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BalanceService } from '../service/balance.service';
import { IBalance } from '../balance.model';
import { BalanceFormService } from './balance-form.service';

import { BalanceUpdateComponent } from './balance-update.component';

describe('Balance Management Update Component', () => {
  let comp: BalanceUpdateComponent;
  let fixture: ComponentFixture<BalanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let balanceFormService: BalanceFormService;
  let balanceService: BalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BalanceUpdateComponent],
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
      .overrideTemplate(BalanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BalanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    balanceFormService = TestBed.inject(BalanceFormService);
    balanceService = TestBed.inject(BalanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const balance: IBalance = { id: 456 };

      activatedRoute.data = of({ balance });
      comp.ngOnInit();

      expect(comp.balance).toEqual(balance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBalance>>();
      const balance = { id: 123 };
      jest.spyOn(balanceFormService, 'getBalance').mockReturnValue(balance);
      jest.spyOn(balanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ balance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: balance }));
      saveSubject.complete();

      // THEN
      expect(balanceFormService.getBalance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(balanceService.update).toHaveBeenCalledWith(expect.objectContaining(balance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBalance>>();
      const balance = { id: 123 };
      jest.spyOn(balanceFormService, 'getBalance').mockReturnValue({ id: null });
      jest.spyOn(balanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ balance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: balance }));
      saveSubject.complete();

      // THEN
      expect(balanceFormService.getBalance).toHaveBeenCalled();
      expect(balanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBalance>>();
      const balance = { id: 123 };
      jest.spyOn(balanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ balance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(balanceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
