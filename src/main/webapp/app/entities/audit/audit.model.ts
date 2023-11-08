import dayjs from 'dayjs/esm';
import { ICompte } from 'app/entities/compte/compte.model';

export interface IAudit {
  id: number;
  date?: dayjs.Dayjs | null;
  action?: string | null;
  entiteModifiee?: string | null;
  utilisateur?: string | null;
  compte?: Pick<ICompte, 'id' | 'numeroCompte'> | null;
}

export type NewAudit = Omit<IAudit, 'id'> & { id: null };
