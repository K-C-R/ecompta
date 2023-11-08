import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IRapportsPersonnalises } from '../rapports-personnalises.model';
import { RapportsPersonnalisesService } from '../service/rapports-personnalises.service';

import rapportsPersonnalisesResolve from './rapports-personnalises-routing-resolve.service';

describe('RapportsPersonnalises routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: RapportsPersonnalisesService;
  let resultRapportsPersonnalises: IRapportsPersonnalises | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(RapportsPersonnalisesService);
    resultRapportsPersonnalises = undefined;
  });

  describe('resolve', () => {
    it('should return IRapportsPersonnalises returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        rapportsPersonnalisesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultRapportsPersonnalises = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRapportsPersonnalises).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        rapportsPersonnalisesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultRapportsPersonnalises = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultRapportsPersonnalises).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IRapportsPersonnalises>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        rapportsPersonnalisesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultRapportsPersonnalises = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRapportsPersonnalises).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
