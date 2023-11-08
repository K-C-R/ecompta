import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompteComptable, NewCompteComptable } from '../compte-comptable.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompteComptable for edit and NewCompteComptableFormGroupInput for create.
 */
type CompteComptableFormGroupInput = ICompteComptable | PartialWithRequiredKeyOf<NewCompteComptable>;

type CompteComptableFormDefaults = Pick<NewCompteComptable, 'id'>;

type CompteComptableFormGroupContent = {
  id: FormControl<ICompteComptable['id'] | NewCompteComptable['id']>;
  numero: FormControl<ICompteComptable['numero']>;
  nom: FormControl<ICompteComptable['nom']>;
  description: FormControl<ICompteComptable['description']>;
};

export type CompteComptableFormGroup = FormGroup<CompteComptableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompteComptableFormService {
  createCompteComptableFormGroup(compteComptable: CompteComptableFormGroupInput = { id: null }): CompteComptableFormGroup {
    const compteComptableRawValue = {
      ...this.getFormDefaults(),
      ...compteComptable,
    };
    return new FormGroup<CompteComptableFormGroupContent>({
      id: new FormControl(
        { value: compteComptableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numero: new FormControl(compteComptableRawValue.numero),
      nom: new FormControl(compteComptableRawValue.nom, {
        validators: [Validators.required],
      }),
      description: new FormControl(compteComptableRawValue.description),
    });
  }

  getCompteComptable(form: CompteComptableFormGroup): ICompteComptable | NewCompteComptable {
    return form.getRawValue() as ICompteComptable | NewCompteComptable;
  }

  resetForm(form: CompteComptableFormGroup, compteComptable: CompteComptableFormGroupInput): void {
    const compteComptableRawValue = { ...this.getFormDefaults(), ...compteComptable };
    form.reset(
      {
        ...compteComptableRawValue,
        id: { value: compteComptableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CompteComptableFormDefaults {
    return {
      id: null,
    };
  }
}
