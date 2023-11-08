import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PieceComptableDetailComponent } from './piece-comptable-detail.component';

describe('PieceComptable Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceComptableDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PieceComptableDetailComponent,
              resolve: { pieceComptable: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PieceComptableDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load pieceComptable on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PieceComptableDetailComponent);

      // THEN
      expect(instance.pieceComptable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
