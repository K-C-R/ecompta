import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompteAttenteDetailComponent } from './compte-attente-detail.component';

describe('CompteAttente Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteAttenteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CompteAttenteDetailComponent,
              resolve: { compteAttente: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CompteAttenteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load compteAttente on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CompteAttenteDetailComponent);

      // THEN
      expect(instance.compteAttente).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
