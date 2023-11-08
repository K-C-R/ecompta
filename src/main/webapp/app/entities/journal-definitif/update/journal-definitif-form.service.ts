import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJournalDefinitif, NewJournalDefinitif } from '../journal-definitif.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJournalDefinitif for edit and NewJournalDefinitifFormGroupInput for create.
 */
type JournalDefinitifFormGroupInput = IJournalDefinitif | PartialWithRequiredKeyOf<NewJournalDefinitif>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IJournalDefinitif | NewJournalDefinitif> = Omit<T, 'date'> & {
  date?: string | null;
};

type JournalDefinitifFormRawValue = FormValueOf<IJournalDefinitif>;

type NewJournalDefinitifFormRawValue = FormValueOf<NewJournalDefinitif>;

type JournalDefinitifFormDefaults = Pick<NewJournalDefinitif, 'id' | 'date'>;

type JournalDefinitifFormGroupContent = {
  id: FormControl<JournalDefinitifFormRawValue['id'] | NewJournalDefinitif['id']>;
  date: FormControl<JournalDefinitifFormRawValue['date']>;
  description: FormControl<JournalDefinitifFormRawValue['description']>;
  montant: FormControl<JournalDefinitifFormRawValue['montant']>;
  reference: FormControl<JournalDefinitifFormRawValue['reference']>;
  compte: FormControl<JournalDefinitifFormRawValue['compte']>;
  balance: FormControl<JournalDefinitifFormRawValue['balance']>;
};

export type JournalDefinitifFormGroup = FormGroup<JournalDefinitifFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JournalDefinitifFormService {
  createJournalDefinitifFormGroup(journalDefinitif: JournalDefinitifFormGroupInput = { id: null }): JournalDefinitifFormGroup {
    const journalDefinitifRawValue = this.convertJournalDefinitifToJournalDefinitifRawValue({
      ...this.getFormDefaults(),
      ...journalDefinitif,
    });
    return new FormGroup<JournalDefinitifFormGroupContent>({
      id: new FormControl(
        { value: journalDefinitifRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(journalDefinitifRawValue.date, {
        validators: [Validators.required],
      }),
      description: new FormControl(journalDefinitifRawValue.description),
      montant: new FormControl(journalDefinitifRawValue.montant),
      reference: new FormControl(journalDefinitifRawValue.reference),
      compte: new FormControl(journalDefinitifRawValue.compte),
      balance: new FormControl(journalDefinitifRawValue.balance),
    });
  }

  getJournalDefinitif(form: JournalDefinitifFormGroup): IJournalDefinitif | NewJournalDefinitif {
    return this.convertJournalDefinitifRawValueToJournalDefinitif(
      form.getRawValue() as JournalDefinitifFormRawValue | NewJournalDefinitifFormRawValue,
    );
  }

  resetForm(form: JournalDefinitifFormGroup, journalDefinitif: JournalDefinitifFormGroupInput): void {
    const journalDefinitifRawValue = this.convertJournalDefinitifToJournalDefinitifRawValue({
      ...this.getFormDefaults(),
      ...journalDefinitif,
    });
    form.reset(
      {
        ...journalDefinitifRawValue,
        id: { value: journalDefinitifRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JournalDefinitifFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertJournalDefinitifRawValueToJournalDefinitif(
    rawJournalDefinitif: JournalDefinitifFormRawValue | NewJournalDefinitifFormRawValue,
  ): IJournalDefinitif | NewJournalDefinitif {
    return {
      ...rawJournalDefinitif,
      date: dayjs(rawJournalDefinitif.date, DATE_TIME_FORMAT),
    };
  }

  private convertJournalDefinitifToJournalDefinitifRawValue(
    journalDefinitif: IJournalDefinitif | (Partial<NewJournalDefinitif> & JournalDefinitifFormDefaults),
  ): JournalDefinitifFormRawValue | PartialWithRequiredKeyOf<NewJournalDefinitifFormRawValue> {
    return {
      ...journalDefinitif,
      date: journalDefinitif.date ? journalDefinitif.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
