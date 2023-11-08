import { ICompte } from 'app/entities/compte/compte.model';

export interface ISoldeComptable {
  id: number;
  solde?: number | null;
  compte?: Pick<ICompte, 'id'> | null;
}

export type NewSoldeComptable = Omit<ISoldeComptable, 'id'> & { id: null };
