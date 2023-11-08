import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../compte-comptable.test-samples';

import { CompteComptableFormService } from './compte-comptable-form.service';

describe('CompteComptable Form Service', () => {
  let service: CompteComptableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteComptableFormService);
  });

  describe('Service methods', () => {
    describe('createCompteComptableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompteComptableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numero: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });

      it('passing ICompteComptable should create a new form with FormGroup', () => {
        const formGroup = service.createCompteComptableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numero: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });
    });

    describe('getCompteComptable', () => {
      it('should return NewCompteComptable for default CompteComptable initial value', () => {
        const formGroup = service.createCompteComptableFormGroup(sampleWithNewData);

        const compteComptable = service.getCompteComptable(formGroup) as any;

        expect(compteComptable).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompteComptable for empty CompteComptable initial value', () => {
        const formGroup = service.createCompteComptableFormGroup();

        const compteComptable = service.getCompteComptable(formGroup) as any;

        expect(compteComptable).toMatchObject({});
      });

      it('should return ICompteComptable', () => {
        const formGroup = service.createCompteComptableFormGroup(sampleWithRequiredData);

        const compteComptable = service.getCompteComptable(formGroup) as any;

        expect(compteComptable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompteComptable should not enable id FormControl', () => {
        const formGroup = service.createCompteComptableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompteComptable should disable id FormControl', () => {
        const formGroup = service.createCompteComptableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
