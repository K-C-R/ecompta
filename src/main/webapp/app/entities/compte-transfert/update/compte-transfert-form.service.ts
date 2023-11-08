import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompteTransfert, NewCompteTransfert } from '../compte-transfert.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompteTransfert for edit and NewCompteTransfertFormGroupInput for create.
 */
type CompteTransfertFormGroupInput = ICompteTransfert | PartialWithRequiredKeyOf<NewCompteTransfert>;

type CompteTransfertFormDefaults = Pick<NewCompteTransfert, 'id'>;

type CompteTransfertFormGroupContent = {
  id: FormControl<ICompteTransfert['id'] | NewCompteTransfert['id']>;
  numeroCompte: FormControl<ICompteTransfert['numeroCompte']>;
  nom: FormControl<ICompteTransfert['nom']>;
  description: FormControl<ICompteTransfert['description']>;
  compte: FormControl<ICompteTransfert['compte']>;
};

export type CompteTransfertFormGroup = FormGroup<CompteTransfertFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompteTransfertFormService {
  createCompteTransfertFormGroup(compteTransfert: CompteTransfertFormGroupInput = { id: null }): CompteTransfertFormGroup {
    const compteTransfertRawValue = {
      ...this.getFormDefaults(),
      ...compteTransfert,
    };
    return new FormGroup<CompteTransfertFormGroupContent>({
      id: new FormControl(
        { value: compteTransfertRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numeroCompte: new FormControl(compteTransfertRawValue.numeroCompte),
      nom: new FormControl(compteTransfertRawValue.nom),
      description: new FormControl(compteTransfertRawValue.description),
      compte: new FormControl(compteTransfertRawValue.compte),
    });
  }

  getCompteTransfert(form: CompteTransfertFormGroup): ICompteTransfert | NewCompteTransfert {
    return form.getRawValue() as ICompteTransfert | NewCompteTransfert;
  }

  resetForm(form: CompteTransfertFormGroup, compteTransfert: CompteTransfertFormGroupInput): void {
    const compteTransfertRawValue = { ...this.getFormDefaults(), ...compteTransfert };
    form.reset(
      {
        ...compteTransfertRawValue,
        id: { value: compteTransfertRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CompteTransfertFormDefaults {
    return {
      id: null,
    };
  }
}
