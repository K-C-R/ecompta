import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResultat } from '../resultat.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../resultat.test-samples';

import { ResultatService, RestResultat } from './resultat.service';

const requireRestSample: RestResultat = {
  ...sampleWithRequiredData,
  exercice: sampleWithRequiredData.exercice?.toJSON(),
};

describe('Resultat Service', () => {
  let service: ResultatService;
  let httpMock: HttpTestingController;
  let expectedResult: IResultat | IResultat[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ResultatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Resultat', () => {
      const resultat = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(resultat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Resultat', () => {
      const resultat = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(resultat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Resultat', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Resultat', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Resultat', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addResultatToCollectionIfMissing', () => {
      it('should add a Resultat to an empty array', () => {
        const resultat: IResultat = sampleWithRequiredData;
        expectedResult = service.addResultatToCollectionIfMissing([], resultat);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resultat);
      });

      it('should not add a Resultat to an array that contains it', () => {
        const resultat: IResultat = sampleWithRequiredData;
        const resultatCollection: IResultat[] = [
          {
            ...resultat,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addResultatToCollectionIfMissing(resultatCollection, resultat);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Resultat to an array that doesn't contain it", () => {
        const resultat: IResultat = sampleWithRequiredData;
        const resultatCollection: IResultat[] = [sampleWithPartialData];
        expectedResult = service.addResultatToCollectionIfMissing(resultatCollection, resultat);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resultat);
      });

      it('should add only unique Resultat to an array', () => {
        const resultatArray: IResultat[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const resultatCollection: IResultat[] = [sampleWithRequiredData];
        expectedResult = service.addResultatToCollectionIfMissing(resultatCollection, ...resultatArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const resultat: IResultat = sampleWithRequiredData;
        const resultat2: IResultat = sampleWithPartialData;
        expectedResult = service.addResultatToCollectionIfMissing([], resultat, resultat2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resultat);
        expect(expectedResult).toContain(resultat2);
      });

      it('should accept null and undefined values', () => {
        const resultat: IResultat = sampleWithRequiredData;
        expectedResult = service.addResultatToCollectionIfMissing([], null, resultat, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resultat);
      });

      it('should return initial array if no Resultat is added', () => {
        const resultatCollection: IResultat[] = [sampleWithRequiredData];
        expectedResult = service.addResultatToCollectionIfMissing(resultatCollection, undefined, null);
        expect(expectedResult).toEqual(resultatCollection);
      });
    });

    describe('compareResultat', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareResultat(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareResultat(entity1, entity2);
        const compareResult2 = service.compareResultat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareResultat(entity1, entity2);
        const compareResult2 = service.compareResultat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareResultat(entity1, entity2);
        const compareResult2 = service.compareResultat(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
