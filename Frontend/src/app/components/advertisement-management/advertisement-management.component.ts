import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgModule } from '@angular/core';


@Component({
  selector: 'app-advertisement-management',
  templateUrl: './advertisement-management.component.html',
  styleUrls: ['./advertisement-management.component.css']
})
export class AdvertisementManagementComponent implements OnInit {
  advertisements: any = [];


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.apiService.getAdvertisements().subscribe((advertisements: any[]) => {
      this.advertisements = advertisements;
    });
  }
}
