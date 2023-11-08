import { IClassComptable, NewClassComptable } from './class-comptable.model';

export const sampleWithRequiredData: IClassComptable = {
  id: 31191,
  nom: 'équipe de recherche',
};

export const sampleWithPartialData: IClassComptable = {
  id: 19168,
  nom: 'mélancolique pour que',
};

export const sampleWithFullData: IClassComptable = {
  id: 7867,
  nom: 'psitt dès que',
  description: 'insipide pendant puisque',
};

export const sampleWithNewData: NewClassComptable = {
  nom: 'tantôt au-dedans de',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
