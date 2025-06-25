import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IComment } from '../../../model/interface/types';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/apiServices/api.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  commentForm: FormGroup;
  comment: IComment[] | any = [];
  userID: any = '';
  selected_text: string = '';

  constructor( private apiService: ApiService ) {
    this.userID  = localStorage.getItem('user_id');
    
    this.commentForm = new FormGroup({
      user_id: new FormControl( parseInt(this.userID), Validators.required),
      selected_text: new FormControl('', Validators.required)
    })
  }

  onSubmitComment(){
    const {user_id, selected_text} = this.commentForm.value;
    const comment = {user_id, selected_text}
    this.apiService.postComment(comment).subscribe((res)=> {
      this.comment = res;
      this.selected_text= this.comment.selected_text; 
    },
    (error) => {
      console.error("Error Occured while posting the comment:",error)
    })
  
  }

  onDelte() {
    this.apiService.deleteComment(25).subscribe(
     (res) => console.log("Deleted comment:",res),
    )
  }

  onUpdate() {
     const data = {
      user_id: 2,
      selected_text: "comment upated!! for id 9",
    }
    this.apiService.updateComment(9 ,data).subscribe((res) => console.log(res))
  }

  ngOnInit(): void {
    this.apiService.getComments().subscribe(
      (res) => console.log("All Comments:",res) 
    )

    this.apiService.getCommentsById(23).subscribe(
      (res) => console.log("23 id text:", res)
    )
  }
}
