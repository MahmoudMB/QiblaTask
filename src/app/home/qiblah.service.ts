import { Injectable } from '@angular/core';
import { Plugins} from '@capacitor/core';

//const { Geolocation } = Plugins;
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { BehaviorSubject } from 'rxjs';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';


@Injectable({
  providedIn: 'root'
})
export class QiblahService {
  private _qiblahDirection = new BehaviorSubject<number>(0);

  private _compassHeading = new BehaviorSubject<number>(0);




  
  constructor(private deviceOrientation: DeviceOrientation,private geolocation: Geolocation) { }



  get  qiblahDirection(){
    return this._qiblahDirection.asObservable();
}


get  compassHeading(){
  return this._compassHeading.asObservable();
}





  getQiblahDirection(){



    this.geolocation.getCurrentPosition().then((resp) => {
   

      var dir =  this.calculateQibla(resp.coords.latitude,resp.coords.longitude);
      
      this._qiblahDirection.next(Math.ceil(dir));
 
     // this._enabledGPS.next(true);
     }).catch((error) => {
       console.log('Error getting location', error);

     

     });
     


     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
     

      var dir =  this.calculateQibla(data.coords.latitude,data.coords.longitude);


     this._qiblahDirection.next(Math.ceil(dir));
     });




          
  }


  getCompassHeading(){

        // Get the device current compass heading
this.deviceOrientation.getCurrentHeading().then(
  (data: DeviceOrientationCompassHeading) => {
    
 this._compassHeading.next(data.trueHeading);
  
  },
  (error: any) => {
    console.log(error)

  
  }
);



var subscription = this.deviceOrientation.watchHeading().subscribe(
  (data: DeviceOrientationCompassHeading) => {
    
  
    this._compassHeading.next(data.trueHeading);


  },(error:any)=>{

  
  }
);


  }






  calculateQibla(lat,lon){
    var lat_K = 21.4225 * Math.PI / 180.0;
    var  lon_K = 39.8262 * Math.PI/180.0;
    var lat_P = lat*Math.PI/180.0;
    var lon_P = lon*Math.PI/180.0;
    var psi = 180.0/Math.PI * Math.atan2(Math.sin(lon_K-lon_P),Math.cos(lat_P)*Math.tan(lat_K)-Math.sin(lat_P)*Math.cos(lon_K-lon_P));
    return psi;

  }



}
