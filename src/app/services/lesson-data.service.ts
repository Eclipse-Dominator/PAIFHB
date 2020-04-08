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

    public selectLesson(lesson: LessonItem) {
        this.selectedData = lesson;
    }

    public getSelected() {
        return this.selectedData;
    }

    private content: any;
    
    public getSelectedContent(){
        let url = '../assets/content/text/' + this.selectedData.id + '.txt';
        return this.readFile(url);
    }

    private readFile(url:string){
        return this.http.get('url',{responseType:'text'}).toPromise();
    }
    

    private selectedData: LessonItem; // controls state of lesson page

    constructor(
        private http: HttpClient
    ) { }
}
