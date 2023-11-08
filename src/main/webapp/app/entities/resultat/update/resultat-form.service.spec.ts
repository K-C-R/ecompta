import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../resultat.test-samples';

import { ResultatFormService } from './resultat-form.service';

describe('Resultat Form Service', () => {
  let service: ResultatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultatFormService);
  });

  describe('Service methods', () => {
    describe('createResultatFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createResultatFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exercice: expect.any(Object),
            resultatNet: expect.any(Object),
          }),
        );
      });

      it('passing IResultat should create a new form with FormGroup', () => {
        const formGroup = service.createResultatFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exercice: expect.any(Object),
            resultatNet: expect.any(Object),
          }),
        );
      });
    });

    describe('getResultat', () => {
      it('should return NewResultat for default Resultat initial value', () => {
        const formGroup = service.createResultatFormGroup(sampleWithNewData);

        const resultat = service.getResultat(formGroup) as any;

        expect(resultat).toMatchObject(sampleWithNewData);
      });

      it('should return NewResultat for empty Resultat initial value', () => {
        const formGroup = service.createResultatFormGroup();

        const resultat = service.getResultat(formGroup) as any;

        expect(resultat).toMatchObject({});
      });

      it('should return IResultat', () => {
        const formGroup = service.createResultatFormGroup(sampleWithRequiredData);

        const resultat = service.getResultat(formGroup) as any;

        expect(resultat).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IResultat should not enable id FormControl', () => {
        const formGroup = service.createResultatFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewResultat should disable id FormControl', () => {
        const formGroup = service.createResultatFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
