import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { LessonSelectorPage } from "./lesson-selector.page";

describe("LessonSelectorPage", () => {
  let component: LessonSelectorPage;
  let fixture: ComponentFixture<LessonSelectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LessonSelectorPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
