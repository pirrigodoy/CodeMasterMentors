import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-comment-management',
  templateUrl: './comment-management.component.html',
  styleUrls: ['./comment-management.component.css']
})
export class CommentManagementComponent implements OnInit {
  comments: any = [];


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.apiService.getComments().subscribe((comments: any[]) => {
      this.comments = comments;
    console.log(this.comments)

    });
  }
}
