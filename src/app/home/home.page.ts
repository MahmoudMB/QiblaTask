import { Component,OnInit,ViewChild,ElementRef, OnDestroy } from '@angular/core';
import { QiblahService } from './qiblah.service';
import { Subscription } from 'rxjs';
import { Plugins} from '@capacitor/core';

import { ToastController, AlertController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit ,OnDestroy{
  
  @ViewChild('dir') dir1: ElementRef;
  @ViewChild('compass') compass: ElementRef;
  @ViewChild('arrow') arrow: ElementRef;

  
  constructor(private qiblahService:QiblahService,private alert:AlertController) {}
lat = 0;
lan = 0;
dir = 0;


compassDirection = 0;

qiblahDirection  = 0;
isDeviceHorizontal = false;
isEnablesGps = true;


compassDirectionSub:Subscription;
qiblahDirectionSub:Subscription;

compassDirectionRounded = 0;

  ngOnInit() {

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
this.qiblahService.getQiblahDirection();



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
