import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompteAttente, NewCompteAttente } from '../compte-attente.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompteAttente for edit and NewCompteAttenteFormGroupInput for create.
 */
type CompteAttenteFormGroupInput = ICompteAttente | PartialWithRequiredKeyOf<NewCompteAttente>;

type CompteAttenteFormDefaults = Pick<NewCompteAttente, 'id'>;

type CompteAttenteFormGroupContent = {
  id: FormControl<ICompteAttente['id'] | NewCompteAttente['id']>;
  numeroCompte: FormControl<ICompteAttente['numeroCompte']>;
  nom: FormControl<ICompteAttente['nom']>;
  description: FormControl<ICompteAttente['description']>;
  compte: FormControl<ICompteAttente['compte']>;
};

export type CompteAttenteFormGroup = FormGroup<CompteAttenteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompteAttenteFormService {
  createCompteAttenteFormGroup(compteAttente: CompteAttenteFormGroupInput = { id: null }): CompteAttenteFormGroup {
    const compteAttenteRawValue = {
      ...this.getFormDefaults(),
      ...compteAttente,
    };
    return new FormGroup<CompteAttenteFormGroupContent>({
      id: new FormControl(
        { value: compteAttenteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numeroCompte: new FormControl(compteAttenteRawValue.numeroCompte),
      nom: new FormControl(compteAttenteRawValue.nom),
      description: new FormControl(compteAttenteRawValue.description),
      compte: new FormControl(compteAttenteRawValue.compte),
    });
  }

  getCompteAttente(form: CompteAttenteFormGroup): ICompteAttente | NewCompteAttente {
    return form.getRawValue() as ICompteAttente | NewCompteAttente;
  }

  resetForm(form: CompteAttenteFormGroup, compteAttente: CompteAttenteFormGroupInput): void {
    const compteAttenteRawValue = { ...this.getFormDefaults(), ...compteAttente };
    form.reset(
      {
        ...compteAttenteRawValue,
        id: { value: compteAttenteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CompteAttenteFormDefaults {
    return {
      id: null,
    };
  }
}
