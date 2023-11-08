import dayjs from 'dayjs/esm';

import { IPieceComptable, NewPieceComptable } from './piece-comptable.model';

export const sampleWithRequiredData: IPieceComptable = {
  id: 21531,
};

export const sampleWithPartialData: IPieceComptable = {
  id: 2183,
  numeroPiece: 'énergique',
  description: 'cuicui buter',
};

export const sampleWithFullData: IPieceComptable = {
  id: 16753,
  numeroPiece: 'intéresser pour contre',
  datePiece: dayjs('2023-10-20T05:16'),
  description: 'puis',
};

export const sampleWithNewData: NewPieceComptable = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
