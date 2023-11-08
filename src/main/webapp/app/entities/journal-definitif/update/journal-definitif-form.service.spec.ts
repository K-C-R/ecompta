import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../journal-definitif.test-samples';

import { JournalDefinitifFormService } from './journal-definitif-form.service';

describe('JournalDefinitif Form Service', () => {
  let service: JournalDefinitifFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalDefinitifFormService);
  });

  describe('Service methods', () => {
    describe('createJournalDefinitifFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJournalDefinitifFormGroup();

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

      it('passing IJournalDefinitif should create a new form with FormGroup', () => {
        const formGroup = service.createJournalDefinitifFormGroup(sampleWithRequiredData);

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

    describe('getJournalDefinitif', () => {
      it('should return NewJournalDefinitif for default JournalDefinitif initial value', () => {
        const formGroup = service.createJournalDefinitifFormGroup(sampleWithNewData);

        const journalDefinitif = service.getJournalDefinitif(formGroup) as any;

        expect(journalDefinitif).toMatchObject(sampleWithNewData);
      });

      it('should return NewJournalDefinitif for empty JournalDefinitif initial value', () => {
        const formGroup = service.createJournalDefinitifFormGroup();

        const journalDefinitif = service.getJournalDefinitif(formGroup) as any;

        expect(journalDefinitif).toMatchObject({});
      });

      it('should return IJournalDefinitif', () => {
        const formGroup = service.createJournalDefinitifFormGroup(sampleWithRequiredData);

        const journalDefinitif = service.getJournalDefinitif(formGroup) as any;

        expect(journalDefinitif).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJournalDefinitif should not enable id FormControl', () => {
        const formGroup = service.createJournalDefinitifFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJournalDefinitif should disable id FormControl', () => {
        const formGroup = service.createJournalDefinitifFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
