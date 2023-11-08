import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BilanDetailComponent } from './bilan-detail.component';

describe('Bilan Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilanDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: BilanDetailComponent,
              resolve: { bilan: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BilanDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load bilan on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BilanDetailComponent);

      // THEN
      expect(instance.bilan).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
