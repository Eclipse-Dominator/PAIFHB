import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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

    public getAllData():LessonData[] {
        return this.rawData;
    }

    public selectLesson(lesson: LessonItem) {
        this.selectedData = lesson;
    }

    public getSelected() {
        return this.selectedData;
    }

    private content: any;

    public getSelectedContent() {
        // fix pls
        this.content = this.httpClient
            .get('../assets/content/text/' + this.selectedData.id + '.txt')
            .pipe(
                map(res => res.text())
            );
    }

    private selectedData: LessonItem; // controls state of lesson page

    private rawData: LessonData[] = [
        {
            data: [
                {
                    title: "For Loop",
                    icon: "globe-outline",
                    id: "forloops"
                }, {
                    title: "While Loop",
                    icon: "globe-outline",
                    id: "whileloops"
                },
            ],
            category: "Loops"
        }, {
            data: [
                {
                    title: "S1",
                    icon: "globe-outline",
                    id: "2"
                }, {
                    title: "S2",
                    icon: "globe-outline",
                    id: "3"
                },
            ],
            category: "ASS"
        }
    ];
    constructor(
        private httpClient: HttpClient
    ) { }
}
