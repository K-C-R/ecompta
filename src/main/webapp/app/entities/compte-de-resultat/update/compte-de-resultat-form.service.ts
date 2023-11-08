import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICompteDeResultat, NewCompteDeResultat } from '../compte-de-resultat.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompteDeResultat for edit and NewCompteDeResultatFormGroupInput for create.
 */
type CompteDeResultatFormGroupInput = ICompteDeResultat | PartialWithRequiredKeyOf<NewCompteDeResultat>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICompteDeResultat | NewCompteDeResultat> = Omit<T, 'exercice'> & {
  exercice?: string | null;
};

type CompteDeResultatFormRawValue = FormValueOf<ICompteDeResultat>;

type NewCompteDeResultatFormRawValue = FormValueOf<NewCompteDeResultat>;

type CompteDeResultatFormDefaults = Pick<NewCompteDeResultat, 'id' | 'exercice'>;

type CompteDeResultatFormGroupContent = {
  id: FormControl<CompteDeResultatFormRawValue['id'] | NewCompteDeResultat['id']>;
  exercice: FormControl<CompteDeResultatFormRawValue['exercice']>;
  produitsTotal: FormControl<CompteDeResultatFormRawValue['produitsTotal']>;
  chargesTotal: FormControl<CompteDeResultatFormRawValue['chargesTotal']>;
  resultatNet: FormControl<CompteDeResultatFormRawValue['resultatNet']>;
  resultat: FormControl<CompteDeResultatFormRawValue['resultat']>;
};

export type CompteDeResultatFormGroup = FormGroup<CompteDeResultatFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompteDeResultatFormService {
  createCompteDeResultatFormGroup(compteDeResultat: CompteDeResultatFormGroupInput = { id: null }): CompteDeResultatFormGroup {
    const compteDeResultatRawValue = this.convertCompteDeResultatToCompteDeResultatRawValue({
      ...this.getFormDefaults(),
      ...compteDeResultat,
    });
    return new FormGroup<CompteDeResultatFormGroupContent>({
      id: new FormControl(
        { value: compteDeResultatRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      exercice: new FormControl(compteDeResultatRawValue.exercice),
      produitsTotal: new FormControl(compteDeResultatRawValue.produitsTotal),
      chargesTotal: new FormControl(compteDeResultatRawValue.chargesTotal),
      resultatNet: new FormControl(compteDeResultatRawValue.resultatNet),
      resultat: new FormControl(compteDeResultatRawValue.resultat),
    });
  }

  getCompteDeResultat(form: CompteDeResultatFormGroup): ICompteDeResultat | NewCompteDeResultat {
    return this.convertCompteDeResultatRawValueToCompteDeResultat(
      form.getRawValue() as CompteDeResultatFormRawValue | NewCompteDeResultatFormRawValue,
    );
  }

  resetForm(form: CompteDeResultatFormGroup, compteDeResultat: CompteDeResultatFormGroupInput): void {
    const compteDeResultatRawValue = this.convertCompteDeResultatToCompteDeResultatRawValue({
      ...this.getFormDefaults(),
      ...compteDeResultat,
    });
    form.reset(
      {
        ...compteDeResultatRawValue,
        id: { value: compteDeResultatRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CompteDeResultatFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      exercice: currentTime,
    };
  }

  private convertCompteDeResultatRawValueToCompteDeResultat(
    rawCompteDeResultat: CompteDeResultatFormRawValue | NewCompteDeResultatFormRawValue,
  ): ICompteDeResultat | NewCompteDeResultat {
    return {
      ...rawCompteDeResultat,
      exercice: dayjs(rawCompteDeResultat.exercice, DATE_TIME_FORMAT),
    };
  }

  private convertCompteDeResultatToCompteDeResultatRawValue(
    compteDeResultat: ICompteDeResultat | (Partial<NewCompteDeResultat> & CompteDeResultatFormDefaults),
  ): CompteDeResultatFormRawValue | PartialWithRequiredKeyOf<NewCompteDeResultatFormRawValue> {
    return {
      ...compteDeResultat,
      exercice: compteDeResultat.exercice ? compteDeResultat.exercice.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
