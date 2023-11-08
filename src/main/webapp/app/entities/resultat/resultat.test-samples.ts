import dayjs from 'dayjs/esm';

import { IResultat, NewResultat } from './resultat.model';

export const sampleWithRequiredData: IResultat = {
  id: 8981,
};

export const sampleWithPartialData: IResultat = {
  id: 32238,
};

export const sampleWithFullData: IResultat = {
  id: 30905,
  exercice: dayjs('2023-10-21T00:48'),
  resultatNet: 29003,
};

export const sampleWithNewData: NewResultat = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
