import { ICompte } from 'app/entities/compte/compte.model';

export interface IClassComptable {
  id: number;
  nom?: string | null;
  description?: string | null;
  compte?: Pick<ICompte, 'id'> | null;
}

export type NewClassComptable = Omit<IClassComptable, 'id'> & { id: null };
