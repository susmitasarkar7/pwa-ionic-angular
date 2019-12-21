import { Component } from "@angular/core";
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  splash:any = true;

  percent:number = 0;
  radius:number = 100;
  fullTime:any = '00:01:30';

  timer:any = false;
  progress:any = false;
  minutes:any = 1;
  seconds:any = 30;

  elapsed: any = {
    h: '00',
    m: '00',
    s: '00',
  }
  overallTimer:any = false;

  constructor( private insomnia: Insomnia, private localNotifications: LocalNotifications ) {  
    setTimeout(() => {
      this.splash = false;
    }, 4000)
  }
  
  startTimer()
  {
    if(this.timer) {
      clearInterval(this.timer);
    }

    if(!this.overallTimer) {
      this.progressTimer();
      this.insomnia.keepAwake()
    }

    this.timer = false;
    this.percent = 0;
    this.progress = 0;

    let timeSplit = this.fullTime.split(":");
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    let totalSeconds = this.minutes * 60 + parseInt(this.seconds);

    this.timer = setInterval(() => {

      if(this.progress == this.radius) {
        clearInterval(this.timer);
      }

      this.percent = Math.floor((this.progress / totalSeconds) * 100);
      this.progress++;

    }, 1000);
  }

  progressTimer() {
    let countdownDate = new Date();

    this.overallTimer = setInterval(() => {
      let now = new Date().getTime();
      let timePassed = now - countdownDate.getTime();

      this.elapsed.h = Math.floor((timePassed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.elapsed.m = Math.floor((timePassed % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsed.s = Math.floor((timePassed % (1000 * 60)) / 1000);

      this.elapsed.h = this.pad(this.elapsed.h, 2);
      this.elapsed.m = this.pad(this.elapsed.m, 2);
      this.elapsed.s = this.pad(this.elapsed.s, 2);

    }, 1000);
  }

  pad(num, size) {
    let s = num + '';
    while(s.length < size) {
      s = "0" + num;
    }
    return s;
  }

  stopTimer(){
    clearInterval(this.timer);
    clearInterval(this.overallTimer);
    this.overallTimer = false;
    this.timer = false;
    this.percent = 0;
    this.progress = 0;
    this.elapsed = {
      h: '00',
      m: '00',
      s: '00',
    };
    this.insomnia.allowSleepAgain();
  }

  showNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Timer finished',
      text: 'Stop Fucking around and Work',
      vibrate: true
    });
  }
}
