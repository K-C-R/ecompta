import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GrandLivreDetailComponent } from './grand-livre-detail.component';

describe('GrandLivre Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrandLivreDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GrandLivreDetailComponent,
              resolve: { grandLivre: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GrandLivreDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load grandLivre on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GrandLivreDetailComponent);

      // THEN
      expect(instance.grandLivre).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
