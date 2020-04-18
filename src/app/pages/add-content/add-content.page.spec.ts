import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddContentPage } from './add-content.page';

describe('AddContentPage', () => {
  let component: AddContentPage;
  let fixture: ComponentFixture<AddContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
