import dayjs from 'dayjs/esm';

export interface IResultat {
  id: number;
  exercice?: dayjs.Dayjs | null;
  resultatNet?: number | null;
}

export type NewResultat = Omit<IResultat, 'id'> & { id: null };
