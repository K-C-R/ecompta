import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompteTransfertDetailComponent } from './compte-transfert-detail.component';

describe('CompteTransfert Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteTransfertDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CompteTransfertDetailComponent,
              resolve: { compteTransfert: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CompteTransfertDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load compteTransfert on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CompteTransfertDetailComponent);

      // THEN
      expect(instance.compteTransfert).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
