import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IClassComptable, NewClassComptable } from '../class-comptable.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClassComptable for edit and NewClassComptableFormGroupInput for create.
 */
type ClassComptableFormGroupInput = IClassComptable | PartialWithRequiredKeyOf<NewClassComptable>;

type ClassComptableFormDefaults = Pick<NewClassComptable, 'id'>;

type ClassComptableFormGroupContent = {
  id: FormControl<IClassComptable['id'] | NewClassComptable['id']>;
  nom: FormControl<IClassComptable['nom']>;
  description: FormControl<IClassComptable['description']>;
  compte: FormControl<IClassComptable['compte']>;
};

export type ClassComptableFormGroup = FormGroup<ClassComptableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClassComptableFormService {
  createClassComptableFormGroup(classComptable: ClassComptableFormGroupInput = { id: null }): ClassComptableFormGroup {
    const classComptableRawValue = {
      ...this.getFormDefaults(),
      ...classComptable,
    };
    return new FormGroup<ClassComptableFormGroupContent>({
      id: new FormControl(
        { value: classComptableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(classComptableRawValue.nom, {
        validators: [Validators.required],
      }),
      description: new FormControl(classComptableRawValue.description),
      compte: new FormControl(classComptableRawValue.compte),
    });
  }

  getClassComptable(form: ClassComptableFormGroup): IClassComptable | NewClassComptable {
    return form.getRawValue() as IClassComptable | NewClassComptable;
  }

  resetForm(form: ClassComptableFormGroup, classComptable: ClassComptableFormGroupInput): void {
    const classComptableRawValue = { ...this.getFormDefaults(), ...classComptable };
    form.reset(
      {
        ...classComptableRawValue,
        id: { value: classComptableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClassComptableFormDefaults {
    return {
      id: null,
    };
  }
}
