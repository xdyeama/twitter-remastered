import { Component, OnInit } from '@angular/core';
import { FollowersList } from '../models/user.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-followers-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './followers-list.component.html',
  styleUrl: './followers-list.component.css'
})
export class FollowersListComponent implements OnInit {
  followersList!: FollowersList
  followerActive = true


  constructor(private route: ActivatedRoute,
    private userService: UserService) {
  }
  toggleButton(option: number) {
    if (option == 1) {
      this.followerActive = true;
    } else {
      this.followerActive = false;
    }
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username) {
        this.userService.getFollowers(username).subscribe(
          followersList => {
            this.followersList = followersList;
          },
          error => {
            console.error('User not found:', error);
          }
        );
      }
    });
  }
}
