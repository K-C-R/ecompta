import dayjs from 'dayjs/esm';

import { ITransaction, NewTransaction } from './transaction.model';

export const sampleWithRequiredData: ITransaction = {
  id: 27457,
};

export const sampleWithPartialData: ITransaction = {
  id: 25959,
  date: dayjs('2023-10-20T05:27'),
  libelle: 'du fait que aux environs de',
  montant: 9173,
};

export const sampleWithFullData: ITransaction = {
  id: 25222,
  date: dayjs('2023-10-20T03:31'),
  libelle: 'magenta ouin de',
  montant: 5864,
};

export const sampleWithNewData: NewTransaction = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
