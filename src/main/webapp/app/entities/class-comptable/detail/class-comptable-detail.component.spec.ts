import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClassComptableDetailComponent } from './class-comptable-detail.component';

describe('ClassComptable Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassComptableDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ClassComptableDetailComponent,
              resolve: { classComptable: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ClassComptableDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load classComptable on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ClassComptableDetailComponent);

      // THEN
      expect(instance.classComptable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
