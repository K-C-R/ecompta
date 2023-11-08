import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuditDetailComponent } from './audit-detail.component';

describe('Audit Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AuditDetailComponent,
              resolve: { audit: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AuditDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load audit on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AuditDetailComponent);

      // THEN
      expect(instance.audit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
