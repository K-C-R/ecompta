import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../piece-comptable.test-samples';

import { PieceComptableFormService } from './piece-comptable-form.service';

describe('PieceComptable Form Service', () => {
  let service: PieceComptableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceComptableFormService);
  });

  describe('Service methods', () => {
    describe('createPieceComptableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPieceComptableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroPiece: expect.any(Object),
            datePiece: expect.any(Object),
            description: expect.any(Object),
            comptes: expect.any(Object),
            transactions: expect.any(Object),
          }),
        );
      });

      it('passing IPieceComptable should create a new form with FormGroup', () => {
        const formGroup = service.createPieceComptableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroPiece: expect.any(Object),
            datePiece: expect.any(Object),
            description: expect.any(Object),
            comptes: expect.any(Object),
            transactions: expect.any(Object),
          }),
        );
      });
    });

    describe('getPieceComptable', () => {
      it('should return NewPieceComptable for default PieceComptable initial value', () => {
        const formGroup = service.createPieceComptableFormGroup(sampleWithNewData);

        const pieceComptable = service.getPieceComptable(formGroup) as any;

        expect(pieceComptable).toMatchObject(sampleWithNewData);
      });

      it('should return NewPieceComptable for empty PieceComptable initial value', () => {
        const formGroup = service.createPieceComptableFormGroup();

        const pieceComptable = service.getPieceComptable(formGroup) as any;

        expect(pieceComptable).toMatchObject({});
      });

      it('should return IPieceComptable', () => {
        const formGroup = service.createPieceComptableFormGroup(sampleWithRequiredData);

        const pieceComptable = service.getPieceComptable(formGroup) as any;

        expect(pieceComptable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPieceComptable should not enable id FormControl', () => {
        const formGroup = service.createPieceComptableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPieceComptable should disable id FormControl', () => {
        const formGroup = service.createPieceComptableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
