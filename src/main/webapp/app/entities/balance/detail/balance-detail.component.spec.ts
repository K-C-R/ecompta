import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BalanceDetailComponent } from './balance-detail.component';

describe('Balance Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: BalanceDetailComponent,
              resolve: { balance: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BalanceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load balance on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BalanceDetailComponent);

      // THEN
      expect(instance.balance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
