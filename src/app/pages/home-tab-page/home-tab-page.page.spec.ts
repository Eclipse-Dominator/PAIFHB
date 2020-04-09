import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeTabPagePage } from './home-tab-page.page';

describe('HomeTabPagePage', () => {
  let component: HomeTabPagePage;
  let fixture: ComponentFixture<HomeTabPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTabPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTabPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
