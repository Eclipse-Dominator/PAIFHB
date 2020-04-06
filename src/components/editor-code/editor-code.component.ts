import { Component, OnInit } from '@angular/core';
import { CompilerApiService } from '../../services/compiler-api.service';

@Component({
  selector: 'app-editor-code',
  templateUrl: './editor-code.component.html',
  styleUrls: ['./editor-code.component.scss'],
})
export class EditorCodeComponent implements OnInit {
  user_input:string;
  result:any = false;
  editor={
    code_content: "",
    compiler: "python3"
  };
  constructor(private cApi:CompilerApiService) { }

  ngOnInit() { }

  onSubmit():void {
    console.log(this.editor);
    this.cApi.compile_code(this.editor.code_content,"",this.editor.compiler)
    .then((data:any) => {
      this.cApi.continued_query(data.id,5).then((result) =>{
        console.log(result);
        this.result = result;
      });
    });
    console.log("final")
    console.log(this.result);
  }
}
