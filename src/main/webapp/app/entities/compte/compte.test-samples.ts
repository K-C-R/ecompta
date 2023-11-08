import { ICompte, NewCompte } from './compte.model';

export const sampleWithRequiredData: ICompte = {
  id: 480,
};

export const sampleWithPartialData: ICompte = {
  id: 25160,
  description: 'rédaction tant que ronfler',
};

export const sampleWithFullData: ICompte = {
  id: 15422,
  numeroCompte: 'vis-à-vie de',
  nom: 'rose grrr',
  description: 'commissionnaire accompagner',
  cloture: true,
};

export const sampleWithNewData: NewCompte = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
