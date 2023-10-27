import { Component, OnDestroy, OnInit } from '@angular/core';
import { remult } from 'remult';
import { Task } from '../../shared/dbTasks/Task';
import { TaskController } from 'src/shared/Controllers/TaskController';
import { PlayerInfoMlb } from 'src/shared/dbTasks/PlayerInfoMlb';
import { MlbController } from 'src/shared/Controllers/MlbController';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.sass']
})
export class TodoComponent implements OnInit, OnDestroy {
  taskRepo = remult.repo(Task)
  mlbPlayerrInfoRepo = remult.repo(PlayerInfoMlb)
  tasks: Task[] = []
  unsubscribe = () => {}

  playerInfoTemp: any[] = []
  playerInfoFinal: PlayerInfoMlb[] = []

  /* newTaskTitle = ""
  async addTask(){
    try{
      const newTask = await this.taskRepo.insert({ title: this.newTaskTitle})
      this.newTaskTitle = ""
    } catch (error: any){
      alert(error.message)
    }
  }

  async saveTask(task: Task) {
    try {
      await this.taskRepo.save(task)
    } catch (error: any) {
      alert(error.message)
    }
  }

  async deleteTask(task: Task) {
    await this.taskRepo.delete(task);
 }

 async setAllCompleted(completed: boolean) {
  await TaskController.setAllCompleted(completed);
}; */

async mlbPlayerCheck(){
  var d = new Date;
  var dbEmpty
  try{
    dbEmpty = await this.mlbPlayerrInfoRepo.find({where: { playerId:{ "!=":0} }})
    if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != d.getDate()){
      await this.makeApiCall()
       
      await MlbController.updatePlayerINfo(this.playerInfoTemp);
      
    
      await this.mlbPlayerrInfoRepo.find({
        limit: 20
      }).then(item => this.playerInfoFinal = item)
     }
     else{
      await this.mlbPlayerrInfoRepo.find({
        limit: 20
      }).then(item => this.playerInfoFinal = item)
     }
  }catch (error: any){
    alert(error.message)
  }
  
  
 
}

async makeApiCall(){
  const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerList';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
      }
    };
    const response = await fetch(url, options);
    const result = await response.json(); 
    console.log(result)
    this.playerInfoTemp = result.body;
}


  ngOnInit() {

    
     /* this.unsubscribe = this.taskRepo
      .liveQuery({
      limit: 20,
      orderBy: { createdAt:"asc" },
      //where: { completed: false } 
    }).subscribe(info => (this.tasks = info.applyChanges(this.tasks)))  */
  }

  ngOnDestroy() {
    this.unsubscribe()
  }
}
