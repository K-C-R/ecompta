import dayjs from 'dayjs/esm';

import { IJournalDefinitif, NewJournalDefinitif } from './journal-definitif.model';

export const sampleWithRequiredData: IJournalDefinitif = {
  id: 24943,
  date: dayjs('2023-10-23T22:13'),
};

export const sampleWithPartialData: IJournalDefinitif = {
  id: 25640,
  date: dayjs('2023-10-23T13:41'),
  description: 'membre du personnel main-d’œuvre déposer',
  montant: 22515,
  reference: 'chef sous',
};

export const sampleWithFullData: IJournalDefinitif = {
  id: 27212,
  date: dayjs('2023-10-23T12:56'),
  description: 'tsoin-tsoin',
  montant: 1029,
  reference: 'badaboum raisonner',
};

export const sampleWithNewData: NewJournalDefinitif = {
  date: dayjs('2023-10-23T12:58'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
