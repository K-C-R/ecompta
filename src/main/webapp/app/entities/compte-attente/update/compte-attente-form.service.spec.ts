import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../compte-attente.test-samples';

import { CompteAttenteFormService } from './compte-attente-form.service';

describe('CompteAttente Form Service', () => {
  let service: CompteAttenteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteAttenteFormService);
  });

  describe('Service methods', () => {
    describe('createCompteAttenteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompteAttenteFormGroup();

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

      it('passing ICompteAttente should create a new form with FormGroup', () => {
        const formGroup = service.createCompteAttenteFormGroup(sampleWithRequiredData);

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

    describe('getCompteAttente', () => {
      it('should return NewCompteAttente for default CompteAttente initial value', () => {
        const formGroup = service.createCompteAttenteFormGroup(sampleWithNewData);

        const compteAttente = service.getCompteAttente(formGroup) as any;

        expect(compteAttente).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompteAttente for empty CompteAttente initial value', () => {
        const formGroup = service.createCompteAttenteFormGroup();

        const compteAttente = service.getCompteAttente(formGroup) as any;

        expect(compteAttente).toMatchObject({});
      });

      it('should return ICompteAttente', () => {
        const formGroup = service.createCompteAttenteFormGroup(sampleWithRequiredData);

        const compteAttente = service.getCompteAttente(formGroup) as any;

        expect(compteAttente).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompteAttente should not enable id FormControl', () => {
        const formGroup = service.createCompteAttenteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompteAttente should disable id FormControl', () => {
        const formGroup = service.createCompteAttenteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
