import dayjs from 'dayjs/esm';
import { ICompte } from 'app/entities/compte/compte.model';
import { ITransaction } from 'app/entities/transaction/transaction.model';

export interface IPieceComptable {
  id: number;
  numeroPiece?: string | null;
  datePiece?: dayjs.Dayjs | null;
  description?: string | null;
  comptes?: Pick<ICompte, 'id'>[] | null;
  transactions?: Pick<ITransaction, 'id'>[] | null;
}

export type NewPieceComptable = Omit<IPieceComptable, 'id'> & { id: null };
