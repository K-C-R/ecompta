import dayjs from 'dayjs/esm';
import { ICompte } from 'app/entities/compte/compte.model';
import { IBalance } from 'app/entities/balance/balance.model';

export interface IJournalDefinitif {
  id: number;
  date?: dayjs.Dayjs | null;
  description?: string | null;
  montant?: number | null;
  reference?: string | null;
  compte?: Pick<ICompte, 'id'> | null;
  balance?: Pick<IBalance, 'id'> | null;
}

export type NewJournalDefinitif = Omit<IJournalDefinitif, 'id'> & { id: null };
