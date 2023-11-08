import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SoldeComptableDetailComponent } from './solde-comptable-detail.component';

describe('SoldeComptable Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldeComptableDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SoldeComptableDetailComponent,
              resolve: { soldeComptable: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SoldeComptableDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load soldeComptable on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SoldeComptableDetailComponent);

      // THEN
      expect(instance.soldeComptable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
