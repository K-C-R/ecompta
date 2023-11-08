import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBilan } from '../bilan.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../bilan.test-samples';

import { BilanService, RestBilan } from './bilan.service';

const requireRestSample: RestBilan = {
  ...sampleWithRequiredData,
  exercice: sampleWithRequiredData.exercice?.toJSON(),
};

describe('Bilan Service', () => {
  let service: BilanService;
  let httpMock: HttpTestingController;
  let expectedResult: IBilan | IBilan[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BilanService);
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

    it('should create a Bilan', () => {
      const bilan = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bilan).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bilan', () => {
      const bilan = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bilan).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bilan', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bilan', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Bilan', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBilanToCollectionIfMissing', () => {
      it('should add a Bilan to an empty array', () => {
        const bilan: IBilan = sampleWithRequiredData;
        expectedResult = service.addBilanToCollectionIfMissing([], bilan);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bilan);
      });

      it('should not add a Bilan to an array that contains it', () => {
        const bilan: IBilan = sampleWithRequiredData;
        const bilanCollection: IBilan[] = [
          {
            ...bilan,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBilanToCollectionIfMissing(bilanCollection, bilan);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bilan to an array that doesn't contain it", () => {
        const bilan: IBilan = sampleWithRequiredData;
        const bilanCollection: IBilan[] = [sampleWithPartialData];
        expectedResult = service.addBilanToCollectionIfMissing(bilanCollection, bilan);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bilan);
      });

      it('should add only unique Bilan to an array', () => {
        const bilanArray: IBilan[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bilanCollection: IBilan[] = [sampleWithRequiredData];
        expectedResult = service.addBilanToCollectionIfMissing(bilanCollection, ...bilanArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bilan: IBilan = sampleWithRequiredData;
        const bilan2: IBilan = sampleWithPartialData;
        expectedResult = service.addBilanToCollectionIfMissing([], bilan, bilan2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bilan);
        expect(expectedResult).toContain(bilan2);
      });

      it('should accept null and undefined values', () => {
        const bilan: IBilan = sampleWithRequiredData;
        expectedResult = service.addBilanToCollectionIfMissing([], null, bilan, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bilan);
      });

      it('should return initial array if no Bilan is added', () => {
        const bilanCollection: IBilan[] = [sampleWithRequiredData];
        expectedResult = service.addBilanToCollectionIfMissing(bilanCollection, undefined, null);
        expect(expectedResult).toEqual(bilanCollection);
      });
    });

    describe('compareBilan', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBilan(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBilan(entity1, entity2);
        const compareResult2 = service.compareBilan(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBilan(entity1, entity2);
        const compareResult2 = service.compareBilan(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBilan(entity1, entity2);
        const compareResult2 = service.compareBilan(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
