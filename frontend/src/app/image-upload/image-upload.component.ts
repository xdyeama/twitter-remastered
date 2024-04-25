import { Component } from '@angular/core';
import { ImageService } from '../services/image.service';
import { TokenService } from '../services/token.service';
import { HttpResponse } from '@angular/common/http';
import { NgIf, NgStyle } from '@angular/common';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'bwm-image-upload',
  imports: [NgStyle, NgIf],
  standalone: true,
  templateUrl: 'image-upload.component.html',
  styleUrls: ['image-upload.component.scss']
})
export class ImageUploadComponent {

  selectedFile!: ImageSnippet;

  constructor(private imageService: ImageService, private tokenService: TokenService){}

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
      if(sessionStorage.getItem('access_token')){
        let username = this.tokenService.getDecodedAccessToken(sessionStorage.getItem('access_token')!)

        this.selectedFile = new ImageSnippet(event.target.result, file);

        this.selectedFile.pending = true;
        this.imageService.uploadImage(username, this.selectedFile.file).subscribe(
          (res: HttpResponse<any>) => { // Use HttpResponse<any> as the type of 'res'
            this.onSuccess();
          },
          (err: any) => {
            this.onError();
          }
        )
      }
    });

    reader.readAsDataURL(file);
  }
}
