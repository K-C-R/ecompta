import { ISoldeComptable, NewSoldeComptable } from './solde-comptable.model';

export const sampleWithRequiredData: ISoldeComptable = {
  id: 1675,
};

export const sampleWithPartialData: ISoldeComptable = {
  id: 19938,
  solde: 8541,
};

export const sampleWithFullData: ISoldeComptable = {
  id: 12728,
  solde: 32099,
};

export const sampleWithNewData: NewSoldeComptable = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
