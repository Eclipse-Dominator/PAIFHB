import { Component, OnInit } from '@angular/core';
import { CompilerApiService, Response } from '../../services/compiler-api.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-editor-code',
  templateUrl: './editor-code.component.html',
  styleUrls: ['./editor-code.component.scss'],
})
export class EditorCodeComponent implements OnInit {
  submitted:boolean = false;
  result:Response;
  btn_txt:string = "Compile and Run";
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

  onSubmit():void {
    //console.log(this.editor);

    let tmp_input:string = "";
    if(this.editor.add_input) tmp_input = this.editor.code_input;
    
    this.submitted = true;

    this.cApi.compile_code(this.editor.code_content,tmp_input,this.editor.compiler)
    .then((data:any) => {
      this.cApi.continued_query(data.id,5).then((result) =>{
        console.log(result);
        this.result = result;
        this.submitted = false;
      });
    })
    .catch((error) => {
      console.log(error);
      this.submitted = false;
    });
  }
}
