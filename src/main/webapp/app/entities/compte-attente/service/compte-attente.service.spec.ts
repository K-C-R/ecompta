import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompteAttente } from '../compte-attente.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../compte-attente.test-samples';

import { CompteAttenteService } from './compte-attente.service';

const requireRestSample: ICompteAttente = {
  ...sampleWithRequiredData,
};

describe('CompteAttente Service', () => {
  let service: CompteAttenteService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompteAttente | ICompteAttente[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompteAttenteService);
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

    it('should create a CompteAttente', () => {
      const compteAttente = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(compteAttente).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompteAttente', () => {
      const compteAttente = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(compteAttente).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompteAttente', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompteAttente', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompteAttente', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompteAttenteToCollectionIfMissing', () => {
      it('should add a CompteAttente to an empty array', () => {
        const compteAttente: ICompteAttente = sampleWithRequiredData;
        expectedResult = service.addCompteAttenteToCollectionIfMissing([], compteAttente);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compteAttente);
      });

      it('should not add a CompteAttente to an array that contains it', () => {
        const compteAttente: ICompteAttente = sampleWithRequiredData;
        const compteAttenteCollection: ICompteAttente[] = [
          {
            ...compteAttente,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompteAttenteToCollectionIfMissing(compteAttenteCollection, compteAttente);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompteAttente to an array that doesn't contain it", () => {
        const compteAttente: ICompteAttente = sampleWithRequiredData;
        const compteAttenteCollection: ICompteAttente[] = [sampleWithPartialData];
        expectedResult = service.addCompteAttenteToCollectionIfMissing(compteAttenteCollection, compteAttente);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compteAttente);
      });

      it('should add only unique CompteAttente to an array', () => {
        const compteAttenteArray: ICompteAttente[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const compteAttenteCollection: ICompteAttente[] = [sampleWithRequiredData];
        expectedResult = service.addCompteAttenteToCollectionIfMissing(compteAttenteCollection, ...compteAttenteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const compteAttente: ICompteAttente = sampleWithRequiredData;
        const compteAttente2: ICompteAttente = sampleWithPartialData;
        expectedResult = service.addCompteAttenteToCollectionIfMissing([], compteAttente, compteAttente2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compteAttente);
        expect(expectedResult).toContain(compteAttente2);
      });

      it('should accept null and undefined values', () => {
        const compteAttente: ICompteAttente = sampleWithRequiredData;
        expectedResult = service.addCompteAttenteToCollectionIfMissing([], null, compteAttente, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compteAttente);
      });

      it('should return initial array if no CompteAttente is added', () => {
        const compteAttenteCollection: ICompteAttente[] = [sampleWithRequiredData];
        expectedResult = service.addCompteAttenteToCollectionIfMissing(compteAttenteCollection, undefined, null);
        expect(expectedResult).toEqual(compteAttenteCollection);
      });
    });

    describe('compareCompteAttente', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompteAttente(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompteAttente(entity1, entity2);
        const compareResult2 = service.compareCompteAttente(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompteAttente(entity1, entity2);
        const compareResult2 = service.compareCompteAttente(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompteAttente(entity1, entity2);
        const compareResult2 = service.compareCompteAttente(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
