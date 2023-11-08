import dayjs from 'dayjs/esm';
import { IResultat } from 'app/entities/resultat/resultat.model';

export interface ICompteDeResultat {
  id: number;
  exercice?: dayjs.Dayjs | null;
  produitsTotal?: number | null;
  chargesTotal?: number | null;
  resultatNet?: number | null;
  resultat?: Pick<IResultat, 'id'> | null;
}

export type NewCompteDeResultat = Omit<ICompteDeResultat, 'id'> & { id: null };
