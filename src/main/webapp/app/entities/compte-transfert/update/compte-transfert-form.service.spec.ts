import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../compte-transfert.test-samples';

import { CompteTransfertFormService } from './compte-transfert-form.service';

describe('CompteTransfert Form Service', () => {
  let service: CompteTransfertFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteTransfertFormService);
  });

  describe('Service methods', () => {
    describe('createCompteTransfertFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompteTransfertFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroCompte: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
            compte: expect.any(Object),
          }),
        );
      });

      it('passing ICompteTransfert should create a new form with FormGroup', () => {
        const formGroup = service.createCompteTransfertFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroCompte: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
            compte: expect.any(Object),
          }),
        );
      });
    });

    describe('getCompteTransfert', () => {
      it('should return NewCompteTransfert for default CompteTransfert initial value', () => {
        const formGroup = service.createCompteTransfertFormGroup(sampleWithNewData);

        const compteTransfert = service.getCompteTransfert(formGroup) as any;

        expect(compteTransfert).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompteTransfert for empty CompteTransfert initial value', () => {
        const formGroup = service.createCompteTransfertFormGroup();

        const compteTransfert = service.getCompteTransfert(formGroup) as any;

        expect(compteTransfert).toMatchObject({});
      });

      it('should return ICompteTransfert', () => {
        const formGroup = service.createCompteTransfertFormGroup(sampleWithRequiredData);

        const compteTransfert = service.getCompteTransfert(formGroup) as any;

        expect(compteTransfert).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompteTransfert should not enable id FormControl', () => {
        const formGroup = service.createCompteTransfertFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompteTransfert should disable id FormControl', () => {
        const formGroup = service.createCompteTransfertFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
