import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompteDetailComponent } from './compte-detail.component';

describe('Compte Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CompteDetailComponent,
              resolve: { compte: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CompteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load compte on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CompteDetailComponent);

      // THEN
      expect(instance.compte).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
