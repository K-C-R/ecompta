export interface ICompteComptable {
  id: number;
  numero?: number | null;
  nom?: string | null;
  description?: string | null;
}

export type NewCompteComptable = Omit<ICompteComptable, 'id'> & { id: null };
