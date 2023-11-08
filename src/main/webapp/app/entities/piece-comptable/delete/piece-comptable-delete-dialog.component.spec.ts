jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PieceComptableService } from '../service/piece-comptable.service';

import { PieceComptableDeleteDialogComponent } from './piece-comptable-delete-dialog.component';

describe('PieceComptable Management Delete Component', () => {
  let comp: PieceComptableDeleteDialogComponent;
  let fixture: ComponentFixture<PieceComptableDeleteDialogComponent>;
  let service: PieceComptableService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PieceComptableDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(PieceComptableDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PieceComptableDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PieceComptableService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
