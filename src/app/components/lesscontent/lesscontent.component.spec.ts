import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LesscontentComponent } from './lesscontent.component';

describe('LesscontentComponent', () => {
  let component: LesscontentComponent;
  let fixture: ComponentFixture<LesscontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LesscontentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LesscontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
