import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CodeEditorPage } from './code-editor.page';

describe('CodeEditorPage', () => {
  let component: CodeEditorPage;
  let fixture: ComponentFixture<CodeEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeEditorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CodeEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
