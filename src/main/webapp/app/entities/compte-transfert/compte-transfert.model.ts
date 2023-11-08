import { ICompte } from 'app/entities/compte/compte.model';

export interface ICompteTransfert {
  id: number;
  numeroCompte?: string | null;
  nom?: string | null;
  description?: string | null;
  compte?: Pick<ICompte, 'id'> | null;
}

export type NewCompteTransfert = Omit<ICompteTransfert, 'id'> & { id: null };
