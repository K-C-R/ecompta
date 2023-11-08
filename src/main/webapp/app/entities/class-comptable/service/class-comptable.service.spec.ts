import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClassComptable } from '../class-comptable.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../class-comptable.test-samples';

import { ClassComptableService } from './class-comptable.service';

const requireRestSample: IClassComptable = {
  ...sampleWithRequiredData,
};

describe('ClassComptable Service', () => {
  let service: ClassComptableService;
  let httpMock: HttpTestingController;
  let expectedResult: IClassComptable | IClassComptable[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClassComptableService);
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

    it('should create a ClassComptable', () => {
      const classComptable = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(classComptable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClassComptable', () => {
      const classComptable = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(classComptable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClassComptable', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClassComptable', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClassComptable', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClassComptableToCollectionIfMissing', () => {
      it('should add a ClassComptable to an empty array', () => {
        const classComptable: IClassComptable = sampleWithRequiredData;
        expectedResult = service.addClassComptableToCollectionIfMissing([], classComptable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(classComptable);
      });

      it('should not add a ClassComptable to an array that contains it', () => {
        const classComptable: IClassComptable = sampleWithRequiredData;
        const classComptableCollection: IClassComptable[] = [
          {
            ...classComptable,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClassComptableToCollectionIfMissing(classComptableCollection, classComptable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClassComptable to an array that doesn't contain it", () => {
        const classComptable: IClassComptable = sampleWithRequiredData;
        const classComptableCollection: IClassComptable[] = [sampleWithPartialData];
        expectedResult = service.addClassComptableToCollectionIfMissing(classComptableCollection, classComptable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(classComptable);
      });

      it('should add only unique ClassComptable to an array', () => {
        const classComptableArray: IClassComptable[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const classComptableCollection: IClassComptable[] = [sampleWithRequiredData];
        expectedResult = service.addClassComptableToCollectionIfMissing(classComptableCollection, ...classComptableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const classComptable: IClassComptable = sampleWithRequiredData;
        const classComptable2: IClassComptable = sampleWithPartialData;
        expectedResult = service.addClassComptableToCollectionIfMissing([], classComptable, classComptable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(classComptable);
        expect(expectedResult).toContain(classComptable2);
      });

      it('should accept null and undefined values', () => {
        const classComptable: IClassComptable = sampleWithRequiredData;
        expectedResult = service.addClassComptableToCollectionIfMissing([], null, classComptable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(classComptable);
      });

      it('should return initial array if no ClassComptable is added', () => {
        const classComptableCollection: IClassComptable[] = [sampleWithRequiredData];
        expectedResult = service.addClassComptableToCollectionIfMissing(classComptableCollection, undefined, null);
        expect(expectedResult).toEqual(classComptableCollection);
      });
    });

    describe('compareClassComptable', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClassComptable(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClassComptable(entity1, entity2);
        const compareResult2 = service.compareClassComptable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClassComptable(entity1, entity2);
        const compareResult2 = service.compareClassComptable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClassComptable(entity1, entity2);
        const compareResult2 = service.compareClassComptable(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
