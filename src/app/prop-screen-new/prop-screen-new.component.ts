import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SportsBookController } from '../../shared/Controllers/SportsBookController';
import { TeamInfoController } from '../../shared/Controllers/TeamInfoController';
import { DbTeamInfo } from 'src/shared/dbTasks/DBTeamInfo';
import { DbGameBookData } from 'src/shared/dbTasks/DbGameBookData';

@Component({
  selector: 'app-prop-screen-new',
  templateUrl: './prop-screen-new.component.html',
  styleUrls: ['./prop-screen-new.component.sass']
})
export class PropScreenNewComponent implements OnInit {

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    location.reload()
  }


  listOfProps: any = [
    {
      type: 'Game Props',
      selected: true
    },
    {
      type: 'Team Props',
      selected: false
    },
    {
      type: 'Player Props',
      selected: false
    },
    {
      type: 'Live Props',
      selected: false
    }
  ]

  selectedSport: string = ''
  selectedPropType: string = ''
  allSportTeamInfo: DbTeamInfo[] = []
  selectedSportGames: DbGameBookData[] = []
  selectedGame: string = ''
  selectedSportGamesFinal: any[] = []



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    //private dialog: MatDialog
  ) {

  }

  async initializeUrl() {
    if (this.route.snapshot.paramMap.get('sport') != null) {
      this.selectedSport = this.route.snapshot.paramMap.get('sport')!
    }
    if (this.route.snapshot.paramMap.get('game') != null) {
      this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
        this.selectedGame = params.get("game")
        this.router.navigate([`/propsNew/${this.selectedSport}/${this.selectedGame}`])
      })
    }

  }
  async initializeData() {

    let initialData = await Promise.all([TeamInfoController.getAllTeamInfo(this.selectedSport), SportsBookController.loadAllBookDataBySportAndMaxBookSeq(this.selectedSport)])
    this.allSportTeamInfo = initialData[0]
    this.selectedSportGames = initialData[1]
    if (this.selectedGame == '') {
      let distinctGames = this.selectedSportGames.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.selectedSportGames.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)

          teamArray.push(allOfTeam)
        })
        teamArray[0].selected = false;
        this.selectedSportGamesFinal.push(teamArray)
      })
      this.selectedGame = this.selectedSportGamesFinal[0][0][0].bookId
      this.selectedSportGamesFinal[0][0].selected = true;
      this.router.navigate([`/propsNew/${this.selectedSport}/${this.selectedGame}`])
    }
    else {
      let sportsGamesNew: any[] = JSON.parse(JSON.stringify(this.selectedSportGames))
      let distinctGames = sportsGamesNew.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = sportsGamesNew.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          teamArray.push(allOfTeam)
        })
        teamArray[0].selected = false;
        this.selectedSportGamesFinal.push(teamArray)
      })
      let currentGame = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
      currentGame[0][0].selected = true;

    }
    this.selectedSportGamesFinal.forEach(e => {
      let awayTeamInfo = this.allSportTeamInfo.filter(f => f.teamNameFull == e[0][0].awayTeam)
      let homeTeamInfo = this.allSportTeamInfo.filter(f => f.teamNameFull == e[0][0].homeTeam)
      e[0][0].awayTeam = awayTeamInfo[0].teamNameAbvr;
      e[0][0].homeTeam = homeTeamInfo[0].teamNameAbvr;
    })
    await this.onGameClick(this.selectedGame)
  }

  async onGameClick(game: string) {
    this.selectedGame = game;

    this.router.navigate([`/propsNew/${this.selectedSport}/${this.selectedGame}`])
    this.selectedSportGamesFinal.forEach(e => {
      e[0].selected = false;

    })
    let selectedGameClicked = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
    selectedGameClicked[0][0].selected = true
    this.selectedPropType = this.listOfProps[0].type

   // this.displayProp();
  }



  onPropChange(propType: string) {
    this.selectedPropType = propType
    for(let prop of this.listOfProps){
      if(prop.type != this.selectedPropType){
        prop.selected = false;
      }
      else{
        prop.selected = true;
      }
      
    }
  }


  async ngOnInit() {
    this.selectedPropType = this.listOfProps[0].type
    await this.initializeUrl()
    await this.initializeData()
  }
}
