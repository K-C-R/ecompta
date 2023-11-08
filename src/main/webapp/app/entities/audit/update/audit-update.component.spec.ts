import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { AuditService } from '../service/audit.service';
import { IAudit } from '../audit.model';
import { AuditFormService } from './audit-form.service';

import { AuditUpdateComponent } from './audit-update.component';

describe('Audit Management Update Component', () => {
  let comp: AuditUpdateComponent;
  let fixture: ComponentFixture<AuditUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let auditFormService: AuditFormService;
  let auditService: AuditService;
  let compteService: CompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AuditUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AuditUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuditUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    auditFormService = TestBed.inject(AuditFormService);
    auditService = TestBed.inject(AuditService);
    compteService = TestBed.inject(CompteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Compte query and add missing value', () => {
      const audit: IAudit = { id: 456 };
      const compte: ICompte = { id: 10169 };
      audit.compte = compte;

      const compteCollection: ICompte[] = [{ id: 5477 }];
      jest.spyOn(compteService, 'query').mockReturnValue(of(new HttpResponse({ body: compteCollection })));
      const additionalComptes = [compte];
      const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
      jest.spyOn(compteService, 'addCompteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ audit });
      comp.ngOnInit();

      expect(compteService.query).toHaveBeenCalled();
      expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(
        compteCollection,
        ...additionalComptes.map(expect.objectContaining),
      );
      expect(comp.comptesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const audit: IAudit = { id: 456 };
      const compte: ICompte = { id: 2028 };
      audit.compte = compte;

      activatedRoute.data = of({ audit });
      comp.ngOnInit();

      expect(comp.comptesSharedCollection).toContain(compte);
      expect(comp.audit).toEqual(audit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAudit>>();
      const audit = { id: 123 };
      jest.spyOn(auditFormService, 'getAudit').mockReturnValue(audit);
      jest.spyOn(auditService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ audit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: audit }));
      saveSubject.complete();

      // THEN
      expect(auditFormService.getAudit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(auditService.update).toHaveBeenCalledWith(expect.objectContaining(audit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAudit>>();
      const audit = { id: 123 };
      jest.spyOn(auditFormService, 'getAudit').mockReturnValue({ id: null });
      jest.spyOn(auditService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ audit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: audit }));
      saveSubject.complete();

      // THEN
      expect(auditFormService.getAudit).toHaveBeenCalled();
      expect(auditService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAudit>>();
      const audit = { id: 123 };
      jest.spyOn(auditService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ audit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(auditService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCompte', () => {
      it('Should forward to compteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(compteService, 'compareCompte');
        comp.compareCompte(entity, entity2);
        expect(compteService.compareCompte).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
