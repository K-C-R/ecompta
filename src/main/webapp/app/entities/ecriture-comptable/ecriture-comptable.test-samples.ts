import dayjs from 'dayjs/esm';

import { IEcritureComptable, NewEcritureComptable } from './ecriture-comptable.model';

export const sampleWithRequiredData: IEcritureComptable = {
  id: 1725,
  date: dayjs('2023-10-21T09:44'),
  montant: 26604,
  typeEcriture: 'CLOTURE',
};

export const sampleWithPartialData: IEcritureComptable = {
  id: 29596,
  date: dayjs('2023-10-21T04:56'),
  montant: 21187,
  libelle: 'glouglou',
  typeEcriture: 'CLOTURE',
  autreInfos: 'gens jusque',
  pieces: 'spécialiste pin-pon',
};

export const sampleWithFullData: IEcritureComptable = {
  id: 1578,
  date: dayjs('2023-10-21T18:28'),
  montant: 25181,
  libelle: 'du fait que quand',
  typeEcriture: 'CLOTURE',
  reference: 'membre à vie en dehors de dans la mesure où',
  autreInfos: 'dissocier gestionnaire chef',
  pieces: 'incognito plus',
};

export const sampleWithNewData: NewEcritureComptable = {
  date: dayjs('2023-10-21T09:01'),
  montant: 20481,
  typeEcriture: 'CLOTURE',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
