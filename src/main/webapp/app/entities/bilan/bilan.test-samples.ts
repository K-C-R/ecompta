import dayjs from 'dayjs/esm';

import { IBilan, NewBilan } from './bilan.model';

export const sampleWithRequiredData: IBilan = {
  id: 26362,
};

export const sampleWithPartialData: IBilan = {
  id: 15476,
  actifTotal: 30862,
};

export const sampleWithFullData: IBilan = {
  id: 16102,
  exercice: dayjs('2023-10-20T17:53'),
  actifTotal: 5551,
  passifTotal: 3126,
};

export const sampleWithNewData: NewBilan = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
