import { Component, OnInit } from '@angular/core';
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweet.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FollowersList, User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { TweetComponent } from '../tweet/tweet.component';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [RouterModule, CommonModule, TweetComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})

export class FeedComponent implements OnInit{
  currUser!: User;
  username: string;
  followed!: User[];
  followers!: User[];
  tweets!: Tweet[];
  tweetText: string = '';

  recommendedTweets!: Tweet[];

  constructor(private tweetService: TweetService, private userService: UserService, private router: Router,
    private tokenService: TokenService
  ) {
    this.username = this.getUsername();
  }

  ngOnInit(): void {
    if(!sessionStorage.getItem("access")){
      this.router.navigateByUrl("/login");
    }

    this.tweetService.getTweets().subscribe((tweets) => {
      this.tweets = tweets;
    });

    this.userService.getCurrentUser().subscribe( currUser => {
      this.currUser = currUser;
    })
    
    this.userService.getFollowers(this.username).subscribe( follow => {
      this.followed = follow.followed;
      this.followers = follow.followers;
    })

    this.tweetService.getTweets().subscribe(tweets => {
      this.tweets = tweets.filter(tweet => this.isFollowedUser(tweet.user));
      this.recommendedTweets = tweets.filter(tweet => !this.isFollowedUser(tweet.user));
    })
  }

  private isFollowedUser(user: User): boolean {
    return this.followed.some(followedUser => followedUser.id === user.id);
  }

  private getUsername(){
    return this.tokenService.getDecodedAccessToken(sessionStorage.getItem("access")!).username
  }
  
  postTweet() {
    const userID = this.tokenService.getDecodedAccessToken(sessionStorage.getItem("acceess")!).user_id
    this.tweetService.postTweet(userID, this.tweetText).subscribe(
      (response) => {
        // Handle successful tweet submission
        console.log('Tweet posted:', response);
        // Optionally, you may want to update your tweet list here
        // this.fetchTweets();
      },
      (error) => {
        // Handle error
        console.error('Error posting tweet:', error);
      }
    );

  }
}
