import dayjs from 'dayjs/esm';

import { IBalance, NewBalance } from './balance.model';

export const sampleWithRequiredData: IBalance = {
  id: 1414,
  date: dayjs('2023-10-23T09:21'),
};

export const sampleWithPartialData: IBalance = {
  id: 14880,
  date: dayjs('2023-10-23T07:30'),
  description: 'croâ sombre répondre',
};

export const sampleWithFullData: IBalance = {
  id: 14251,
  date: dayjs('2023-10-23T08:14'),
  description: 'commis doucement alentour',
  totalsActifs: 16959,
  totalPassifs: 4660,
};

export const sampleWithNewData: NewBalance = {
  date: dayjs('2023-10-23T17:13'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
