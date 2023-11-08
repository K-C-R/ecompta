import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompteComptable } from '../compte-comptable.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../compte-comptable.test-samples';

import { CompteComptableService } from './compte-comptable.service';

const requireRestSample: ICompteComptable = {
  ...sampleWithRequiredData,
};

describe('CompteComptable Service', () => {
  let service: CompteComptableService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompteComptable | ICompteComptable[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompteComptableService);
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

    it('should create a CompteComptable', () => {
      const compteComptable = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(compteComptable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompteComptable', () => {
      const compteComptable = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(compteComptable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompteComptable', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompteComptable', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompteComptable', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompteComptableToCollectionIfMissing', () => {
      it('should add a CompteComptable to an empty array', () => {
        const compteComptable: ICompteComptable = sampleWithRequiredData;
        expectedResult = service.addCompteComptableToCollectionIfMissing([], compteComptable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compteComptable);
      });

      it('should not add a CompteComptable to an array that contains it', () => {
        const compteComptable: ICompteComptable = sampleWithRequiredData;
        const compteComptableCollection: ICompteComptable[] = [
          {
            ...compteComptable,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompteComptableToCollectionIfMissing(compteComptableCollection, compteComptable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompteComptable to an array that doesn't contain it", () => {
        const compteComptable: ICompteComptable = sampleWithRequiredData;
        const compteComptableCollection: ICompteComptable[] = [sampleWithPartialData];
        expectedResult = service.addCompteComptableToCollectionIfMissing(compteComptableCollection, compteComptable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compteComptable);
      });

      it('should add only unique CompteComptable to an array', () => {
        const compteComptableArray: ICompteComptable[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const compteComptableCollection: ICompteComptable[] = [sampleWithRequiredData];
        expectedResult = service.addCompteComptableToCollectionIfMissing(compteComptableCollection, ...compteComptableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const compteComptable: ICompteComptable = sampleWithRequiredData;
        const compteComptable2: ICompteComptable = sampleWithPartialData;
        expectedResult = service.addCompteComptableToCollectionIfMissing([], compteComptable, compteComptable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compteComptable);
        expect(expectedResult).toContain(compteComptable2);
      });

      it('should accept null and undefined values', () => {
        const compteComptable: ICompteComptable = sampleWithRequiredData;
        expectedResult = service.addCompteComptableToCollectionIfMissing([], null, compteComptable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compteComptable);
      });

      it('should return initial array if no CompteComptable is added', () => {
        const compteComptableCollection: ICompteComptable[] = [sampleWithRequiredData];
        expectedResult = service.addCompteComptableToCollectionIfMissing(compteComptableCollection, undefined, null);
        expect(expectedResult).toEqual(compteComptableCollection);
      });
    });

    describe('compareCompteComptable', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompteComptable(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompteComptable(entity1, entity2);
        const compareResult2 = service.compareCompteComptable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompteComptable(entity1, entity2);
        const compareResult2 = service.compareCompteComptable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompteComptable(entity1, entity2);
        const compareResult2 = service.compareCompteComptable(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
