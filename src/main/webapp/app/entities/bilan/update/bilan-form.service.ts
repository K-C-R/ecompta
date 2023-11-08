import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBilan, NewBilan } from '../bilan.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBilan for edit and NewBilanFormGroupInput for create.
 */
type BilanFormGroupInput = IBilan | PartialWithRequiredKeyOf<NewBilan>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IBilan | NewBilan> = Omit<T, 'exercice'> & {
  exercice?: string | null;
};

type BilanFormRawValue = FormValueOf<IBilan>;

type NewBilanFormRawValue = FormValueOf<NewBilan>;

type BilanFormDefaults = Pick<NewBilan, 'id' | 'exercice'>;

type BilanFormGroupContent = {
  id: FormControl<BilanFormRawValue['id'] | NewBilan['id']>;
  exercice: FormControl<BilanFormRawValue['exercice']>;
  actifTotal: FormControl<BilanFormRawValue['actifTotal']>;
  passifTotal: FormControl<BilanFormRawValue['passifTotal']>;
};

export type BilanFormGroup = FormGroup<BilanFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BilanFormService {
  createBilanFormGroup(bilan: BilanFormGroupInput = { id: null }): BilanFormGroup {
    const bilanRawValue = this.convertBilanToBilanRawValue({
      ...this.getFormDefaults(),
      ...bilan,
    });
    return new FormGroup<BilanFormGroupContent>({
      id: new FormControl(
        { value: bilanRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      exercice: new FormControl(bilanRawValue.exercice),
      actifTotal: new FormControl(bilanRawValue.actifTotal),
      passifTotal: new FormControl(bilanRawValue.passifTotal),
    });
  }

  getBilan(form: BilanFormGroup): IBilan | NewBilan {
    return this.convertBilanRawValueToBilan(form.getRawValue() as BilanFormRawValue | NewBilanFormRawValue);
  }

  resetForm(form: BilanFormGroup, bilan: BilanFormGroupInput): void {
    const bilanRawValue = this.convertBilanToBilanRawValue({ ...this.getFormDefaults(), ...bilan });
    form.reset(
      {
        ...bilanRawValue,
        id: { value: bilanRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BilanFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      exercice: currentTime,
    };
  }

  private convertBilanRawValueToBilan(rawBilan: BilanFormRawValue | NewBilanFormRawValue): IBilan | NewBilan {
    return {
      ...rawBilan,
      exercice: dayjs(rawBilan.exercice, DATE_TIME_FORMAT),
    };
  }

  private convertBilanToBilanRawValue(
    bilan: IBilan | (Partial<NewBilan> & BilanFormDefaults),
  ): BilanFormRawValue | PartialWithRequiredKeyOf<NewBilanFormRawValue> {
    return {
      ...bilan,
      exercice: bilan.exercice ? bilan.exercice.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
