import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompteTransfert } from '../compte-transfert.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../compte-transfert.test-samples';

import { CompteTransfertService } from './compte-transfert.service';

const requireRestSample: ICompteTransfert = {
  ...sampleWithRequiredData,
};

describe('CompteTransfert Service', () => {
  let service: CompteTransfertService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompteTransfert | ICompteTransfert[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompteTransfertService);
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

    it('should create a CompteTransfert', () => {
      const compteTransfert = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(compteTransfert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompteTransfert', () => {
      const compteTransfert = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(compteTransfert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompteTransfert', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompteTransfert', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompteTransfert', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompteTransfertToCollectionIfMissing', () => {
      it('should add a CompteTransfert to an empty array', () => {
        const compteTransfert: ICompteTransfert = sampleWithRequiredData;
        expectedResult = service.addCompteTransfertToCollectionIfMissing([], compteTransfert);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compteTransfert);
      });

      it('should not add a CompteTransfert to an array that contains it', () => {
        const compteTransfert: ICompteTransfert = sampleWithRequiredData;
        const compteTransfertCollection: ICompteTransfert[] = [
          {
            ...compteTransfert,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompteTransfertToCollectionIfMissing(compteTransfertCollection, compteTransfert);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompteTransfert to an array that doesn't contain it", () => {
        const compteTransfert: ICompteTransfert = sampleWithRequiredData;
        const compteTransfertCollection: ICompteTransfert[] = [sampleWithPartialData];
        expectedResult = service.addCompteTransfertToCollectionIfMissing(compteTransfertCollection, compteTransfert);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compteTransfert);
      });

      it('should add only unique CompteTransfert to an array', () => {
        const compteTransfertArray: ICompteTransfert[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const compteTransfertCollection: ICompteTransfert[] = [sampleWithRequiredData];
        expectedResult = service.addCompteTransfertToCollectionIfMissing(compteTransfertCollection, ...compteTransfertArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const compteTransfert: ICompteTransfert = sampleWithRequiredData;
        const compteTransfert2: ICompteTransfert = sampleWithPartialData;
        expectedResult = service.addCompteTransfertToCollectionIfMissing([], compteTransfert, compteTransfert2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compteTransfert);
        expect(expectedResult).toContain(compteTransfert2);
      });

      it('should accept null and undefined values', () => {
        const compteTransfert: ICompteTransfert = sampleWithRequiredData;
        expectedResult = service.addCompteTransfertToCollectionIfMissing([], null, compteTransfert, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compteTransfert);
      });

      it('should return initial array if no CompteTransfert is added', () => {
        const compteTransfertCollection: ICompteTransfert[] = [sampleWithRequiredData];
        expectedResult = service.addCompteTransfertToCollectionIfMissing(compteTransfertCollection, undefined, null);
        expect(expectedResult).toEqual(compteTransfertCollection);
      });
    });

    describe('compareCompteTransfert', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompteTransfert(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompteTransfert(entity1, entity2);
        const compareResult2 = service.compareCompteTransfert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompteTransfert(entity1, entity2);
        const compareResult2 = service.compareCompteTransfert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompteTransfert(entity1, entity2);
        const compareResult2 = service.compareCompteTransfert(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
