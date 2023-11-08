import { ICompteAttente, NewCompteAttente } from './compte-attente.model';

export const sampleWithRequiredData: ICompteAttente = {
  id: 26015,
};

export const sampleWithPartialData: ICompteAttente = {
  id: 17910,
  numeroCompte: 'naguère ouah pourvu que',
  nom: 'carrément chef',
  description: 'efficace cadre',
};

export const sampleWithFullData: ICompteAttente = {
  id: 19543,
  numeroCompte: 'après spécialiste tenter',
  nom: 'après que derrière sauvage',
  description: 'divinement',
};

export const sampleWithNewData: NewCompteAttente = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
