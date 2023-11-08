import dayjs from 'dayjs/esm';

import { ICompteDeResultat, NewCompteDeResultat } from './compte-de-resultat.model';

export const sampleWithRequiredData: ICompteDeResultat = {
  id: 27427,
};

export const sampleWithPartialData: ICompteDeResultat = {
  id: 803,
  exercice: dayjs('2023-10-20T09:35'),
  produitsTotal: 2890,
  chargesTotal: 10799,
  resultatNet: 15824,
};

export const sampleWithFullData: ICompteDeResultat = {
  id: 5092,
  exercice: dayjs('2023-10-20T21:42'),
  produitsTotal: 14347,
  chargesTotal: 1016,
  resultatNet: 2116,
};

export const sampleWithNewData: NewCompteDeResultat = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
