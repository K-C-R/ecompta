import dayjs from 'dayjs/esm';

export interface IBalance {
  id: number;
  date?: dayjs.Dayjs | null;
  description?: string | null;
  totalsActifs?: number | null;
  totalPassifs?: number | null;
}

export type NewBalance = Omit<IBalance, 'id'> & { id: null };
