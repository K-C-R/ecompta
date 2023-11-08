import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRapportsPersonnalises, NewRapportsPersonnalises } from '../rapports-personnalises.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRapportsPersonnalises for edit and NewRapportsPersonnalisesFormGroupInput for create.
 */
type RapportsPersonnalisesFormGroupInput = IRapportsPersonnalises | PartialWithRequiredKeyOf<NewRapportsPersonnalises>;

type RapportsPersonnalisesFormDefaults = Pick<NewRapportsPersonnalises, 'id'>;

type RapportsPersonnalisesFormGroupContent = {
  id: FormControl<IRapportsPersonnalises['id'] | NewRapportsPersonnalises['id']>;
  nom: FormControl<IRapportsPersonnalises['nom']>;
  description: FormControl<IRapportsPersonnalises['description']>;
  contenu: FormControl<IRapportsPersonnalises['contenu']>;
};

export type RapportsPersonnalisesFormGroup = FormGroup<RapportsPersonnalisesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RapportsPersonnalisesFormService {
  createRapportsPersonnalisesFormGroup(
    rapportsPersonnalises: RapportsPersonnalisesFormGroupInput = { id: null },
  ): RapportsPersonnalisesFormGroup {
    const rapportsPersonnalisesRawValue = {
      ...this.getFormDefaults(),
      ...rapportsPersonnalises,
    };
    return new FormGroup<RapportsPersonnalisesFormGroupContent>({
      id: new FormControl(
        { value: rapportsPersonnalisesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(rapportsPersonnalisesRawValue.nom),
      description: new FormControl(rapportsPersonnalisesRawValue.description),
      contenu: new FormControl(rapportsPersonnalisesRawValue.contenu),
    });
  }

  getRapportsPersonnalises(form: RapportsPersonnalisesFormGroup): IRapportsPersonnalises | NewRapportsPersonnalises {
    return form.getRawValue() as IRapportsPersonnalises | NewRapportsPersonnalises;
  }

  resetForm(form: RapportsPersonnalisesFormGroup, rapportsPersonnalises: RapportsPersonnalisesFormGroupInput): void {
    const rapportsPersonnalisesRawValue = { ...this.getFormDefaults(), ...rapportsPersonnalises };
    form.reset(
      {
        ...rapportsPersonnalisesRawValue,
        id: { value: rapportsPersonnalisesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RapportsPersonnalisesFormDefaults {
    return {
      id: null,
    };
  }
}
