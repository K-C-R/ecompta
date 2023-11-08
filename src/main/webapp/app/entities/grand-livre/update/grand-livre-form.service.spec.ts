import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../grand-livre.test-samples';

import { GrandLivreFormService } from './grand-livre-form.service';

describe('GrandLivre Form Service', () => {
  let service: GrandLivreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrandLivreFormService);
  });

  describe('Service methods', () => {
    describe('createGrandLivreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGrandLivreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            montant: expect.any(Object),
            reference: expect.any(Object),
            compte: expect.any(Object),
            balance: expect.any(Object),
          }),
        );
      });

      it('passing IGrandLivre should create a new form with FormGroup', () => {
        const formGroup = service.createGrandLivreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            montant: expect.any(Object),
            reference: expect.any(Object),
            compte: expect.any(Object),
            balance: expect.any(Object),
          }),
        );
      });
    });

    describe('getGrandLivre', () => {
      it('should return NewGrandLivre for default GrandLivre initial value', () => {
        const formGroup = service.createGrandLivreFormGroup(sampleWithNewData);

        const grandLivre = service.getGrandLivre(formGroup) as any;

        expect(grandLivre).toMatchObject(sampleWithNewData);
      });

      it('should return NewGrandLivre for empty GrandLivre initial value', () => {
        const formGroup = service.createGrandLivreFormGroup();

        const grandLivre = service.getGrandLivre(formGroup) as any;

        expect(grandLivre).toMatchObject({});
      });

      it('should return IGrandLivre', () => {
        const formGroup = service.createGrandLivreFormGroup(sampleWithRequiredData);

        const grandLivre = service.getGrandLivre(formGroup) as any;

        expect(grandLivre).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGrandLivre should not enable id FormControl', () => {
        const formGroup = service.createGrandLivreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGrandLivre should disable id FormControl', () => {
        const formGroup = service.createGrandLivreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
