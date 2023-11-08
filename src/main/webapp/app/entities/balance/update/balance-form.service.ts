import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBalance, NewBalance } from '../balance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBalance for edit and NewBalanceFormGroupInput for create.
 */
type BalanceFormGroupInput = IBalance | PartialWithRequiredKeyOf<NewBalance>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IBalance | NewBalance> = Omit<T, 'date'> & {
  date?: string | null;
};

type BalanceFormRawValue = FormValueOf<IBalance>;

type NewBalanceFormRawValue = FormValueOf<NewBalance>;

type BalanceFormDefaults = Pick<NewBalance, 'id' | 'date'>;

type BalanceFormGroupContent = {
  id: FormControl<BalanceFormRawValue['id'] | NewBalance['id']>;
  date: FormControl<BalanceFormRawValue['date']>;
  description: FormControl<BalanceFormRawValue['description']>;
  totalsActifs: FormControl<BalanceFormRawValue['totalsActifs']>;
  totalPassifs: FormControl<BalanceFormRawValue['totalPassifs']>;
};

export type BalanceFormGroup = FormGroup<BalanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BalanceFormService {
  createBalanceFormGroup(balance: BalanceFormGroupInput = { id: null }): BalanceFormGroup {
    const balanceRawValue = this.convertBalanceToBalanceRawValue({
      ...this.getFormDefaults(),
      ...balance,
    });
    return new FormGroup<BalanceFormGroupContent>({
      id: new FormControl(
        { value: balanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(balanceRawValue.date, {
        validators: [Validators.required],
      }),
      description: new FormControl(balanceRawValue.description),
      totalsActifs: new FormControl(balanceRawValue.totalsActifs),
      totalPassifs: new FormControl(balanceRawValue.totalPassifs),
    });
  }

  getBalance(form: BalanceFormGroup): IBalance | NewBalance {
    return this.convertBalanceRawValueToBalance(form.getRawValue() as BalanceFormRawValue | NewBalanceFormRawValue);
  }

  resetForm(form: BalanceFormGroup, balance: BalanceFormGroupInput): void {
    const balanceRawValue = this.convertBalanceToBalanceRawValue({ ...this.getFormDefaults(), ...balance });
    form.reset(
      {
        ...balanceRawValue,
        id: { value: balanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BalanceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertBalanceRawValueToBalance(rawBalance: BalanceFormRawValue | NewBalanceFormRawValue): IBalance | NewBalance {
    return {
      ...rawBalance,
      date: dayjs(rawBalance.date, DATE_TIME_FORMAT),
    };
  }

  private convertBalanceToBalanceRawValue(
    balance: IBalance | (Partial<NewBalance> & BalanceFormDefaults),
  ): BalanceFormRawValue | PartialWithRequiredKeyOf<NewBalanceFormRawValue> {
    return {
      ...balance,
      date: balance.date ? balance.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
