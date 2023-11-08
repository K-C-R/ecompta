import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISoldeComptable, NewSoldeComptable } from '../solde-comptable.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISoldeComptable for edit and NewSoldeComptableFormGroupInput for create.
 */
type SoldeComptableFormGroupInput = ISoldeComptable | PartialWithRequiredKeyOf<NewSoldeComptable>;

type SoldeComptableFormDefaults = Pick<NewSoldeComptable, 'id'>;

type SoldeComptableFormGroupContent = {
  id: FormControl<ISoldeComptable['id'] | NewSoldeComptable['id']>;
  solde: FormControl<ISoldeComptable['solde']>;
  compte: FormControl<ISoldeComptable['compte']>;
};

export type SoldeComptableFormGroup = FormGroup<SoldeComptableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SoldeComptableFormService {
  createSoldeComptableFormGroup(soldeComptable: SoldeComptableFormGroupInput = { id: null }): SoldeComptableFormGroup {
    const soldeComptableRawValue = {
      ...this.getFormDefaults(),
      ...soldeComptable,
    };
    return new FormGroup<SoldeComptableFormGroupContent>({
      id: new FormControl(
        { value: soldeComptableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      solde: new FormControl(soldeComptableRawValue.solde),
      compte: new FormControl(soldeComptableRawValue.compte),
    });
  }

  getSoldeComptable(form: SoldeComptableFormGroup): ISoldeComptable | NewSoldeComptable {
    return form.getRawValue() as ISoldeComptable | NewSoldeComptable;
  }

  resetForm(form: SoldeComptableFormGroup, soldeComptable: SoldeComptableFormGroupInput): void {
    const soldeComptableRawValue = { ...this.getFormDefaults(), ...soldeComptable };
    form.reset(
      {
        ...soldeComptableRawValue,
        id: { value: soldeComptableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SoldeComptableFormDefaults {
    return {
      id: null,
    };
  }
}
