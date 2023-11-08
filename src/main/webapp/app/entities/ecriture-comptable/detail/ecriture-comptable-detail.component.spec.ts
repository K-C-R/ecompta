import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EcritureComptableDetailComponent } from './ecriture-comptable-detail.component';

describe('EcritureComptable Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcritureComptableDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EcritureComptableDetailComponent,
              resolve: { ecritureComptable: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EcritureComptableDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load ecritureComptable on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EcritureComptableDetailComponent);

      // THEN
      expect(instance.ecritureComptable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
