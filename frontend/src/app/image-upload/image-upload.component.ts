import { NgStyle, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule,} from '@angular/material/icon';
import { ImageService } from '../image.service';
export class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string = '', public file: File | null) {}
}

@Component({
  selector: 'bwm-image-upload',
  standalone: true,
  imports: [NgStyle, MatIconModule, NgIf],
  templateUrl: 'image-upload.component.html',
  styleUrls: ['image-upload.component.scss']
})
export class ImageUploadComponent{

  selectedFile: ImageSnippet;

  constructor(private imageService: ImageService){
    this.selectedFile = new ImageSnippet('', null);
  }


  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.selectedFile.pending = true;
      this.imageService.uploadImage(this.selectedFile.file!).subscribe(
        (res) => {
          this.onSuccess();
        },
        (err) => {
          this.onError();
        })
    });

    reader.readAsDataURL(file);
  }


}