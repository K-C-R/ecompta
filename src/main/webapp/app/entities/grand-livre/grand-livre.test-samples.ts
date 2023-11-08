import dayjs from 'dayjs/esm';

import { IGrandLivre, NewGrandLivre } from './grand-livre.model';

export const sampleWithRequiredData: IGrandLivre = {
  id: 29184,
  date: dayjs('2023-10-22T23:12'),
};

export const sampleWithPartialData: IGrandLivre = {
  id: 3232,
  date: dayjs('2023-10-23T01:21'),
};

export const sampleWithFullData: IGrandLivre = {
  id: 6565,
  date: dayjs('2023-10-23T22:00'),
  description: 'grandement',
  montant: 8412,
  reference: 'vu que malade',
};

export const sampleWithNewData: NewGrandLivre = {
  date: dayjs('2023-10-23T07:33'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
