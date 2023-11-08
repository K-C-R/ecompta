import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RapportsPersonnalisesDetailComponent } from './rapports-personnalises-detail.component';

describe('RapportsPersonnalises Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportsPersonnalisesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RapportsPersonnalisesDetailComponent,
              resolve: { rapportsPersonnalises: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RapportsPersonnalisesDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load rapportsPersonnalises on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RapportsPersonnalisesDetailComponent);

      // THEN
      expect(instance.rapportsPersonnalises).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
