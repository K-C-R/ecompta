import dayjs from 'dayjs/esm';

import { IAudit, NewAudit } from './audit.model';

export const sampleWithRequiredData: IAudit = {
  id: 19162,
};

export const sampleWithPartialData: IAudit = {
  id: 1,
  date: dayjs('2023-10-20T20:29'),
  action: 'vétuste corps enseignant triangulaire',
  utilisateur: 'au point que triangulaire biathlète',
};

export const sampleWithFullData: IAudit = {
  id: 5108,
  date: dayjs('2023-10-20T09:42'),
  action: 'crac',
  entiteModifiee: 'venger',
  utilisateur: 'circulaire',
};

export const sampleWithNewData: NewAudit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
