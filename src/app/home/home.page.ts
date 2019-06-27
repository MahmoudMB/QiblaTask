import { Component,OnInit,ViewChild,ElementRef, OnDestroy } from '@angular/core';
import { QiblahService } from './qiblah.service';
import { Subscription } from 'rxjs';
import { Plugins} from '@capacitor/core';

import { ToastController, AlertController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit ,OnDestroy{
  
  @ViewChild('dir') dir1: ElementRef;
  @ViewChild('compass') compass: ElementRef;
  @ViewChild('arrow') arrow: ElementRef;

  
  constructor(private qiblahService:QiblahService,private alert:AlertController,private diagnostic:Diagnostic) {}
lat = 0;
lan = 0;
dir = 0;


compassDirection = 0;

qiblahDirection  = 0;
isDeviceHorizontal = false;
isGPSEnabled = false;
islocationAuthorized =  false;


compassDirectionSub:Subscription;
qiblahDirectionSub:Subscription;

compassDirectionRounded = 0;

  ngOnInit() {
/*
    this.qiblahDirectionSub = this.qiblahService.qiblahDirection.subscribe(direction=>{
      this.qiblahDirection = direction;
       this.setCompassDirection();
      });
*/

this.enableGPS();

this.qiblahDirectionSub = this.qiblahService.qiblahDirection.subscribe(direction=>{
  this.qiblahDirection = direction;
   this.setCompassDirection();
  });

this.compassDirectionSub = this.qiblahService.compassHeading.subscribe(direction=>{
  this.compassDirection = direction;
  this.compassDirectionRounded = Math.ceil(direction);
  this.setCompassDirection();
  });



this.qiblahService.getCompassHeading();


  

Plugins.Motion.addListener("orientation",(res)=>{


if (res.beta <= 30 && res.beta >=-30)
{
this.isDeviceHorizontal = true;
}
else 
{
  this.isDeviceHorizontal = false;
}

});



  }

  async enableGPS(){

   this.isGPSEnabled = await this.diagnostic.isLocationEnabled();

  this.islocationAuthorized  =  await this.diagnostic.isLocationAuthorized();


  if (!this.isGPSEnabled )
  {
    this.showEnableGPSMessage();
  }

  else if (!this.islocationAuthorized)
  {
    this.requestLocationAuthorization();
  }

  else {
    this.qiblahService.getQiblahDirection();
  }


  }

  requestLocationAuthorization(){
    this.diagnostic.requestLocationAuthorization().then(status=>{
      switch(status){
        case this.diagnostic.permissionStatus.NOT_REQUESTED:
            console.log("Permission not requested");
            break;
        case this.diagnostic.permissionStatus.GRANTED:
            console.log("Permission granted");
            this.islocationAuthorized = true;
            this.enableGPS();
            break;
        case this.diagnostic.permissionStatus.DENIED:
            console.log("Permission denied");
            this.islocationAuthorized = false;

            break;
        case this.diagnostic.permissionStatus.DENIED_ALWAYS:
            console.log("Permission permanently denied");
            this.islocationAuthorized = false;
            break;
    }

    });
  }

  showEnableGPSMessage(){
    this.alert.create({message:'Enable GPS', buttons: [  
      {
     text: 'OK',
     handler: () => {
    this.enableGPS();
     }
    }]}).then(alertElm=>{
     alertElm.present();
    
    })


  }

  ngOnDestroy(){
if (this.qiblahDirectionSub)
{
  this.qiblahDirectionSub.unsubscribe();
}
if (this.compassDirectionSub)
{
  this.compassDirectionSub.unsubscribe();
}



  }




  setCompassDirection(){
    if (this.isDeviceHorizontal){
    var dig = (this.qiblahDirection - this.compassDirection)
  
    this.arrow.nativeElement.style.webkitTransform = "rotate("+ dig +"deg)";
    this.arrow.nativeElement.style.transform = "rotate("+ dig +"deg)";
    }
  }



}
