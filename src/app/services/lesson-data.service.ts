import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import data from '../../assets/content/lesson_data.json';
//import { HTTP } from '@ionic-native/http/ngx/'; // mobile

// Handles data state and storage

export interface LessonData { // TODO: more comprehensive data
    data: LessonItem[];
    category: string;
}

// basics:LessonData  l1:LessonItem l2 l3
// intermed l1 l2 l3
// 

export interface LessonItem {
    title: string;
    icon: string;
    id: string;
}

export interface RawHTML {
    type: string;
    content: string;
    link: string;
    style: string;
}


export interface RawSlide {
    content: RawHTML[];
}

/* Confused noises */
@Injectable({
  providedIn: 'root'
})
export class LessonDataService {    

    private rawData:LessonData[] = data;


    public getAllData():LessonData[] {
        console.log(this.rawData);
        return this.rawData;
    }

    public selectLesson(lesson: LessonItem):void {
        this.selectedData = lesson;
    }

    public getSelected():LessonItem {
        return this.selectedData;
    }
    
    public async *getSelectedContent(){
        let url = '../assets/content/' + this.selectedData.id + '/content.txt';

        let content:string[] = (await this.readFile(url)).split('\n');
        let i = -1;

        let current_page:RawSlide = { content: []};

        while (++i < content.length){
            content[i] = content[i].trim();

            if (content[i] == "<-- end-page -->"){
                yield {...current_page};
                current_page.content = []
                continue;
            }
            
            let slide_element:RawHTML = {
                type: "",
                content: "",
                link: "",
                style: ""
            };

            switch (content[i]) {
                case "<-- title -->":
                    slide_element.content=content[++i];
                    console.log(i)
                    slide_element.type="title";
                    break;

                case "<-- try -->":
                    slide_element.link=content[++i];
                    slide_element.type="try";
                    break;

                case "<-- quiz -->":
                    slide_element.link=content[++i];
                    slide_element.type="quiz";
                    break; 
                case "<-- image -->":
                    slide_element.link=content[++i];
                    slide_element.type="image";
                    break; 
                case "":
                    slide_element.type="br";
                    break;
                default:
                    slide_element.content=content[i]
                    slide_element.type="p";
                    break;
            }
            current_page.content.push({...slide_element});
            slide_element = {
                type: "",
                content: "",
                link: "",
                style: ""
            };
        }
        return ;
    }

    private readFile(url:string){
        return this.http.get(url,{responseType:'text'}).toPromise();
    }
    

    private selectedData: LessonItem; // controls state of lesson page

    constructor(
        private http: HttpClient
    ) { }
}
