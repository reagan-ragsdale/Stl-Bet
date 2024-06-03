import { ArrayOfDates } from "../array-of-dates";
import { SportsNameToId } from "../sports-name-to-id";
import { SportsTitleToName } from "../sports-titel-to-name";



export class reusedFunctions {
  static arrayOfDates: ArrayOfDates = { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }
  static arrayOfMLBTeams: SportsTitleToName = { Minnesota_Twins: "MIN", Detroit_Tigers: "DET", Cincinnati_Reds: "CIN", Chicago_Cubs: "CHC", Milwaukee_Brewers: "MIL", Philadelphia_Phillies: "PHI", Oakland_Athletics: "OAK", Los_Angeles_Angels: "LAA", Pittsburgh_Pirates: "PIT", Cleveland_Guardians: "CLE", Tampa_Bay_Rays: "TB", Boston_Red_Socks: "BOS", Seattle_Mariners: "SEA", Miami_Marlins: "MIA", Los_Angeles_Dodgers: "LAD", New_York_Yankees: "NYY", Washington_Nationals: "WAS", New_York_Mets: "NYM", San_Francisco_Giants: "SF", Kansas_City_Royals: "KC", Chicago_White_Sox: "CHW", Atlanta_Braves: "ATL", St_Louis_Cardinals: "STL", Arizona_Diamondbacks: "ARI", Baltimore_Orioles: "BAL", Colorado_Rockies: "COL", Houston_Astros: "HOU", San_Diego_Padres: "SD", Texas_Rangers: "TEX", Toronto_Blue_Jays: "TOR" };
  static arrayOfNBATeams: SportsNameToId = { Atlanta_Hawks: 1, Boston_Celtics: 2, Brooklyn_Nets: 4, Charlotte_Hornets: 5, Chicago_Bulls: 6, Cleveland_Cavaliers: 7, Dallas_Mavericks: 8, Denver_Nuggets: 9, Detroit_Pistons: 10, Golden_State_Warriors: 11, Houston_Rockets: 14, Indiana_Pacers: 15, Los_Angeles_Clippers: 16, Los_Angeles_Lakers: 17, Memphis_Grizzlies: 19, Miami_Heat: 20, Milwaukee_Bucks: 21, Minnesota_Timberwolves: 22, New_Orleans_Pelicans: 23, New_York_Knicks: 24, Oklahoma_City_Thunder: 25, Orlando_Magic: 26, Philadelphia_76ers: 27, Phoenix_Suns: 28, Portland_Trail_Blazers: 29, Sacramento_Kings: 30, San_Antonio_Spurs: 31, Toronto_Raptors: 38, Utah_Jazz: 40, Washington_Wizards: 41 }
  static teamNamesToAbvr: {[key: string]: string} = { "Arizona Diamondbacks": "ARI", "Atlanta Braves": "ATL", "Baltimore Orioles": "BAL", "Boston Red Sox": "BOS", "Chicago Cubs": "CHC", "Chicago White Sox": "CHW", "Cincinnati Reds": "CIN", "Cleveland Guardians": "CLE", "Colorado Rockies": "COL", "Detroit Tigers": "DET", "Houston Astros": "HOU", "Kansas City Royals": "KC", "Los Angeles Angels": "LAA", "Los Angeles Dodgers": "LAD", "Miami Marlins": "MIA", "Milwaukee Brewers": "MIL", "Minnesota Twins": "MIN", "New York Mets": "NYM", "New York Yankees": "NYY", "Oakland Athletics": "OAK", "Philadelphia Phillies": "PHI", "Pittsburgh Pirates": "PIT", "San Diego Padres": "SD", "San Francisco Giants": "SF", "Seattle Mariners": "SEA", "St. Louis Cardinals": "STL", "Tampa Bay Rays": "TB", "Texas Rangers": "TEX", "Toronto Blue Jays": "TOR", "Washington Nationals": "WAS",
  "Atlanta Hawks": "ATL", "Boston Celtics": "BOS", "Brooklyn Nets": "BKN", "Charlotte Hornets": "CHA", "Chicago Bulls": "CHI", "Cleveland Cavaliers": "CLE", "Dallas Mavericks": "DAL", "Denver Nuggets": "DEN", "Detroit Pistons": "DET", "Golden State Warriors": "GSW", "Houston Rockets": "HOU", "Indiana Pacers": "IND", "Los Angeles Clippers": "LAC", "Los Angeles Lakers": "LAL", "Memphis Grizzlies": "MEM", "Miami Heat": "MIA", "Milwaukee Bucks": "MIL", "Minnesota Timberwolves": "MIN", "New Orleans Pelicans": "NOP", "New York Knicks": "NYK", "Oklahoma City Thunder": "OKC", "Orlando Magic": "ORL", "Philadelphia 76ers": "PHI", "Phoenix Suns": "PHX", "Portland Trail Blazers": "POR", "Sacramento Kings": "SAC", "San Antonio Spurs": "SAS", "Toronto Raptors": "TOR", "Utah Jazz": "UTA", "Washington Wizards": "WAS"
   }


  static convertDate(fullDate: string): string {
    var tempDate = fullDate?.split("T");
    var time = tempDate[1].slice(0, 2)
    var subtractDay = false
    if (parseInt(time) - 5 <= 0) {
      subtractDay = true
    }

    var indexOfFirstDash = tempDate[0].indexOf("-");
    var tempDate2 = tempDate[0].slice(indexOfFirstDash + 1, tempDate[0].length + 1);
    var finalDate = tempDate2.replace("-", "/");
    if (subtractDay) {
      var newDate = finalDate.split("/")
      newDate[1] = (parseInt(newDate[1]) - 1).toString()
      if (parseInt(newDate[1]) < 10 && parseInt(newDate[1]) > 0) {
        newDate[1] = '0' + newDate[1]
      }
      if (parseInt(newDate[1]) == 0) {
        if (newDate[0] == '01') {
          newDate[0] = '12'
          newDate[1] = '31'
        }
        if (parseInt(newDate[0]) != 1) {
          newDate[0] = (parseInt(newDate[0]) - 1).toString()
          newDate[1] = this.arrayOfDates[parseInt(newDate[0])].toString()
        }

      }
      finalDate = newDate[0] + "/" + newDate[1]

    }

    return finalDate;
  }

  static addUnderScoreToName(game: string): string {
    game = game.replaceAll(" ", "_")
    return game;
  }

  static addDash(team: string): string {
    let name = team;
    name = name.replaceAll(" ", "-")
    return name
  }

  static getPreviousDateYMD(): string {
    var d = new Date();
    var year = d.getFullYear().toString();
    
    var day = (d.getDate() - 1)
    var month = d.getMonth() + 1;
    var monthNew = month.toString()
    var dayNew = day.toString()
    if(day == 0){
      if(month == 1){
        month = 12
        day = 31
      }
      else{
        month = month - 1
        day = this.arrayOfDates[month]
      }
      monthNew = month.toString()
      dayNew = day.toString()
    }
    if (dayNew.length == 1) {
      dayNew = "0" + dayNew;
    }
    
    if (monthNew.length == 1) {
      monthNew = "0" + monthNew;
    }
    var fullDate = year+monthNew+dayNew
    return fullDate
  }

  static convertDateToDateTime(fullDate: string) : string{
    var tempDate = fullDate?.split("T");
    var time = tempDate[1].slice(0, 2)
    var subtractDay = false
    if (parseInt(time) - 5 <= 0) {
      subtractDay = true
    }
    var timeHourMinute = tempDate[1].slice(0, 5)
    let hour = timeHourMinute.slice(0, 2)
    let minute = timeHourMinute.slice(2)
    if(parseInt(hour) < 5){
      hour = (24 - (5 - parseInt(hour))).toString() 
    }
    else if(parseInt(hour) == 5){
      hour = "00"
    }

    var indexOfFirstDash = tempDate[0].indexOf("-");
    var tempDate2 = tempDate[0].slice(indexOfFirstDash + 1, tempDate[0].length + 1);
    var finalDate = tempDate2.replace("-", "/");
    if (subtractDay) {
      var newDate = finalDate.split("/")
      newDate[1] = (parseInt(newDate[1]) - 1).toString()
      if (parseInt(newDate[1]) < 10 && parseInt(newDate[1]) > 0) {
        newDate[1] = '0' + newDate[1]
      }
      if (parseInt(newDate[1]) == 0) {
        if (newDate[0] == '01') {
          newDate[0] = '12'
          newDate[1] = '31'
        }
        if (parseInt(newDate[0]) != 1) {
          newDate[0] = (parseInt(newDate[0]) - 1).toString()
          newDate[1] = this.arrayOfDates[parseInt(newDate[0])].toString()
        }

      }
      finalDate = newDate[0] + "/" + newDate[1]

    }

    return finalDate + " " + hour + minute;
  }

  static convertTimestampToTime(fullTime: string): string {
    var finalTime = ''
    var amPm = 'AM'
    var tempDate = fullTime?.split("T");
    var time = tempDate[1].slice(0, 2)
    var subtractDay = false
    if (parseInt(time) - 5 <= 0) {
      subtractDay = true
    }
    var timeHourMinute = tempDate[1].slice(0, 5)
    let hour = timeHourMinute.slice(0, 2)
    let minute = timeHourMinute.slice(2)
    if(parseInt(hour) < 5){
      hour = (24 - (5 - parseInt(hour))).toString() 
    }
    else if(parseInt(hour) == 5){
      hour = "24"
    }
    else{
      hour = (parseInt(hour) - 5).toString()
    }

    if(parseInt(hour) > 12){
      hour = (parseInt(hour) - 12).toString()
      amPm = "PM"
    }
    else if(parseInt(hour) == 12){
      amPm = "PM"
    }
    if(hour == "24"){
      hour = "12"
    }
    finalTime = hour + minute + " " + amPm

    return finalTime
  }

  static convertCommenceTime(date: string):string{
    let day = date.slice(0,3)
    let index = date.indexOf(':')
    let time = date.slice(index-2, index+3)
    let AMPM = 'AM'
    let hour = time.slice(0,2)
    let minute = time.slice(3)
    let hourNumber = Number(hour)
    if(hourNumber >= 12){
      AMPM = 'PM'
      if(hourNumber > 12){
        hourNumber = hourNumber - 12
        
      }
      hour = hourNumber.toString()
    }
    return day + " " + hour + ":" + minute + " " + AMPM
  }

  static getHomeAwayFromGameId(gameId: string, teamName: string):string{
    let homeAway = ''

    let teams = gameId.slice(gameId.indexOf('_'))
    let awayTeam = teams.slice(0, teams.indexOf('@'))
    if(teamName == awayTeam){
      homeAway == 'away'
    }
    else{
      homeAway == 'home'
    }

    return homeAway
  }









  // me creating my own js built in functions to understand how they work better

  static myForEach(array: any[]){

  }

}