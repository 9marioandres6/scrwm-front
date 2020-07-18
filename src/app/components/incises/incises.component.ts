import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { ScrwmService } from 'src/app/services/scrwm.service';
import { InciseService } from 'src/app/services/incise.service';

import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'
import { KeyListenerComponent } from 'src/app/components/incises/key-listener/key-listener.component'
import {TextEditorComponent} from 'src/app/components/incises/text-editor/text-editor.component';

import { Incise } from 'src/app/models/incise';
import { Scrwm } from 'src/app/models/scrwm';

import { HighlightDirective } from 'src/app/directives/highlight.directive'

declare var M: any; 

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
})

export class IncisesComponent {

    constructor(public inciseService: InciseService, 
                public scrwmService: ScrwmService,
                public showAround: ShowAroundComponent,
                public keyListener: KeyListenerComponent,
                public highLight: HighlightDirective,
                public router: Router,
                public textEditorComponent: TextEditorComponent                
                ){ }

  @HostListener("window:keydown", ['$event']) spaceEvent(event: any){
    if(event.keyCode === 13){
      this.showAround.DirLast = "Up";
      this.keyListener.editedIncise();
    } else if(event.ctrlKey){
      if(event.keyCode === 37){
        this.showAround.DirLast = "Right";
        this.keyListener.editedIncise();
      } else if(event.keyCode === 38){
        this.showAround.DirLast = "Down";
        this.keyListener.editedIncise();
      } else if(event.keyCode === 39){
        this.showAround.DirLast = "Left";
        this.keyListener.editedIncise();  
        //M.toast({html: "Please select what you want to comment after pressing Ctrl key"})
      } else if(event.keyCode === 40){
        this.showAround.DirLast = "Up";
        this.keyListener.editedIncise();
      }  
    }
  }

  onSelected(event: any){
      document.execCommand("forecolor", true, "green");
        //this.showAround.DirLast = "Left";
        //this.keyListener.editedIncise();  
      const selectedText = window.getSelection().toString().trim();
  }

  editAround(incise: Incise, direction: any){
    switch(direction){
      case "Up":
        this.showAround.DirLast = "Up";
        break;
      case "Down":
        this.showAround.DirLast = "Down";
        break;        
      case "Left":
        this.showAround.DirLast = "Left";
        break;
      case "Right":
        this.showAround.DirLast = "Right";
        break;  
    }
    this.checkContent(incise);
  }  

  checkContent(incise: Incise){ 
    if (document.getElementById('E').textContent === ""){
      this.inciseService.deleteIncise(this.inciseService.selectedIncise._id)
      .subscribe(res => {
        this.inciseService.selectedIncise = incise
        this.showAround.toCenter(incise);
      });
    } else {
      this.linkStereo1(incise)
    }
  }

  linkStereo1(incise: Incise){
    const A = this.inciseService.selectedIncise;
    A.content = document.getElementById('E').textContent;
    switch (this.showAround.DirLast){
      case "Up":
        for(var i in A.up){
          if(A.up[i] === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        A.up.push(incise._id);
        break;
      case "Down":
        for(var i in A.down){
          if(A.down[i] === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        A.down.push(incise._id);
        break;
      case "Left":
        for(var i in A.left){
          if(A.left[i] === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        A.left.push(incise._id);
        break;
      case "Right":
        for(var i in A.right){
          if(A.right[i] === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        A.right.push(incise._id);
        break;
    }
    this.linkStereo2(incise, A)
  }

  linkStereo2(incise: Incise, A: Incise){
    this.inciseService.putIncise(A)
    .subscribe(res => {
      this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.linkStereo3(incise, A);
      });
    });
  }

  linkStereo3(incise: Incise, A: Incise){
    switch (this.showAround.DirLast){
      case "Up":
        for(var i in incise.down){
          if(incise.down[i] === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        incise.down.push(A._id);
        break;
      case "Down":
        for(var i in incise.up){
          if(incise.up[i] === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        incise.up.push(A._id);
        break;
      case "Left":
        for(var i in incise.right){
          if(incise.right[i] === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        incise.right.push(A._id);
        break;
      case "Right":
        for(var i in incise.left){
          if(incise.left[i] === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        incise.left.push(A._id);
        break;
    }
    this.linkStereo4(A, incise);
  }

  linkStereo4(A: Incise, incise: Incise){
    this.inciseService.putIncise(incise)
    .subscribe(res => {
      this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.keyListener.getCurrentScrwm(incise);
        this.inciseService.selectedIncise = incise;
        this.showAround.toCenter(this.inciseService.selectedIncise);
      });
    });
  }

  zoomMin(){
    this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
    this.router.navigate(['/tasks']);
    this.showAround.toCenter(this.inciseService.selectedIncise);
    this.actualizeScrwm();
  }

  zoomMax(){
    this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
    this.showAround.toCenter(this.inciseService.selectedIncise);
    this.router.navigate(['/incises']);
    this.actualizeScrwm();
  }

  actualizeScrwm(){
    this.scrwmService.getScrwms()
    .subscribe(res =>{
      const A = this.scrwmService.scrwms = res as Scrwm [];
      for(var i in A){
        if(A[i]._id === sessionStorage.getItem('currentScrwmId')){
          this.showAround.getByScrwm(A[i]);
        }
      }
    });
  }

  addHashtag:boolean = false;

  HT(){
    if(document.getElementById('E').isContentEditable){
      this.addHashtag = true;
    } else {
      M.toast({html: "Not allowed to add a hashtag in this incise"});

    }
  }

  HT2(event: any, HTInput: any){
    if(event.keyCode === 32){
      this.addHashtag = false;
      if(HTInput.value){
        this.inciseService.selectedIncise.hashtag.push(HTInput.value);
        this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
        this.showAround.toCenter(this.inciseService.selectedIncise);
      }
    }
  }

  deleteHashtag(hashtag: string){
    if(document.getElementById('E').isContentEditable){
      const A = this.inciseService.selectedIncise;
      for(var i in A.hashtag){
        if(A.hashtag[i] === hashtag){
          const index = A.hashtag.indexOf(i)+1;
          A.hashtag.splice(index, 1);
          A.content = document.getElementById('E').textContent;
          this.showAround.toCenter(A);
        }
      }
    }
  }

}
