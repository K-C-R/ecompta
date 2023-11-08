import dayjs from 'dayjs/esm';
import { ICompte } from 'app/entities/compte/compte.model';
import { IPieceComptable } from 'app/entities/piece-comptable/piece-comptable.model';

export interface ITransaction {
  id: number;
  date?: dayjs.Dayjs | null;
  libelle?: string | null;
  montant?: number | null;
  pieceComptables?: Pick<IPieceComptable, 'id'>[] | null;
  compteCrediter?: Pick<ICompte, 'id' | 'nom'> | null;
  compteDebiter?: Pick<ICompte, 'id' | 'nom'> | null;
}

export type NewTransaction = Omit<ITransaction, 'id'> & { id: null };
