import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JournalDefinitifDetailComponent } from './journal-definitif-detail.component';

describe('JournalDefinitif Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalDefinitifDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: JournalDefinitifDetailComponent,
              resolve: { journalDefinitif: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JournalDefinitifDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load journalDefinitif on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JournalDefinitifDetailComponent);

      // THEN
      expect(instance.journalDefinitif).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
