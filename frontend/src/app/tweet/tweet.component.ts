import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Like, Tweet } from '../tweet.model';
import { NgIconsModule } from '@ng-icons/core';
import { heroChatBubbleOvalLeft, heroHeart } from '@ng-icons/heroicons/outline';
import { provideIcons } from '@ng-icons/core';
import { EventEmitter } from '@angular/core';
import { TweetService } from '../tweet.service';
import { UserModel } from '../models/UserModel';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconsModule],
  providers: [provideIcons({ heroChatBubbleOvalLeft, heroHeart })],
  templateUrl: './tweet.component.html',
  styleUrl: './tweet.component.css'
})
export class TweetComponent implements OnInit {
  @Input() tweet !: Tweet;
  @Output() remove = new EventEmitter();

  likes !: Like[]
  currentUser !: User

  showConfirmModal = false;
  isliked = false;

  constructor(
    private tweetService: TweetService, private userService: UserService) {
  }


  confirmDelete(tweet: Tweet) {
    this.showConfirmModal = true; // Show confirmation modal
  }
  deleteTweet(tweet: Tweet) {
    this.showConfirmModal = false;
    this.remove.emit(this.tweet.id);
    
  }
  initIsLiked() {
    this.isliked = this.likes.some(like => like.user.id === this.currentUser.id);
  }
  ngOnInit(): void {
    this.tweet.created_at = this.convertDate(this.tweet.created_at)
    this.tweetService.getLikes(this.tweet.id).subscribe(likes => {
      this.likes = likes;
      this.userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        this.initIsLiked();
      })
    });
  }
  convertDate(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    return formattedDate
  }
  like() {
    if (this.isliked) {
      this.tweetService.dislike(this.tweet.id).subscribe(() => {
        this.tweetService.getLikes(this.tweet.id).subscribe(likes => {
          this.likes = likes;
          this.initIsLiked();
          this.tweetService.getTweet(this.tweet.id).subscribe(tweet => {
            this.tweet = tweet;
            this.tweet.created_at = this.convertDate(this.tweet.created_at)
          });
        });
      })

    } else {
      this.tweetService.like(this.tweet.id).subscribe(() => {
        this.tweetService.getLikes(this.tweet.id).subscribe(likes => {
          this.likes = likes;
          this.initIsLiked();
          this.tweetService.getTweet(this.tweet.id).subscribe(tweet => {
            this.tweet = tweet;
            this.tweet.created_at = this.convertDate(this.tweet.created_at)
          });
        });
      })
    }


  }

}
