import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGrandLivre, NewGrandLivre } from '../grand-livre.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGrandLivre for edit and NewGrandLivreFormGroupInput for create.
 */
type GrandLivreFormGroupInput = IGrandLivre | PartialWithRequiredKeyOf<NewGrandLivre>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGrandLivre | NewGrandLivre> = Omit<T, 'date'> & {
  date?: string | null;
};

type GrandLivreFormRawValue = FormValueOf<IGrandLivre>;

type NewGrandLivreFormRawValue = FormValueOf<NewGrandLivre>;

type GrandLivreFormDefaults = Pick<NewGrandLivre, 'id' | 'date'>;

type GrandLivreFormGroupContent = {
  id: FormControl<GrandLivreFormRawValue['id'] | NewGrandLivre['id']>;
  date: FormControl<GrandLivreFormRawValue['date']>;
  description: FormControl<GrandLivreFormRawValue['description']>;
  montant: FormControl<GrandLivreFormRawValue['montant']>;
  reference: FormControl<GrandLivreFormRawValue['reference']>;
  compte: FormControl<GrandLivreFormRawValue['compte']>;
  balance: FormControl<GrandLivreFormRawValue['balance']>;
};

export type GrandLivreFormGroup = FormGroup<GrandLivreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GrandLivreFormService {
  createGrandLivreFormGroup(grandLivre: GrandLivreFormGroupInput = { id: null }): GrandLivreFormGroup {
    const grandLivreRawValue = this.convertGrandLivreToGrandLivreRawValue({
      ...this.getFormDefaults(),
      ...grandLivre,
    });
    return new FormGroup<GrandLivreFormGroupContent>({
      id: new FormControl(
        { value: grandLivreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(grandLivreRawValue.date, {
        validators: [Validators.required],
      }),
      description: new FormControl(grandLivreRawValue.description),
      montant: new FormControl(grandLivreRawValue.montant),
      reference: new FormControl(grandLivreRawValue.reference),
      compte: new FormControl(grandLivreRawValue.compte),
      balance: new FormControl(grandLivreRawValue.balance),
    });
  }

  getGrandLivre(form: GrandLivreFormGroup): IGrandLivre | NewGrandLivre {
    return this.convertGrandLivreRawValueToGrandLivre(form.getRawValue() as GrandLivreFormRawValue | NewGrandLivreFormRawValue);
  }

  resetForm(form: GrandLivreFormGroup, grandLivre: GrandLivreFormGroupInput): void {
    const grandLivreRawValue = this.convertGrandLivreToGrandLivreRawValue({ ...this.getFormDefaults(), ...grandLivre });
    form.reset(
      {
        ...grandLivreRawValue,
        id: { value: grandLivreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GrandLivreFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertGrandLivreRawValueToGrandLivre(
    rawGrandLivre: GrandLivreFormRawValue | NewGrandLivreFormRawValue,
  ): IGrandLivre | NewGrandLivre {
    return {
      ...rawGrandLivre,
      date: dayjs(rawGrandLivre.date, DATE_TIME_FORMAT),
    };
  }

  private convertGrandLivreToGrandLivreRawValue(
    grandLivre: IGrandLivre | (Partial<NewGrandLivre> & GrandLivreFormDefaults),
  ): GrandLivreFormRawValue | PartialWithRequiredKeyOf<NewGrandLivreFormRawValue> {
    return {
      ...grandLivre,
      date: grandLivre.date ? grandLivre.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
