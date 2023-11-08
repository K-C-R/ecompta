import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEcritureComptable, NewEcritureComptable } from '../ecriture-comptable.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEcritureComptable for edit and NewEcritureComptableFormGroupInput for create.
 */
type EcritureComptableFormGroupInput = IEcritureComptable | PartialWithRequiredKeyOf<NewEcritureComptable>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEcritureComptable | NewEcritureComptable> = Omit<T, 'date'> & {
  date?: string | null;
};

type EcritureComptableFormRawValue = FormValueOf<IEcritureComptable>;

type NewEcritureComptableFormRawValue = FormValueOf<NewEcritureComptable>;

type EcritureComptableFormDefaults = Pick<NewEcritureComptable, 'id' | 'date'>;

type EcritureComptableFormGroupContent = {
  id: FormControl<EcritureComptableFormRawValue['id'] | NewEcritureComptable['id']>;
  date: FormControl<EcritureComptableFormRawValue['date']>;
  montant: FormControl<EcritureComptableFormRawValue['montant']>;
  libelle: FormControl<EcritureComptableFormRawValue['libelle']>;
  typeEcriture: FormControl<EcritureComptableFormRawValue['typeEcriture']>;
  reference: FormControl<EcritureComptableFormRawValue['reference']>;
  autreInfos: FormControl<EcritureComptableFormRawValue['autreInfos']>;
  pieces: FormControl<EcritureComptableFormRawValue['pieces']>;
  compte: FormControl<EcritureComptableFormRawValue['compte']>;
};

export type EcritureComptableFormGroup = FormGroup<EcritureComptableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EcritureComptableFormService {
  createEcritureComptableFormGroup(ecritureComptable: EcritureComptableFormGroupInput = { id: null }): EcritureComptableFormGroup {
    const ecritureComptableRawValue = this.convertEcritureComptableToEcritureComptableRawValue({
      ...this.getFormDefaults(),
      ...ecritureComptable,
    });
    return new FormGroup<EcritureComptableFormGroupContent>({
      id: new FormControl(
        { value: ecritureComptableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(ecritureComptableRawValue.date, {
        validators: [Validators.required],
      }),
      montant: new FormControl(ecritureComptableRawValue.montant, {
        validators: [Validators.required, Validators.min(0)],
      }),
      libelle: new FormControl(ecritureComptableRawValue.libelle),
      typeEcriture: new FormControl(ecritureComptableRawValue.typeEcriture, {
        validators: [Validators.required],
      }),
      reference: new FormControl(ecritureComptableRawValue.reference),
      autreInfos: new FormControl(ecritureComptableRawValue.autreInfos),
      pieces: new FormControl(ecritureComptableRawValue.pieces),
      compte: new FormControl(ecritureComptableRawValue.compte),
    });
  }

  getEcritureComptable(form: EcritureComptableFormGroup): IEcritureComptable | NewEcritureComptable {
    return this.convertEcritureComptableRawValueToEcritureComptable(
      form.getRawValue() as EcritureComptableFormRawValue | NewEcritureComptableFormRawValue,
    );
  }

  resetForm(form: EcritureComptableFormGroup, ecritureComptable: EcritureComptableFormGroupInput): void {
    const ecritureComptableRawValue = this.convertEcritureComptableToEcritureComptableRawValue({
      ...this.getFormDefaults(),
      ...ecritureComptable,
    });
    form.reset(
      {
        ...ecritureComptableRawValue,
        id: { value: ecritureComptableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EcritureComptableFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertEcritureComptableRawValueToEcritureComptable(
    rawEcritureComptable: EcritureComptableFormRawValue | NewEcritureComptableFormRawValue,
  ): IEcritureComptable | NewEcritureComptable {
    return {
      ...rawEcritureComptable,
      date: dayjs(rawEcritureComptable.date, DATE_TIME_FORMAT),
    };
  }

  private convertEcritureComptableToEcritureComptableRawValue(
    ecritureComptable: IEcritureComptable | (Partial<NewEcritureComptable> & EcritureComptableFormDefaults),
  ): EcritureComptableFormRawValue | PartialWithRequiredKeyOf<NewEcritureComptableFormRawValue> {
    return {
      ...ecritureComptable,
      date: ecritureComptable.date ? ecritureComptable.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
