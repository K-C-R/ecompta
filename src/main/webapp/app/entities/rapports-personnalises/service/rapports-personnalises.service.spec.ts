import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRapportsPersonnalises } from '../rapports-personnalises.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../rapports-personnalises.test-samples';

import { RapportsPersonnalisesService } from './rapports-personnalises.service';

const requireRestSample: IRapportsPersonnalises = {
  ...sampleWithRequiredData,
};

describe('RapportsPersonnalises Service', () => {
  let service: RapportsPersonnalisesService;
  let httpMock: HttpTestingController;
  let expectedResult: IRapportsPersonnalises | IRapportsPersonnalises[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RapportsPersonnalisesService);
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

    it('should create a RapportsPersonnalises', () => {
      const rapportsPersonnalises = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(rapportsPersonnalises).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RapportsPersonnalises', () => {
      const rapportsPersonnalises = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(rapportsPersonnalises).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RapportsPersonnalises', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RapportsPersonnalises', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RapportsPersonnalises', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRapportsPersonnalisesToCollectionIfMissing', () => {
      it('should add a RapportsPersonnalises to an empty array', () => {
        const rapportsPersonnalises: IRapportsPersonnalises = sampleWithRequiredData;
        expectedResult = service.addRapportsPersonnalisesToCollectionIfMissing([], rapportsPersonnalises);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rapportsPersonnalises);
      });

      it('should not add a RapportsPersonnalises to an array that contains it', () => {
        const rapportsPersonnalises: IRapportsPersonnalises = sampleWithRequiredData;
        const rapportsPersonnalisesCollection: IRapportsPersonnalises[] = [
          {
            ...rapportsPersonnalises,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRapportsPersonnalisesToCollectionIfMissing(rapportsPersonnalisesCollection, rapportsPersonnalises);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RapportsPersonnalises to an array that doesn't contain it", () => {
        const rapportsPersonnalises: IRapportsPersonnalises = sampleWithRequiredData;
        const rapportsPersonnalisesCollection: IRapportsPersonnalises[] = [sampleWithPartialData];
        expectedResult = service.addRapportsPersonnalisesToCollectionIfMissing(rapportsPersonnalisesCollection, rapportsPersonnalises);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rapportsPersonnalises);
      });

      it('should add only unique RapportsPersonnalises to an array', () => {
        const rapportsPersonnalisesArray: IRapportsPersonnalises[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const rapportsPersonnalisesCollection: IRapportsPersonnalises[] = [sampleWithRequiredData];
        expectedResult = service.addRapportsPersonnalisesToCollectionIfMissing(
          rapportsPersonnalisesCollection,
          ...rapportsPersonnalisesArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rapportsPersonnalises: IRapportsPersonnalises = sampleWithRequiredData;
        const rapportsPersonnalises2: IRapportsPersonnalises = sampleWithPartialData;
        expectedResult = service.addRapportsPersonnalisesToCollectionIfMissing([], rapportsPersonnalises, rapportsPersonnalises2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rapportsPersonnalises);
        expect(expectedResult).toContain(rapportsPersonnalises2);
      });

      it('should accept null and undefined values', () => {
        const rapportsPersonnalises: IRapportsPersonnalises = sampleWithRequiredData;
        expectedResult = service.addRapportsPersonnalisesToCollectionIfMissing([], null, rapportsPersonnalises, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rapportsPersonnalises);
      });

      it('should return initial array if no RapportsPersonnalises is added', () => {
        const rapportsPersonnalisesCollection: IRapportsPersonnalises[] = [sampleWithRequiredData];
        expectedResult = service.addRapportsPersonnalisesToCollectionIfMissing(rapportsPersonnalisesCollection, undefined, null);
        expect(expectedResult).toEqual(rapportsPersonnalisesCollection);
      });
    });

    describe('compareRapportsPersonnalises', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRapportsPersonnalises(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRapportsPersonnalises(entity1, entity2);
        const compareResult2 = service.compareRapportsPersonnalises(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRapportsPersonnalises(entity1, entity2);
        const compareResult2 = service.compareRapportsPersonnalises(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRapportsPersonnalises(entity1, entity2);
        const compareResult2 = service.compareRapportsPersonnalises(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
