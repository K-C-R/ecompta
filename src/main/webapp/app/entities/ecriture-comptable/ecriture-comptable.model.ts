import dayjs from 'dayjs/esm';
import { ICompte } from 'app/entities/compte/compte.model';
import { TypeEcriture } from 'app/entities/enumerations/type-ecriture.model';

export interface IEcritureComptable {
  id: number;
  date?: dayjs.Dayjs | null;
  montant?: number | null;
  libelle?: string | null;
  typeEcriture?: keyof typeof TypeEcriture | null;
  reference?: string | null;
  autreInfos?: string | null;
  pieces?: string | null;
  compte?: Pick<ICompte, 'id'> | null;
}

export type NewEcritureComptable = Omit<IEcritureComptable, 'id'> & { id: null };
