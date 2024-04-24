import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Tweet, Comment } from '../tweet.model';
import { TweetService } from '../tweet.service';
import { TweetComponent } from '../tweet/tweet.component';
import { FormsModule } from '@angular/forms';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tweet-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TweetComponent, FormsModule],
  templateUrl: './tweet-detail.component.html',
  styleUrl: './tweet-detail.component.css'
})
export class TweetDetailComponent implements OnInit {
  tweet!: Tweet
  comments!: Comment[]
  usersComment = ''
  currentUser !: User
  notFound = false
  showConfirmModal = -1
  constructor(private route: ActivatedRoute,
    private tweetService: TweetService,
    private userService: UserService) {
  }

  confirmDelete(comment: Comment) {
    this.showConfirmModal = comment.id;
  }
  convertDate(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    return formattedDate
  }
  deleteComment() {

    this.tweetService.deleteComment(this.showConfirmModal).subscribe(() => {
      this.tweetService.getTweet(this.tweet.id).subscribe(tweet => {
        this.tweet = tweet;
        this.tweet.created_at = this.convertDate(this.tweet.created_at)
        this.tweetService.getComments(this.tweet.id).subscribe(comments => {
          this.comments = comments
          this.showConfirmModal = -1;
        })
      })
    })
  }
  sendComment() {
    if (this.usersComment !== "") {
      this.tweetService.sendComment(this.tweet.id, this.usersComment).subscribe(() => {
        this.tweetService.getComments(this.tweet.id).subscribe(
          comments => {
            this.comments = comments;
            for (let comment of comments) {
              comment.created_at = this.convertDate(comment.created_at)
            }
            this.tweetService.getTweet(this.tweet.id).subscribe(tweet => {
              this.tweet = tweet;
              this.tweet.created_at = this.convertDate(this.tweet.created_at)
            })
          }
        )
        this.usersComment = "";
      })
    }
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tweetId = Number(params.get('id'));
      if (tweetId) {
        this.tweetService.getTweet(tweetId).subscribe(
          tweet => {
            this.tweet = tweet;
            this.tweet.created_at = this.convertDate(this.tweet.created_at)
            this.userService.getCurrentUser().subscribe(user => {
              this.currentUser = user;
              this.tweetService.getComments(tweetId).subscribe(
                comments => {
                  this.comments = comments;
                  for (let comment of comments) {
                    comment.created_at = this.convertDate(comment.created_at)

                  }
                }
              )
            })

          }
        );



      }
    });
  }
}
