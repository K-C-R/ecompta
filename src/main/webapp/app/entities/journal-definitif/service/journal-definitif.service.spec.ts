import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJournalDefinitif } from '../journal-definitif.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../journal-definitif.test-samples';

import { JournalDefinitifService, RestJournalDefinitif } from './journal-definitif.service';

const requireRestSample: RestJournalDefinitif = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('JournalDefinitif Service', () => {
  let service: JournalDefinitifService;
  let httpMock: HttpTestingController;
  let expectedResult: IJournalDefinitif | IJournalDefinitif[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JournalDefinitifService);
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

    it('should create a JournalDefinitif', () => {
      const journalDefinitif = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(journalDefinitif).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JournalDefinitif', () => {
      const journalDefinitif = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(journalDefinitif).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JournalDefinitif', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JournalDefinitif', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JournalDefinitif', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJournalDefinitifToCollectionIfMissing', () => {
      it('should add a JournalDefinitif to an empty array', () => {
        const journalDefinitif: IJournalDefinitif = sampleWithRequiredData;
        expectedResult = service.addJournalDefinitifToCollectionIfMissing([], journalDefinitif);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(journalDefinitif);
      });

      it('should not add a JournalDefinitif to an array that contains it', () => {
        const journalDefinitif: IJournalDefinitif = sampleWithRequiredData;
        const journalDefinitifCollection: IJournalDefinitif[] = [
          {
            ...journalDefinitif,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJournalDefinitifToCollectionIfMissing(journalDefinitifCollection, journalDefinitif);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JournalDefinitif to an array that doesn't contain it", () => {
        const journalDefinitif: IJournalDefinitif = sampleWithRequiredData;
        const journalDefinitifCollection: IJournalDefinitif[] = [sampleWithPartialData];
        expectedResult = service.addJournalDefinitifToCollectionIfMissing(journalDefinitifCollection, journalDefinitif);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(journalDefinitif);
      });

      it('should add only unique JournalDefinitif to an array', () => {
        const journalDefinitifArray: IJournalDefinitif[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const journalDefinitifCollection: IJournalDefinitif[] = [sampleWithRequiredData];
        expectedResult = service.addJournalDefinitifToCollectionIfMissing(journalDefinitifCollection, ...journalDefinitifArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const journalDefinitif: IJournalDefinitif = sampleWithRequiredData;
        const journalDefinitif2: IJournalDefinitif = sampleWithPartialData;
        expectedResult = service.addJournalDefinitifToCollectionIfMissing([], journalDefinitif, journalDefinitif2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(journalDefinitif);
        expect(expectedResult).toContain(journalDefinitif2);
      });

      it('should accept null and undefined values', () => {
        const journalDefinitif: IJournalDefinitif = sampleWithRequiredData;
        expectedResult = service.addJournalDefinitifToCollectionIfMissing([], null, journalDefinitif, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(journalDefinitif);
      });

      it('should return initial array if no JournalDefinitif is added', () => {
        const journalDefinitifCollection: IJournalDefinitif[] = [sampleWithRequiredData];
        expectedResult = service.addJournalDefinitifToCollectionIfMissing(journalDefinitifCollection, undefined, null);
        expect(expectedResult).toEqual(journalDefinitifCollection);
      });
    });

    describe('compareJournalDefinitif', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJournalDefinitif(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJournalDefinitif(entity1, entity2);
        const compareResult2 = service.compareJournalDefinitif(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJournalDefinitif(entity1, entity2);
        const compareResult2 = service.compareJournalDefinitif(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJournalDefinitif(entity1, entity2);
        const compareResult2 = service.compareJournalDefinitif(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
