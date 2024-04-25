import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FollowersList, User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Tweet } from '../models/tweet.model';
import { TweetComponent } from '../tweet/tweet.component';
import { TweetService } from '../services/tweet.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TweetComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  user!: User
  followersList!: FollowersList
  tweets!: Tweet[]
  notFound = false
  currentUser !: User
  followed = false


  constructor(private route: ActivatedRoute,
    private userService: UserService, private tweetService: TweetService, private router: Router) {
  }
  follow() {
    this.userService.follow(this.user.username).subscribe(() => {
      this.userService.getFollowers(this.user.username).subscribe((followersList) => {
        this.followersList = followersList;
        this.followed = true;
      })
    })
  }
  unfollow() {
    this.userService.unfollow(this.user.username).subscribe(() => {
      this.userService.getFollowers(this.user.username).subscribe((followersList) => {
        this.followersList = followersList;
        this.followed = false;
      })
    })
  }
  onTweetRemove(id: number) {
    this.tweetService.deleteTweet(id).subscribe(() => {
      this.userService.getTweets(this.user.username).subscribe(
        tweets => {
          this.tweets = tweets;
        },
        error => {
          console.error('User not found:', error);
          this.notFound = true
        }
      );
    })
  }
  ngOnInit() {
    if(localStorage.getItem('access_token') == null){
      this.router.navigateByUrl("/login");
    }
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username) {
        this.userService.getUser(username).subscribe(
          user => {
            this.user = user;
            this.userService.getCurrentUser().subscribe(current => {
              this.currentUser = current;
              this.userService.getFollowers(username).subscribe(
                followersList => {
                  this.followersList = followersList;

                  this.followed = (this.followersList.followers.some(follower => follower.id === this.currentUser.id));
                  console.log(this.followersList.followers, this.currentUser)
                },
                error => {
                  console.error('User not found:', error);
                  this.notFound = true
                }
              );
            });
          },
          error => {
            console.error('User not found:', error);
            this.notFound = true
          }
        );

        this.userService.getTweets(username).subscribe(
          tweets => {
            this.tweets = tweets;
          },
          error => {
            console.error('User not found:', error);
            this.notFound = true
          }
        );

      }
    });
  }
}
