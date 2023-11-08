import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../balance.test-samples';

import { BalanceFormService } from './balance-form.service';

describe('Balance Form Service', () => {
  let service: BalanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalanceFormService);
  });

  describe('Service methods', () => {
    describe('createBalanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBalanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            totalsActifs: expect.any(Object),
            totalPassifs: expect.any(Object),
          }),
        );
      });

      it('passing IBalance should create a new form with FormGroup', () => {
        const formGroup = service.createBalanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            totalsActifs: expect.any(Object),
            totalPassifs: expect.any(Object),
          }),
        );
      });
    });

    describe('getBalance', () => {
      it('should return NewBalance for default Balance initial value', () => {
        const formGroup = service.createBalanceFormGroup(sampleWithNewData);

        const balance = service.getBalance(formGroup) as any;

        expect(balance).toMatchObject(sampleWithNewData);
      });

      it('should return NewBalance for empty Balance initial value', () => {
        const formGroup = service.createBalanceFormGroup();

        const balance = service.getBalance(formGroup) as any;

        expect(balance).toMatchObject({});
      });

      it('should return IBalance', () => {
        const formGroup = service.createBalanceFormGroup(sampleWithRequiredData);

        const balance = service.getBalance(formGroup) as any;

        expect(balance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBalance should not enable id FormControl', () => {
        const formGroup = service.createBalanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBalance should disable id FormControl', () => {
        const formGroup = service.createBalanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
