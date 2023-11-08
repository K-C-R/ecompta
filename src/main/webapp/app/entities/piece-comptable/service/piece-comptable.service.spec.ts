import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPieceComptable } from '../piece-comptable.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../piece-comptable.test-samples';

import { PieceComptableService, RestPieceComptable } from './piece-comptable.service';

const requireRestSample: RestPieceComptable = {
  ...sampleWithRequiredData,
  datePiece: sampleWithRequiredData.datePiece?.toJSON(),
};

describe('PieceComptable Service', () => {
  let service: PieceComptableService;
  let httpMock: HttpTestingController;
  let expectedResult: IPieceComptable | IPieceComptable[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PieceComptableService);
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

    it('should create a PieceComptable', () => {
      const pieceComptable = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pieceComptable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PieceComptable', () => {
      const pieceComptable = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pieceComptable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PieceComptable', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PieceComptable', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PieceComptable', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPieceComptableToCollectionIfMissing', () => {
      it('should add a PieceComptable to an empty array', () => {
        const pieceComptable: IPieceComptable = sampleWithRequiredData;
        expectedResult = service.addPieceComptableToCollectionIfMissing([], pieceComptable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pieceComptable);
      });

      it('should not add a PieceComptable to an array that contains it', () => {
        const pieceComptable: IPieceComptable = sampleWithRequiredData;
        const pieceComptableCollection: IPieceComptable[] = [
          {
            ...pieceComptable,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPieceComptableToCollectionIfMissing(pieceComptableCollection, pieceComptable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PieceComptable to an array that doesn't contain it", () => {
        const pieceComptable: IPieceComptable = sampleWithRequiredData;
        const pieceComptableCollection: IPieceComptable[] = [sampleWithPartialData];
        expectedResult = service.addPieceComptableToCollectionIfMissing(pieceComptableCollection, pieceComptable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pieceComptable);
      });

      it('should add only unique PieceComptable to an array', () => {
        const pieceComptableArray: IPieceComptable[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pieceComptableCollection: IPieceComptable[] = [sampleWithRequiredData];
        expectedResult = service.addPieceComptableToCollectionIfMissing(pieceComptableCollection, ...pieceComptableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pieceComptable: IPieceComptable = sampleWithRequiredData;
        const pieceComptable2: IPieceComptable = sampleWithPartialData;
        expectedResult = service.addPieceComptableToCollectionIfMissing([], pieceComptable, pieceComptable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pieceComptable);
        expect(expectedResult).toContain(pieceComptable2);
      });

      it('should accept null and undefined values', () => {
        const pieceComptable: IPieceComptable = sampleWithRequiredData;
        expectedResult = service.addPieceComptableToCollectionIfMissing([], null, pieceComptable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pieceComptable);
      });

      it('should return initial array if no PieceComptable is added', () => {
        const pieceComptableCollection: IPieceComptable[] = [sampleWithRequiredData];
        expectedResult = service.addPieceComptableToCollectionIfMissing(pieceComptableCollection, undefined, null);
        expect(expectedResult).toEqual(pieceComptableCollection);
      });
    });

    describe('comparePieceComptable', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePieceComptable(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePieceComptable(entity1, entity2);
        const compareResult2 = service.comparePieceComptable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePieceComptable(entity1, entity2);
        const compareResult2 = service.comparePieceComptable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePieceComptable(entity1, entity2);
        const compareResult2 = service.comparePieceComptable(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
