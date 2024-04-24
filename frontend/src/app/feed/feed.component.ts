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
  followed!: User[];
  followers!: User[];
  tweets!: Tweet[];

  recommendedTweets!: Tweet[];

  constructor(private tweetService: TweetService, private userService: UserService, private router: Router,
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('access_token') == null){
      this.router.navigateByUrl("/login");
    }

    this.tweetService.getTweets().subscribe((tweets) => {
      this.tweets = tweets;
    });

    this.userService.getCurrentUser().subscribe( currUser => {
      this.currUser = currUser;
    })
    
    this.userService.getFollowers(this.getUsername()).subscribe( follow => {
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
    return this.tokenService.getDecodedAccessToken(sessionStorage.getItem("acceess_token")!)
  }
  
}
