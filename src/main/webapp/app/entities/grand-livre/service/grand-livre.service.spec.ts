import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrandLivre } from '../grand-livre.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../grand-livre.test-samples';

import { GrandLivreService, RestGrandLivre } from './grand-livre.service';

const requireRestSample: RestGrandLivre = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('GrandLivre Service', () => {
  let service: GrandLivreService;
  let httpMock: HttpTestingController;
  let expectedResult: IGrandLivre | IGrandLivre[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrandLivreService);
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

    it('should create a GrandLivre', () => {
      const grandLivre = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(grandLivre).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GrandLivre', () => {
      const grandLivre = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(grandLivre).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GrandLivre', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GrandLivre', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GrandLivre', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGrandLivreToCollectionIfMissing', () => {
      it('should add a GrandLivre to an empty array', () => {
        const grandLivre: IGrandLivre = sampleWithRequiredData;
        expectedResult = service.addGrandLivreToCollectionIfMissing([], grandLivre);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grandLivre);
      });

      it('should not add a GrandLivre to an array that contains it', () => {
        const grandLivre: IGrandLivre = sampleWithRequiredData;
        const grandLivreCollection: IGrandLivre[] = [
          {
            ...grandLivre,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGrandLivreToCollectionIfMissing(grandLivreCollection, grandLivre);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GrandLivre to an array that doesn't contain it", () => {
        const grandLivre: IGrandLivre = sampleWithRequiredData;
        const grandLivreCollection: IGrandLivre[] = [sampleWithPartialData];
        expectedResult = service.addGrandLivreToCollectionIfMissing(grandLivreCollection, grandLivre);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grandLivre);
      });

      it('should add only unique GrandLivre to an array', () => {
        const grandLivreArray: IGrandLivre[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const grandLivreCollection: IGrandLivre[] = [sampleWithRequiredData];
        expectedResult = service.addGrandLivreToCollectionIfMissing(grandLivreCollection, ...grandLivreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grandLivre: IGrandLivre = sampleWithRequiredData;
        const grandLivre2: IGrandLivre = sampleWithPartialData;
        expectedResult = service.addGrandLivreToCollectionIfMissing([], grandLivre, grandLivre2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grandLivre);
        expect(expectedResult).toContain(grandLivre2);
      });

      it('should accept null and undefined values', () => {
        const grandLivre: IGrandLivre = sampleWithRequiredData;
        expectedResult = service.addGrandLivreToCollectionIfMissing([], null, grandLivre, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grandLivre);
      });

      it('should return initial array if no GrandLivre is added', () => {
        const grandLivreCollection: IGrandLivre[] = [sampleWithRequiredData];
        expectedResult = service.addGrandLivreToCollectionIfMissing(grandLivreCollection, undefined, null);
        expect(expectedResult).toEqual(grandLivreCollection);
      });
    });

    describe('compareGrandLivre', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGrandLivre(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGrandLivre(entity1, entity2);
        const compareResult2 = service.compareGrandLivre(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGrandLivre(entity1, entity2);
        const compareResult2 = service.compareGrandLivre(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGrandLivre(entity1, entity2);
        const compareResult2 = service.compareGrandLivre(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
