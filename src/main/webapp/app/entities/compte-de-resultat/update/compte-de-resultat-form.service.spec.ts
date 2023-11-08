import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../compte-de-resultat.test-samples';

import { CompteDeResultatFormService } from './compte-de-resultat-form.service';

describe('CompteDeResultat Form Service', () => {
  let service: CompteDeResultatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteDeResultatFormService);
  });

  describe('Service methods', () => {
    describe('createCompteDeResultatFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompteDeResultatFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exercice: expect.any(Object),
            produitsTotal: expect.any(Object),
            chargesTotal: expect.any(Object),
            resultatNet: expect.any(Object),
            resultat: expect.any(Object),
          }),
        );
      });

      it('passing ICompteDeResultat should create a new form with FormGroup', () => {
        const formGroup = service.createCompteDeResultatFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exercice: expect.any(Object),
            produitsTotal: expect.any(Object),
            chargesTotal: expect.any(Object),
            resultatNet: expect.any(Object),
            resultat: expect.any(Object),
          }),
        );
      });
    });

    describe('getCompteDeResultat', () => {
      it('should return NewCompteDeResultat for default CompteDeResultat initial value', () => {
        const formGroup = service.createCompteDeResultatFormGroup(sampleWithNewData);

        const compteDeResultat = service.getCompteDeResultat(formGroup) as any;

        expect(compteDeResultat).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompteDeResultat for empty CompteDeResultat initial value', () => {
        const formGroup = service.createCompteDeResultatFormGroup();

        const compteDeResultat = service.getCompteDeResultat(formGroup) as any;

        expect(compteDeResultat).toMatchObject({});
      });

      it('should return ICompteDeResultat', () => {
        const formGroup = service.createCompteDeResultatFormGroup(sampleWithRequiredData);

        const compteDeResultat = service.getCompteDeResultat(formGroup) as any;

        expect(compteDeResultat).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompteDeResultat should not enable id FormControl', () => {
        const formGroup = service.createCompteDeResultatFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompteDeResultat should disable id FormControl', () => {
        const formGroup = service.createCompteDeResultatFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
