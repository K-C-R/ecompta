import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompteDeResultat } from '../compte-de-resultat.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../compte-de-resultat.test-samples';

import { CompteDeResultatService, RestCompteDeResultat } from './compte-de-resultat.service';

const requireRestSample: RestCompteDeResultat = {
  ...sampleWithRequiredData,
  exercice: sampleWithRequiredData.exercice?.toJSON(),
};

describe('CompteDeResultat Service', () => {
  let service: CompteDeResultatService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompteDeResultat | ICompteDeResultat[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompteDeResultatService);
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

    it('should create a CompteDeResultat', () => {
      const compteDeResultat = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(compteDeResultat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompteDeResultat', () => {
      const compteDeResultat = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(compteDeResultat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompteDeResultat', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompteDeResultat', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompteDeResultat', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompteDeResultatToCollectionIfMissing', () => {
      it('should add a CompteDeResultat to an empty array', () => {
        const compteDeResultat: ICompteDeResultat = sampleWithRequiredData;
        expectedResult = service.addCompteDeResultatToCollectionIfMissing([], compteDeResultat);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compteDeResultat);
      });

      it('should not add a CompteDeResultat to an array that contains it', () => {
        const compteDeResultat: ICompteDeResultat = sampleWithRequiredData;
        const compteDeResultatCollection: ICompteDeResultat[] = [
          {
            ...compteDeResultat,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompteDeResultatToCollectionIfMissing(compteDeResultatCollection, compteDeResultat);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompteDeResultat to an array that doesn't contain it", () => {
        const compteDeResultat: ICompteDeResultat = sampleWithRequiredData;
        const compteDeResultatCollection: ICompteDeResultat[] = [sampleWithPartialData];
        expectedResult = service.addCompteDeResultatToCollectionIfMissing(compteDeResultatCollection, compteDeResultat);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compteDeResultat);
      });

      it('should add only unique CompteDeResultat to an array', () => {
        const compteDeResultatArray: ICompteDeResultat[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const compteDeResultatCollection: ICompteDeResultat[] = [sampleWithRequiredData];
        expectedResult = service.addCompteDeResultatToCollectionIfMissing(compteDeResultatCollection, ...compteDeResultatArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const compteDeResultat: ICompteDeResultat = sampleWithRequiredData;
        const compteDeResultat2: ICompteDeResultat = sampleWithPartialData;
        expectedResult = service.addCompteDeResultatToCollectionIfMissing([], compteDeResultat, compteDeResultat2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compteDeResultat);
        expect(expectedResult).toContain(compteDeResultat2);
      });

      it('should accept null and undefined values', () => {
        const compteDeResultat: ICompteDeResultat = sampleWithRequiredData;
        expectedResult = service.addCompteDeResultatToCollectionIfMissing([], null, compteDeResultat, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compteDeResultat);
      });

      it('should return initial array if no CompteDeResultat is added', () => {
        const compteDeResultatCollection: ICompteDeResultat[] = [sampleWithRequiredData];
        expectedResult = service.addCompteDeResultatToCollectionIfMissing(compteDeResultatCollection, undefined, null);
        expect(expectedResult).toEqual(compteDeResultatCollection);
      });
    });

    describe('compareCompteDeResultat', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompteDeResultat(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompteDeResultat(entity1, entity2);
        const compareResult2 = service.compareCompteDeResultat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompteDeResultat(entity1, entity2);
        const compareResult2 = service.compareCompteDeResultat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompteDeResultat(entity1, entity2);
        const compareResult2 = service.compareCompteDeResultat(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
