import { IBilan } from 'app/entities/bilan/bilan.model';
import { IPieceComptable } from 'app/entities/piece-comptable/piece-comptable.model';

export interface ICompte {
  id: number;
  numeroCompte?: string | null;
  nom?: string | null;
  description?: string | null;
  cloture?: boolean | null;
  bilan?: Pick<IBilan, 'id'> | null;
  pieceComptables?: Pick<IPieceComptable, 'id'>[] | null;
}

export type NewCompte = Omit<ICompte, 'id'> & { id: null };
