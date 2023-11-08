import { ICompte } from 'app/entities/compte/compte.model';

export interface ICompteAttente {
  id: number;
  numeroCompte?: string | null;
  nom?: string | null;
  description?: string | null;
  compte?: Pick<ICompte, 'id'> | null;
}

export type NewCompteAttente = Omit<ICompteAttente, 'id'> & { id: null };
