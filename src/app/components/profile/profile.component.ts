import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';
import { ScrwmService } from 'src/app/services/scrwm.service';

import { TasksComponent } from 'src/app/components/tasks/tasks.component';

import { Incise } from 'src/app/models/incise';
import { Prof } from 'src/app/models/prof';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  DIAMONDS: number;
  isFoll: boolean;
  userProf = this.profService.userProf;

  constructor(
    public inciseService: InciseService,
    public scrwmService: ScrwmService,
    public profService: ProfService,
    public taskComponent: TasksComponent,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.setDiamods();
  }

  seeProf(){
    let T = this.scrwmService.taskList;
    for(var i in T){
      if(T[i].incise._id === this.inciseService.selectedIncise._id){
        this.scrwmService.selectedScrwm = T[i];
        this.openDialog();
        return;
      }
    }
  }

  openDialog(){
    const dialogRef = this.dialog.open(ProfileComponent);
    dialogRef.afterClosed().subscribe(); 
  }
  
  setDiamods(){
    let count = 0
    this.inciseService.getIncises().subscribe(res => {
      let C = this.inciseService.incises = res as Incise[];
      for(var i in C){
        if(C[i].prof === this.scrwmService.selectedScrwm.prof.userId){
          if(C[i].diamond){
            count = count + C[i].diamond;
          }
        }
      }
      this.DIAMONDS = count;   
    })
  }

  isFollowing(){
    const F = this.profService.userProf.following;
    for(var i in F){
      if(F[i] === this.scrwmService.selectedScrwm.prof._id){
        this.isFoll = true;
        return this.isFoll;
      }
    }
    this.isFoll = false;
  }

  followness(form: NgForm){
    const scrwm = this.scrwmService.selectedScrwm;
    const F = this.userProf.following;
    if(form.value.event === true){
      if(F.indexOf(scrwm.prof._id) != -1){ return };
      scrwm.prof.followers ++;
      F.push(scrwm.prof._id);
      this.saveProfs(scrwm.prof, this.userProf);
    }
    if(form.value.event === false){
      for(var i in F){
        if(F[i] === scrwm.prof._id){
          scrwm.prof.followers --;
          const index = F.indexOf(i)+1;
          F.splice(index, 1);
          this.saveProfs(scrwm.prof, this.userProf);
        }
      }
    }
  }

  saveProfs(selProf: Prof, userProf: Prof){
    this.profService.putProf(selProf).subscribe()
    this.profService.putProf(userProf).subscribe()
  }
 
}
