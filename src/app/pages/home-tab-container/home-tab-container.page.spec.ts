import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { HomeTabContainerPage } from "./home-tab-container.page";

describe("HomeTabContainerPage", () => {
  let component: HomeTabContainerPage;
  let fixture: ComponentFixture<HomeTabContainerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeTabContainerPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTabContainerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
