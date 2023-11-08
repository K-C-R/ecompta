import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompteDeResultatDetailComponent } from './compte-de-resultat-detail.component';

describe('CompteDeResultat Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteDeResultatDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CompteDeResultatDetailComponent,
              resolve: { compteDeResultat: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CompteDeResultatDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load compteDeResultat on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CompteDeResultatDetailComponent);

      // THEN
      expect(instance.compteDeResultat).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
