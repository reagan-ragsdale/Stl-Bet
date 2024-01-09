


import { SportsTitleToName } from '../sports-titel-to-name';
import { DbPlayerPropData } from 'src/shared/dbTasks/DbPlayerPropData';
import { DbGameBookData } from 'src/shared/dbTasks/DbGameBookData';




export class draftKingsApiController {

  playerProps: any
  playerPropData: DbPlayerPropData[] = []
  selectedSportGames: any;
  selectedSportsData: any;
  sportsBookData: DbGameBookData[] = []

  sportsToTitle: SportsTitleToName = {
    NBA: "basketball_nba",
    NFL: "americanfootball_nfl",
    MLB: "baseball_mlb",
    NHL: "icehockey_nhl"
  }


  async getPlayerProps(sport: string, game: string) {
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

  convertPropDataToInterface() {
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
  convertSport(sport: any) {
    return this.sportsToTitle[sport];
  }



  public async getSports() {
    const promise = await fetch("https://api.the-odds-api.com/v4/sports/?apiKey=5ab6923d5aa0ae822b05168709bb910c");
    const processedResponse = await promise.json();
    this.selectedSportGames = processedResponse;
    return processedResponse;
  }
 
  public async getDatesAndGames(sport: string) {
    const sportNew = this.convertSport(sport);
    const apiCall = "https://api.the-odds-api.com/v4/sports/" + sportNew + "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american";
    const promise = await fetch(apiCall);
    const processedResponse = await promise.json();
    this.selectedSportsData = processedResponse;
    this.sportsBookData = this.convertSportsDataToInterface()
    return this.sportsBookData;
  }

  convertSportsDataToInterface(): DbGameBookData[] {
    var tempData: DbGameBookData[] = [];
    for (let i = 0; i < this.selectedSportsData.length; i++) {
      for (let j = 0; j < this.selectedSportsData[i].bookmakers.length; j++) {
        for (let k = 0; k < this.selectedSportsData[i].bookmakers[j].markets.length; k++) {
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
              point: this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].point != null ? this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].point : 0
            });
          }
        }
      }
    }
    return tempData;
  }


  
}