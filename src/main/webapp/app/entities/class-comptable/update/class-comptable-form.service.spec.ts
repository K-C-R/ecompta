import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../class-comptable.test-samples';

import { ClassComptableFormService } from './class-comptable-form.service';

describe('ClassComptable Form Service', () => {
  let service: ClassComptableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassComptableFormService);
  });

  describe('Service methods', () => {
    describe('createClassComptableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClassComptableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
            compte: expect.any(Object),
          }),
        );
      });

      it('passing IClassComptable should create a new form with FormGroup', () => {
        const formGroup = service.createClassComptableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
            compte: expect.any(Object),
          }),
        );
      });
    });

    describe('getClassComptable', () => {
      it('should return NewClassComptable for default ClassComptable initial value', () => {
        const formGroup = service.createClassComptableFormGroup(sampleWithNewData);

        const classComptable = service.getClassComptable(formGroup) as any;

        expect(classComptable).toMatchObject(sampleWithNewData);
      });

      it('should return NewClassComptable for empty ClassComptable initial value', () => {
        const formGroup = service.createClassComptableFormGroup();

        const classComptable = service.getClassComptable(formGroup) as any;

        expect(classComptable).toMatchObject({});
      });

      it('should return IClassComptable', () => {
        const formGroup = service.createClassComptableFormGroup(sampleWithRequiredData);

        const classComptable = service.getClassComptable(formGroup) as any;

        expect(classComptable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClassComptable should not enable id FormControl', () => {
        const formGroup = service.createClassComptableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClassComptable should disable id FormControl', () => {
        const formGroup = service.createClassComptableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
