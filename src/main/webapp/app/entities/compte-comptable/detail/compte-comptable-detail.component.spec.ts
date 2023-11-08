import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompteComptableDetailComponent } from './compte-comptable-detail.component';

describe('CompteComptable Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteComptableDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CompteComptableDetailComponent,
              resolve: { compteComptable: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CompteComptableDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load compteComptable on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CompteComptableDetailComponent);

      // THEN
      expect(instance.compteComptable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
