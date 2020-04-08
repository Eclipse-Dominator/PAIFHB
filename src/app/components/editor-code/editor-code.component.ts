import { Component, OnInit, ViewChild } from '@angular/core';
import { CompilerApiService, Response, FilteredResponse } from '../../services/compiler-api.service';
import { LoadingController, IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-editor-code',
  templateUrl: './editor-code.component.html',
  styleUrls: ['./editor-code.component.scss'],
})
export class EditorCodeComponent implements OnInit {
  submitted:boolean = false;
  result:FilteredResponse = {
    language: "",
    stdout: "",
    stderr:"",
    time:"",
    result: true
  };
  editor;
  

  constructor(
    private cApi:CompilerApiService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {  
    this.editor={
      add_input: false,
      code_input: "",
      compiler: "python3",
      code_content: ""
    };
    }
    @ViewChild('slidesTag', { static: false }) slidesTag: IonSlides;

  onSubmit():void {
    //console.log(this.editor);
    this.result.language = "";
    let tmp_input:string = "";
    if(this.editor.add_input) tmp_input = this.editor.code_input;
    
    this.submitted = true; 

    this.cApi.compile_code(this.editor.code_content,tmp_input,this.editor.compiler)
    .then((data:any) => {
      this.slidesTag.slideNext();
      return this.cApi.continued_query(data.id,5);
    }).then((result) => {
      console.log(result);
      this.getImptData(result);
      this.submitted = false;
    })
    .catch((error) => {
      console.log(error);
      this.submitted = false;
    });
  }

  getImptData(data:Response):void {
    this.result.language = data.language;

    if (data.build_result === "failure"){
      this.result.stderr = "build exit code: "+data.build_exit_code+'\n'+data.build_stderr;
      this.result.stdout = data.build_stdout;
      this.result.result = false;
    } else{
      
      this.result.stdout = data.stdout;
      if(data.result === "failure"){
        this.result.stderr = "exit code: " + data.exit_code + '\n' + data.stderr
        this.result.result = false;
      }else{
        this.result.stderr = data.stderr;
        this.result.result = true;
      }
    }
    console.log(this.result);
  }

  
}
