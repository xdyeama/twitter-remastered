import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FollowersList, User } from '../user.model';
import { UserService } from '../user.service';
import { Tweet } from '../tweet.model';
import { TweetComponent } from '../tweet/tweet.component';
import { TweetService } from '../tweet.service';

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


  constructor(private route: ActivatedRoute,
    private userService: UserService, private tweetService: TweetService) {
  }
  onTweetRemove(id: number) {
    this.tweets = this.tweets.filter((t) => t.id !== id);
    this.tweetService.deleteTweet(id).subscribe()
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username) {
        this.userService.getUser(username).subscribe(
          user => {
            this.user = user;
          },
          error => {
            console.error('User not found:', error);
            this.notFound = true
          }
        );
        this.userService.getFollowers(username).subscribe(
          followersList => {
            this.followersList = followersList;
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
