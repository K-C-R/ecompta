import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBalance } from '../balance.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../balance.test-samples';

import { BalanceService, RestBalance } from './balance.service';

const requireRestSample: RestBalance = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Balance Service', () => {
  let service: BalanceService;
  let httpMock: HttpTestingController;
  let expectedResult: IBalance | IBalance[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BalanceService);
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

    it('should create a Balance', () => {
      const balance = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(balance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Balance', () => {
      const balance = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(balance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Balance', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Balance', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Balance', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBalanceToCollectionIfMissing', () => {
      it('should add a Balance to an empty array', () => {
        const balance: IBalance = sampleWithRequiredData;
        expectedResult = service.addBalanceToCollectionIfMissing([], balance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(balance);
      });

      it('should not add a Balance to an array that contains it', () => {
        const balance: IBalance = sampleWithRequiredData;
        const balanceCollection: IBalance[] = [
          {
            ...balance,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBalanceToCollectionIfMissing(balanceCollection, balance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Balance to an array that doesn't contain it", () => {
        const balance: IBalance = sampleWithRequiredData;
        const balanceCollection: IBalance[] = [sampleWithPartialData];
        expectedResult = service.addBalanceToCollectionIfMissing(balanceCollection, balance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(balance);
      });

      it('should add only unique Balance to an array', () => {
        const balanceArray: IBalance[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const balanceCollection: IBalance[] = [sampleWithRequiredData];
        expectedResult = service.addBalanceToCollectionIfMissing(balanceCollection, ...balanceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const balance: IBalance = sampleWithRequiredData;
        const balance2: IBalance = sampleWithPartialData;
        expectedResult = service.addBalanceToCollectionIfMissing([], balance, balance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(balance);
        expect(expectedResult).toContain(balance2);
      });

      it('should accept null and undefined values', () => {
        const balance: IBalance = sampleWithRequiredData;
        expectedResult = service.addBalanceToCollectionIfMissing([], null, balance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(balance);
      });

      it('should return initial array if no Balance is added', () => {
        const balanceCollection: IBalance[] = [sampleWithRequiredData];
        expectedResult = service.addBalanceToCollectionIfMissing(balanceCollection, undefined, null);
        expect(expectedResult).toEqual(balanceCollection);
      });
    });

    describe('compareBalance', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBalance(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBalance(entity1, entity2);
        const compareResult2 = service.compareBalance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBalance(entity1, entity2);
        const compareResult2 = service.compareBalance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBalance(entity1, entity2);
        const compareResult2 = service.compareBalance(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
