import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAudit, NewAudit } from '../audit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAudit for edit and NewAuditFormGroupInput for create.
 */
type AuditFormGroupInput = IAudit | PartialWithRequiredKeyOf<NewAudit>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAudit | NewAudit> = Omit<T, 'date'> & {
  date?: string | null;
};

type AuditFormRawValue = FormValueOf<IAudit>;

type NewAuditFormRawValue = FormValueOf<NewAudit>;

type AuditFormDefaults = Pick<NewAudit, 'id' | 'date'>;

type AuditFormGroupContent = {
  id: FormControl<AuditFormRawValue['id'] | NewAudit['id']>;
  date: FormControl<AuditFormRawValue['date']>;
  action: FormControl<AuditFormRawValue['action']>;
  entiteModifiee: FormControl<AuditFormRawValue['entiteModifiee']>;
  utilisateur: FormControl<AuditFormRawValue['utilisateur']>;
  compte: FormControl<AuditFormRawValue['compte']>;
};

export type AuditFormGroup = FormGroup<AuditFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AuditFormService {
  createAuditFormGroup(audit: AuditFormGroupInput = { id: null }): AuditFormGroup {
    const auditRawValue = this.convertAuditToAuditRawValue({
      ...this.getFormDefaults(),
      ...audit,
    });
    return new FormGroup<AuditFormGroupContent>({
      id: new FormControl(
        { value: auditRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(auditRawValue.date),
      action: new FormControl(auditRawValue.action),
      entiteModifiee: new FormControl(auditRawValue.entiteModifiee),
      utilisateur: new FormControl(auditRawValue.utilisateur),
      compte: new FormControl(auditRawValue.compte),
    });
  }

  getAudit(form: AuditFormGroup): IAudit | NewAudit {
    return this.convertAuditRawValueToAudit(form.getRawValue() as AuditFormRawValue | NewAuditFormRawValue);
  }

  resetForm(form: AuditFormGroup, audit: AuditFormGroupInput): void {
    const auditRawValue = this.convertAuditToAuditRawValue({ ...this.getFormDefaults(), ...audit });
    form.reset(
      {
        ...auditRawValue,
        id: { value: auditRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AuditFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertAuditRawValueToAudit(rawAudit: AuditFormRawValue | NewAuditFormRawValue): IAudit | NewAudit {
    return {
      ...rawAudit,
      date: dayjs(rawAudit.date, DATE_TIME_FORMAT),
    };
  }

  private convertAuditToAuditRawValue(
    audit: IAudit | (Partial<NewAudit> & AuditFormDefaults),
  ): AuditFormRawValue | PartialWithRequiredKeyOf<NewAuditFormRawValue> {
    return {
      ...audit,
      date: audit.date ? audit.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
