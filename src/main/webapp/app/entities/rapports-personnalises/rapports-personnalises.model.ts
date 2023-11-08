export interface IRapportsPersonnalises {
  id: number;
  nom?: string | null;
  description?: string | null;
  contenu?: string | null;
}

export type NewRapportsPersonnalises = Omit<IRapportsPersonnalises, 'id'> & { id: null };
