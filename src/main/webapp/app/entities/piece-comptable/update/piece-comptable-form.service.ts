import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPieceComptable, NewPieceComptable } from '../piece-comptable.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPieceComptable for edit and NewPieceComptableFormGroupInput for create.
 */
type PieceComptableFormGroupInput = IPieceComptable | PartialWithRequiredKeyOf<NewPieceComptable>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPieceComptable | NewPieceComptable> = Omit<T, 'datePiece'> & {
  datePiece?: string | null;
};

type PieceComptableFormRawValue = FormValueOf<IPieceComptable>;

type NewPieceComptableFormRawValue = FormValueOf<NewPieceComptable>;

type PieceComptableFormDefaults = Pick<NewPieceComptable, 'id' | 'datePiece' | 'comptes' | 'transactions'>;

type PieceComptableFormGroupContent = {
  id: FormControl<PieceComptableFormRawValue['id'] | NewPieceComptable['id']>;
  numeroPiece: FormControl<PieceComptableFormRawValue['numeroPiece']>;
  datePiece: FormControl<PieceComptableFormRawValue['datePiece']>;
  description: FormControl<PieceComptableFormRawValue['description']>;
  comptes: FormControl<PieceComptableFormRawValue['comptes']>;
  transactions: FormControl<PieceComptableFormRawValue['transactions']>;
};

export type PieceComptableFormGroup = FormGroup<PieceComptableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PieceComptableFormService {
  createPieceComptableFormGroup(pieceComptable: PieceComptableFormGroupInput = { id: null }): PieceComptableFormGroup {
    const pieceComptableRawValue = this.convertPieceComptableToPieceComptableRawValue({
      ...this.getFormDefaults(),
      ...pieceComptable,
    });
    return new FormGroup<PieceComptableFormGroupContent>({
      id: new FormControl(
        { value: pieceComptableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numeroPiece: new FormControl(pieceComptableRawValue.numeroPiece),
      datePiece: new FormControl(pieceComptableRawValue.datePiece),
      description: new FormControl(pieceComptableRawValue.description),
      comptes: new FormControl(pieceComptableRawValue.comptes ?? []),
      transactions: new FormControl(pieceComptableRawValue.transactions ?? []),
    });
  }

  getPieceComptable(form: PieceComptableFormGroup): IPieceComptable | NewPieceComptable {
    return this.convertPieceComptableRawValueToPieceComptable(
      form.getRawValue() as PieceComptableFormRawValue | NewPieceComptableFormRawValue,
    );
  }

  resetForm(form: PieceComptableFormGroup, pieceComptable: PieceComptableFormGroupInput): void {
    const pieceComptableRawValue = this.convertPieceComptableToPieceComptableRawValue({ ...this.getFormDefaults(), ...pieceComptable });
    form.reset(
      {
        ...pieceComptableRawValue,
        id: { value: pieceComptableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PieceComptableFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      datePiece: currentTime,
      comptes: [],
      transactions: [],
    };
  }

  private convertPieceComptableRawValueToPieceComptable(
    rawPieceComptable: PieceComptableFormRawValue | NewPieceComptableFormRawValue,
  ): IPieceComptable | NewPieceComptable {
    return {
      ...rawPieceComptable,
      datePiece: dayjs(rawPieceComptable.datePiece, DATE_TIME_FORMAT),
    };
  }

  private convertPieceComptableToPieceComptableRawValue(
    pieceComptable: IPieceComptable | (Partial<NewPieceComptable> & PieceComptableFormDefaults),
  ): PieceComptableFormRawValue | PartialWithRequiredKeyOf<NewPieceComptableFormRawValue> {
    return {
      ...pieceComptable,
      datePiece: pieceComptable.datePiece ? pieceComptable.datePiece.format(DATE_TIME_FORMAT) : undefined,
      comptes: pieceComptable.comptes ?? [],
      transactions: pieceComptable.transactions ?? [],
    };
  }
}
