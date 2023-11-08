import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../solde-comptable.test-samples';

import { SoldeComptableFormService } from './solde-comptable-form.service';

describe('SoldeComptable Form Service', () => {
  let service: SoldeComptableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoldeComptableFormService);
  });

  describe('Service methods', () => {
    describe('createSoldeComptableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSoldeComptableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            solde: expect.any(Object),
            compte: expect.any(Object),
          }),
        );
      });

      it('passing ISoldeComptable should create a new form with FormGroup', () => {
        const formGroup = service.createSoldeComptableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            solde: expect.any(Object),
            compte: expect.any(Object),
          }),
        );
      });
    });

    describe('getSoldeComptable', () => {
      it('should return NewSoldeComptable for default SoldeComptable initial value', () => {
        const formGroup = service.createSoldeComptableFormGroup(sampleWithNewData);

        const soldeComptable = service.getSoldeComptable(formGroup) as any;

        expect(soldeComptable).toMatchObject(sampleWithNewData);
      });

      it('should return NewSoldeComptable for empty SoldeComptable initial value', () => {
        const formGroup = service.createSoldeComptableFormGroup();

        const soldeComptable = service.getSoldeComptable(formGroup) as any;

        expect(soldeComptable).toMatchObject({});
      });

      it('should return ISoldeComptable', () => {
        const formGroup = service.createSoldeComptableFormGroup(sampleWithRequiredData);

        const soldeComptable = service.getSoldeComptable(formGroup) as any;

        expect(soldeComptable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISoldeComptable should not enable id FormControl', () => {
        const formGroup = service.createSoldeComptableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSoldeComptable should disable id FormControl', () => {
        const formGroup = service.createSoldeComptableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
