import { trigger, transition, useAnimation } from '@angular/animations';
import { rotateCubeToBottom, rotateFlipToLeft, rotateFlipToRight, rotateRoomToLeft } from 'ngx-router-animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('rotateFlipToLeft', [
      transition('signup => signin', useAnimation(rotateFlipToLeft,{
        params: {enterTiming: '.7', leaveTiming: '.7', enterDelay: '0.2', leaveDelay: '0.2'}
        })),
    ]),
    trigger('rotateFlipToRight', [
      transition('signin => signup', useAnimation(rotateFlipToRight,{
        params: {enterTiming: '.7', leaveTiming: '.7', enterDelay: '0.2', leaveDelay: '0.2'}
        })),
    ]),
    trigger('rotateRoomToLeft', [
      transition('signin => home', useAnimation(rotateRoomToLeft,{
        params: {enterTiming: '.7', leaveTiming: '.7', enterDelay: '0.2', leaveDelay: '0.2'}
        })),
    ]),
    trigger('rotateCubeToBottom', [
      transition('home => signin', useAnimation(rotateCubeToBottom)),
    ]),
  ],
})
export class AppComponent {
  title = 'note';
  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }
}
