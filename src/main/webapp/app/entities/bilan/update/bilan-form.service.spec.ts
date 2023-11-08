import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../bilan.test-samples';

import { BilanFormService } from './bilan-form.service';

describe('Bilan Form Service', () => {
  let service: BilanFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BilanFormService);
  });

  describe('Service methods', () => {
    describe('createBilanFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBilanFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exercice: expect.any(Object),
            actifTotal: expect.any(Object),
            passifTotal: expect.any(Object),
          }),
        );
      });

      it('passing IBilan should create a new form with FormGroup', () => {
        const formGroup = service.createBilanFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exercice: expect.any(Object),
            actifTotal: expect.any(Object),
            passifTotal: expect.any(Object),
          }),
        );
      });
    });

    describe('getBilan', () => {
      it('should return NewBilan for default Bilan initial value', () => {
        const formGroup = service.createBilanFormGroup(sampleWithNewData);

        const bilan = service.getBilan(formGroup) as any;

        expect(bilan).toMatchObject(sampleWithNewData);
      });

      it('should return NewBilan for empty Bilan initial value', () => {
        const formGroup = service.createBilanFormGroup();

        const bilan = service.getBilan(formGroup) as any;

        expect(bilan).toMatchObject({});
      });

      it('should return IBilan', () => {
        const formGroup = service.createBilanFormGroup(sampleWithRequiredData);

        const bilan = service.getBilan(formGroup) as any;

        expect(bilan).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBilan should not enable id FormControl', () => {
        const formGroup = service.createBilanFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBilan should disable id FormControl', () => {
        const formGroup = service.createBilanFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
