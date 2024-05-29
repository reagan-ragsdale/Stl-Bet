


import { SportsTitleToName } from '../sports-titel-to-name';
import { DbPlayerPropData } from '../../shared/dbTasks/DbPlayerPropData';
import { DbGameBookData } from '../../shared/dbTasks/DbGameBookData';
import { SportsBookController } from '../../shared/Controllers/SportsBookController';




export class draftKingsApiController {

  static playerProps: any
  static playerPropData: DbPlayerPropData[] = []
  static selectedSportGames: any;
  static selectedSportsData: any;
  static sportsBookData: DbGameBookData[] = []

  static sportsToTitle: SportsTitleToName = {
    NBA: "basketball_nba",
    NFL: "americanfootball_nfl",
    MLB: "baseball_mlb",
    NHL: "icehockey_nhl"
  }



  static async getPlayerProps(sport: string, game: string) {
    var urlNew = '';
    var playerProps = '';
    if (sport === "MLB") {
      playerProps = "batter_home_runs,batter_hits,batter_total_bases"

    }
    if (sport === "NHL") {
      playerProps = "player_points,player_assists,player_shots_on_goal"

    }
    if (sport == "NBA") {
      playerProps = "player_points,player_rebounds,player_assists,player_threes,player_double_double,player_blocks"
    }
    urlNew = "https://api.the-odds-api.com/v4/sports/" + this.convertSport(sport) + "/events/" + game + "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=" + playerProps + "&bookmakers=draftkings&oddsFormat=american";

    const promise = await fetch(urlNew);
    const processedResponse = await promise.json();
    this.playerProps = processedResponse;
    this.playerPropData = this.convertPropDataToInterface()
    return this.playerPropData
  }

  static convertPropDataToInterface() {
    var tempData: DbPlayerPropData[] = [];
    for (let j = 0; j < this.playerProps.bookmakers.length; j++) {
      for (let k = 0; k < this.playerProps.bookmakers[j].markets.length; k++) {
        for (let m = 0; m < this.playerProps.bookmakers[j].markets[k].outcomes.length; m++) {
          tempData.push({
            bookId: this.playerProps.id,
            sportKey: this.playerProps.sport_key,
            sportTitle: this.playerProps.sport_title,
            homeTeam: this.playerProps.home_team,
            awayTeam: this.playerProps.away_team,
            commenceTime: this.playerProps.commence_time,
            bookMaker: this.playerProps.bookmakers[j].title,
            marketKey: this.playerProps.bookmakers[j].markets[k].key,
            description: this.playerProps.bookmakers[j].markets[k].outcomes[m].name,
            playerName: this.playerProps.bookmakers[j].markets[k].outcomes[m].description,
            price: this.playerProps.bookmakers[j].markets[k].outcomes[m].price,
            point: this.playerProps.bookmakers[j].markets[k].outcomes[m].point != null ? this.playerProps.bookmakers[j].markets[k].outcomes[m].point : 0
          });
        }
      }

    }
    return tempData;
  }
  static convertSport(sport: any) {
    return this.sportsToTitle[sport];
  }



  public static async getSports() {
    const promise = await fetch("https://api.the-odds-api.com/v4/sports/?apiKey=5ab6923d5aa0ae822b05168709bb910c");
    const processedResponse = await promise.json();
    this.selectedSportGames = processedResponse;
    return processedResponse;
  }

  public static async getDatesAndGames(sport: string) {
    const sportNew = this.convertSport(sport);
    const apiCall = "https://api.the-odds-api.com/v4/sports/" + sportNew + "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american";
    const promise = await fetch(apiCall);
    const processedResponse = await promise.json();
    this.selectedSportsData = processedResponse;
    this.sportsBookData = await this.convertSportsDataToInterface()
    return this.sportsBookData;
  }

  static async convertSportsDataToInterface(): Promise<DbGameBookData[]> {
    var tempData: DbGameBookData[] = [];
    
    let nextBookSeq = 0

    //I want to check each individual prop to see what the seq is or if there is an entry at all 
    //becuase if in the big three there might nhot be a spread at first then if I look at the book id, 
    //there alreqady is something for that id and it will put the spread at a later one and not put in a zero seq
    

    for (let i = 0; i < this.selectedSportsData.length; i++) {
      let bookDb = await SportsBookController.loadMaxBookSeqByBookId(this.selectedSportsData[i].id)
      if (bookDb.length == 0) {
        console.log("bookseq equals zero")
        nextBookSeq = 0
      }
      else {
        console.log("bookseq not zero")
        console.log(bookDb[0].bookId)
        nextBookSeq = bookDb[0].bookSeq + 1
      }
      for (let j = 0; j < this.selectedSportsData[i].bookmakers.length; j++) {
        for (let k = 0; k < this.selectedSportsData[i].bookmakers[j].markets.length; k++) {
          let selectedProp = bookDb.filter(e => e.marketKey == this.selectedSportsData.bookmakers[j].markets[k].key)
        if(selectedProp.length == 0){
          nextBookSeq = 0
        }
        else{ 
          let highestSeq = 0
          selectedProp.forEach(e => {
            if(highestSeq < e.bookSeq){
              highestSeq = e.bookSeq
            }
          })
          nextBookSeq = highestSeq + 1
        }
          for (let m = 0; m < this.selectedSportsData[i].bookmakers[j].markets[k].outcomes.length; m++) {
            tempData.push({
              bookId: this.selectedSportsData[i].id,
              sportKey: this.selectedSportsData[i].sport_key,
              sportTitle: this.selectedSportsData[i].sport_title,
              homeTeam: this.selectedSportsData[i].home_team,
              awayTeam: this.selectedSportsData[i].away_team,
              commenceTime: this.selectedSportsData[i].commence_time,
              bookMaker: this.selectedSportsData[i].bookmakers[j].title,
              marketKey: this.selectedSportsData[i].bookmakers[j].markets[k].key,
              teamName: this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].name,
              price: this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].price,
              point: this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].point != null ? this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].point : 0,
              bookSeq: nextBookSeq
            });
          }
        }
      }
    }
    return tempData;
  }

  static async convertSportsSinglePropDataToInterface(): Promise<DbGameBookData[]> {
    var tempData: DbGameBookData[] = [];
    let bookDb = await SportsBookController.loadAllBookDataByBookId(this.selectedSportsData.id)
    let nextBookSeq = 0

    for (let j = 0; j < this.selectedSportsData.bookmakers.length; j++) {
      for (let k = 0; k < this.selectedSportsData.bookmakers[j].markets.length; k++) {
        let selectedProp = bookDb.filter(e => e.marketKey == this.selectedSportsData.bookmakers[j].markets[k].key)
        if(selectedProp.length == 0){
          nextBookSeq = 0
        }
        else{ 
          let highestSeq = 0
          selectedProp.forEach(e => {
            if(highestSeq < e.bookSeq){
              highestSeq = e.bookSeq
            }
          })
          nextBookSeq = highestSeq + 1
        }
        for (let m = 0; m < this.selectedSportsData.bookmakers[j].markets[k].outcomes.length; m++) {
          tempData.push({
            bookId: this.selectedSportsData.id,
            sportKey: this.selectedSportsData.sport_key,
            sportTitle: this.selectedSportsData.sport_title,
            homeTeam: this.selectedSportsData.home_team,
            awayTeam: this.selectedSportsData.away_team,
            commenceTime: this.selectedSportsData.commence_time,
            bookMaker: this.selectedSportsData.bookmakers[j].title,
            marketKey: this.selectedSportsData.bookmakers[j].markets[k].key,
            teamName: this.selectedSportsData.bookmakers[j].markets[k].outcomes[m].name,
            price: this.selectedSportsData.bookmakers[j].markets[k].outcomes[m].price,
            point: this.selectedSportsData.bookmakers[j].markets[k].outcomes[m].point != null ? this.selectedSportsData.bookmakers[j].markets[k].outcomes[m].point : 0,
            bookSeq: nextBookSeq
          });
        }
      }
    }

    return tempData;
  }

  public static async getSpecificPropByBookId(bookId: string, prop: string, sport: string) {
    let sportNew = this.convertSport(sport)
    let url = "https://api.the-odds-api.com/v4/sports/" + sportNew + "/events/" + bookId + "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=" + prop + "&bookmakers=draftkings&oddsFormat=american";
    try {
      const promise = await fetch(url);
      const processedResponse = await promise.json();
      this.selectedSportsData = processedResponse;
      this.sportsBookData = await this.convertSportsSinglePropDataToInterface()

    } catch (error: any) {
      console.log(error.message)
    }
    return this.sportsBookData;

  }



}