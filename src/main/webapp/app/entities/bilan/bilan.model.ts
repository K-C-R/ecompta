import dayjs from 'dayjs/esm';

export interface IBilan {
  id: number;
  exercice?: dayjs.Dayjs | null;
  actifTotal?: number | null;
  passifTotal?: number | null;
}

export type NewBilan = Omit<IBilan, 'id'> & { id: null };
