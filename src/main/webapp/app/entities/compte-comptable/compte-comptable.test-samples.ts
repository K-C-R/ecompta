import { ICompteComptable, NewCompteComptable } from './compte-comptable.model';

export const sampleWithRequiredData: ICompteComptable = {
  id: 21310,
  nom: 'quand ? aussitôt que',
};

export const sampleWithPartialData: ICompteComptable = {
  id: 5869,
  nom: 'à condition que',
  description: 'sédentaire',
};

export const sampleWithFullData: ICompteComptable = {
  id: 9307,
  numero: 20951,
  nom: 'rédaction',
  description: 'sauf de sorte que réagir',
};

export const sampleWithNewData: NewCompteComptable = {
  nom: 'broum',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
