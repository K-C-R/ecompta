import { ICompteTransfert, NewCompteTransfert } from './compte-transfert.model';

export const sampleWithRequiredData: ICompteTransfert = {
  id: 26053,
};

export const sampleWithPartialData: ICompteTransfert = {
  id: 31189,
  nom: 'avare',
};

export const sampleWithFullData: ICompteTransfert = {
  id: 20227,
  numeroCompte: 'outre antique',
  nom: 'paf également différencier',
  description: 'en decà de de crainte que',
};

export const sampleWithNewData: NewCompteTransfert = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
