import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AboutTabPage } from './about-tab.page';

describe('AboutTabPage', () => {
  let component: AboutTabPage;
  let fixture: ComponentFixture<AboutTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
