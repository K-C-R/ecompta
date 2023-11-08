import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResultatDetailComponent } from './resultat-detail.component';

describe('Resultat Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ResultatDetailComponent,
              resolve: { resultat: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ResultatDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load resultat on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ResultatDetailComponent);

      // THEN
      expect(instance.resultat).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
