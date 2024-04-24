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
  emptyUser: User = {
    id: 0,
    username: '',
    email: '',
    profile: {
      name: '',
      pfp: '',
      banner: '',
      bio: ''
    }
  };
  emptyLike: Like = {
    id: 0,
    user: this.emptyUser
  };

  showConfirmModal = false;
  isliked = false;

  constructor(
    private tweetService: TweetService) {
  }


  confirmDelete(tweet: Tweet) {
    this.showConfirmModal = true; // Show confirmation modal
  }
  deleteTweet(tweet: Tweet) {
    this.showConfirmModal = false;
    this.remove.emit(this.tweet.id);
  }
  ngOnInit(): void {
    this.tweet.created_at = this.convertDate(this.tweet.created_at)
    this.tweetService.getLikes(this.tweet.id).subscribe(likes => {
      this.likes = likes;
      this.isliked = likes.some(like => like.user.id === 5); // Use some() for existence check
    });
  }
  convertDate(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    return formattedDate
  }
  like() {
    if (this.isliked) {
      const likeToDelete = this.likes.filter(like => like.user.id === 5)[0]; // Assuming you have a like object
      console.log(likeToDelete.id);
      this.likes.pop()
      this.isliked = !this.isliked;
      this.tweetService.dislike(likeToDelete.id).subscribe()
      this.tweetService.getTweet(this.tweet.id).subscribe((tweet) => {
        this.tweet = tweet;
      });
    } else {
      this.tweetService.like(this.tweet.id).subscribe()
      this.likes.push(this.emptyLike)
      this.isliked = !this.isliked;
      this.tweetService.getTweet(this.tweet.id).subscribe((tweet) => {
        this.tweet = tweet;
      });
    }


  }

}
