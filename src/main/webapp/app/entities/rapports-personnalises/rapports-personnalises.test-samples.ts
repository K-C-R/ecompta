import { IRapportsPersonnalises, NewRapportsPersonnalises } from './rapports-personnalises.model';

export const sampleWithRequiredData: IRapportsPersonnalises = {
  id: 9948,
};

export const sampleWithPartialData: IRapportsPersonnalises = {
  id: 16196,
};

export const sampleWithFullData: IRapportsPersonnalises = {
  id: 8322,
  nom: 'étant donné que',
  description: 'auparavant complètement',
  contenu: 'taire',
};

export const sampleWithNewData: NewRapportsPersonnalises = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
