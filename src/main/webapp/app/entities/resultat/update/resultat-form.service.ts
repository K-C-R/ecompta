import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IResultat, NewResultat } from '../resultat.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IResultat for edit and NewResultatFormGroupInput for create.
 */
type ResultatFormGroupInput = IResultat | PartialWithRequiredKeyOf<NewResultat>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IResultat | NewResultat> = Omit<T, 'exercice'> & {
  exercice?: string | null;
};

type ResultatFormRawValue = FormValueOf<IResultat>;

type NewResultatFormRawValue = FormValueOf<NewResultat>;

type ResultatFormDefaults = Pick<NewResultat, 'id' | 'exercice'>;

type ResultatFormGroupContent = {
  id: FormControl<ResultatFormRawValue['id'] | NewResultat['id']>;
  exercice: FormControl<ResultatFormRawValue['exercice']>;
  resultatNet: FormControl<ResultatFormRawValue['resultatNet']>;
};

export type ResultatFormGroup = FormGroup<ResultatFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResultatFormService {
  createResultatFormGroup(resultat: ResultatFormGroupInput = { id: null }): ResultatFormGroup {
    const resultatRawValue = this.convertResultatToResultatRawValue({
      ...this.getFormDefaults(),
      ...resultat,
    });
    return new FormGroup<ResultatFormGroupContent>({
      id: new FormControl(
        { value: resultatRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      exercice: new FormControl(resultatRawValue.exercice),
      resultatNet: new FormControl(resultatRawValue.resultatNet),
    });
  }

  getResultat(form: ResultatFormGroup): IResultat | NewResultat {
    return this.convertResultatRawValueToResultat(form.getRawValue() as ResultatFormRawValue | NewResultatFormRawValue);
  }

  resetForm(form: ResultatFormGroup, resultat: ResultatFormGroupInput): void {
    const resultatRawValue = this.convertResultatToResultatRawValue({ ...this.getFormDefaults(), ...resultat });
    form.reset(
      {
        ...resultatRawValue,
        id: { value: resultatRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ResultatFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      exercice: currentTime,
    };
  }

  private convertResultatRawValueToResultat(rawResultat: ResultatFormRawValue | NewResultatFormRawValue): IResultat | NewResultat {
    return {
      ...rawResultat,
      exercice: dayjs(rawResultat.exercice, DATE_TIME_FORMAT),
    };
  }

  private convertResultatToResultatRawValue(
    resultat: IResultat | (Partial<NewResultat> & ResultatFormDefaults),
  ): ResultatFormRawValue | PartialWithRequiredKeyOf<NewResultatFormRawValue> {
    return {
      ...resultat,
      exercice: resultat.exercice ? resultat.exercice.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
