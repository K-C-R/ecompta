import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ecriture-comptable.test-samples';

import { EcritureComptableFormService } from './ecriture-comptable-form.service';

describe('EcritureComptable Form Service', () => {
  let service: EcritureComptableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcritureComptableFormService);
  });

  describe('Service methods', () => {
    describe('createEcritureComptableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEcritureComptableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            montant: expect.any(Object),
            libelle: expect.any(Object),
            typeEcriture: expect.any(Object),
            reference: expect.any(Object),
            autreInfos: expect.any(Object),
            pieces: expect.any(Object),
            compte: expect.any(Object),
          }),
        );
      });

      it('passing IEcritureComptable should create a new form with FormGroup', () => {
        const formGroup = service.createEcritureComptableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            montant: expect.any(Object),
            libelle: expect.any(Object),
            typeEcriture: expect.any(Object),
            reference: expect.any(Object),
            autreInfos: expect.any(Object),
            pieces: expect.any(Object),
            compte: expect.any(Object),
          }),
        );
      });
    });

    describe('getEcritureComptable', () => {
      it('should return NewEcritureComptable for default EcritureComptable initial value', () => {
        const formGroup = service.createEcritureComptableFormGroup(sampleWithNewData);

        const ecritureComptable = service.getEcritureComptable(formGroup) as any;

        expect(ecritureComptable).toMatchObject(sampleWithNewData);
      });

      it('should return NewEcritureComptable for empty EcritureComptable initial value', () => {
        const formGroup = service.createEcritureComptableFormGroup();

        const ecritureComptable = service.getEcritureComptable(formGroup) as any;

        expect(ecritureComptable).toMatchObject({});
      });

      it('should return IEcritureComptable', () => {
        const formGroup = service.createEcritureComptableFormGroup(sampleWithRequiredData);

        const ecritureComptable = service.getEcritureComptable(formGroup) as any;

        expect(ecritureComptable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEcritureComptable should not enable id FormControl', () => {
        const formGroup = service.createEcritureComptableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEcritureComptable should disable id FormControl', () => {
        const formGroup = service.createEcritureComptableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
