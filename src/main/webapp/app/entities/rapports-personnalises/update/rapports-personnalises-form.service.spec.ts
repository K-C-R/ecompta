import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../rapports-personnalises.test-samples';

import { RapportsPersonnalisesFormService } from './rapports-personnalises-form.service';

describe('RapportsPersonnalises Form Service', () => {
  let service: RapportsPersonnalisesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RapportsPersonnalisesFormService);
  });

  describe('Service methods', () => {
    describe('createRapportsPersonnalisesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRapportsPersonnalisesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
            contenu: expect.any(Object),
          }),
        );
      });

      it('passing IRapportsPersonnalises should create a new form with FormGroup', () => {
        const formGroup = service.createRapportsPersonnalisesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
            contenu: expect.any(Object),
          }),
        );
      });
    });

    describe('getRapportsPersonnalises', () => {
      it('should return NewRapportsPersonnalises for default RapportsPersonnalises initial value', () => {
        const formGroup = service.createRapportsPersonnalisesFormGroup(sampleWithNewData);

        const rapportsPersonnalises = service.getRapportsPersonnalises(formGroup) as any;

        expect(rapportsPersonnalises).toMatchObject(sampleWithNewData);
      });

      it('should return NewRapportsPersonnalises for empty RapportsPersonnalises initial value', () => {
        const formGroup = service.createRapportsPersonnalisesFormGroup();

        const rapportsPersonnalises = service.getRapportsPersonnalises(formGroup) as any;

        expect(rapportsPersonnalises).toMatchObject({});
      });

      it('should return IRapportsPersonnalises', () => {
        const formGroup = service.createRapportsPersonnalisesFormGroup(sampleWithRequiredData);

        const rapportsPersonnalises = service.getRapportsPersonnalises(formGroup) as any;

        expect(rapportsPersonnalises).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRapportsPersonnalises should not enable id FormControl', () => {
        const formGroup = service.createRapportsPersonnalisesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRapportsPersonnalises should disable id FormControl', () => {
        const formGroup = service.createRapportsPersonnalisesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
