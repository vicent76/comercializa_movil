import { Component, OnInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from 'src/app/services/ui.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ParametrosService } from 'src/app/services/parametros.service';

import * as AWS from 'aws-sdk';



@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {

  image: string = '';
  parte: any = {};
  param: any = {};
  fotos: any = [];
  fotoId: number = 0;

  constructor(
    private comercializaService: ComercializaService,
    private parametrosService: ParametrosService,
    private uiService: UiService,
    private camera: Camera
  ) { }

  async ngOnInit() {
    try {
      this.parte = this.comercializaService.getParteDetalleObj();
      if(this.parte) {
        this.fotos = await this.comercializaService.getParteFotos(this.parte.parteId);
        if(this.fotos) {
          let n = this.fotos.length;
          this.fotoId = n + 1;
        } else {
          this.fotoId = 1;
        }
      }
      
      this.param = await this.parametrosService.getParametros();
      this.param = this.param[0];
      //AWS
      AWS.config.region = this.param.bucket_region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId:  this.param.identity_pool,
      });
    }catch(error){
      this.uiService.controlDeError(error);
    }
  }

  async ionViewDidEnter() {
    try {
      this.parte = this.comercializaService.getParteDetalleObj();
      if(this.parte) {
        this.fotos = await this.comercializaService.getParteFotos(this.parte.parteId);
        if(this.fotos) {
          let n = this.fotos.length;
          this.fotoId = n + 1;
        } else {
          this.fotoId = 1;
        }
      }
      
      this.param = await this.parametrosService.getParametros();
      this.param = this.param[0];
      //AWS
      AWS.config.region = this.param.bucket_region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId:  this.param.identity_pool,
      });
    }catch(error){
      this.uiService.controlDeError(error);
    }

  }

  
  ionViewWillLeave() {
    this.image = '';
  }

  takePicture() {
    try {
      const options: CameraOptions = {
        quality: 100,
        correctOrientation: false,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA
      }
      
      this.camera.getPicture(options)
      .then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64 (DATA_URL):
       this.image = 'data:image/png;base64,' + imageData;
       this.save();
      }, 
      (error) => {
        console.log(error);    
       
      });
    }catch(error) {
      console.log(error);
    }
  }

  async save() {
    const file = this.image

    var block = file.split(";");
    var contentType = block[0].split(":")[1];
    var realData = block[1].split(",")[1];
    var blob = this.b64toBlob(realData, contentType, null);

    var name = this.parte.numParte + "_ID_" + this.fotoId + "_imagen.png"

   
    var newFile = new File([blob], name, {type: "image/png"});
    
    var fileKey =  name
    var params = {
        Bucket: this.param.bucket,
        Key: fileKey,
        IdentityPoolId: this.param.identity_pool,
        Body: newFile,
        ACL: "public-read"
    }
    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
        params: params
    });
    var promise = upload.promise();
     promise
    .then (
        data => {
          var datos = {
            parteFotos: {
              parteFotoId: 0,
              parteId: this.parte.parteId,
              src: data.Location
            }
          }
          this.creaParteFotos(datos); 
        },
        err =>{
          this.uiService.controlDeError(err);
        }
    );
}

async creaParteFotos(datos:any) {
  try {
    await this.comercializaService.postParteFotos(datos);
    this.fotoId = this.fotoId + 1;
  }catch(error) {
    this.uiService.controlDeError(error)
  }
}


b64toBlob(b64Data: string, contentType: string, sliceSize: number | null) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
  }

var blob = new Blob(byteArrays, {type: contentType});
return blob;
}

 
  

}
