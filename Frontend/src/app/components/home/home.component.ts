import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // programmingLanguages: any = [];
  teachers: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getTeachers();
    // this.getProgrammingLanguages();
  }

  // getTeachers(): void {
  //     this.apiService.getTeachers()
  //     .subscribe(teachers => {
  //       this.teachers = teachers;
  //       console.log('Teachers:', teachers);
  //     });
  // }
getTeachers(){
  return this.apiService.getTeachers().subscribe((teachers:{})=> {
    this.teachers = teachers;
    console.log('Teachers:', teachers);
  })
}

  // getProgrammingLanguages(): void {
  //   this.apiService.getProgrammingLanguages()
  //     .subscribe(languages => this.programmingLanguages = languages);
  // }
}

