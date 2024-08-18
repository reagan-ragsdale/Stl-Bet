"use strict";
(self["webpackChunkremult_angular_todo"] = self["webpackChunkremult_angular_todo"] || []).push([["main"],{

/***/ 4243:
/*!************************************************!*\
  !*** ./src/app/ApiCalls/draftKingsApiCalls.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   draftKingsApiController: () => (/* binding */ draftKingsApiController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);


class draftKingsApiController {
  constructor() {
    this.playerPropData = [];
    this.sportsBookData = [];
    this.sportsToTitle = {
      NBA: "basketball_nba",
      NFL: "americanfootball_nfl",
      MLB: "baseball_mlb",
      NHL: "icehockey_nhl"
    };
  }
  getPlayerProps(sport, game) {
    var _this = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      console.log(game);
      var urlNew = '';
      var playerProps = '';
      if (sport === "MLB") {
        playerProps = "batter_home_runs,batter_hits,batter_total_bases";
      }
      if (sport === "NHL") {
        playerProps = "player_points,player_assists,player_shots_on_goal";
      }
      if (sport == "NBA") {
        playerProps = "player_points,player_rebounds,player_assists,player_threes,player_double_double,player_blocks";
      }
      urlNew = "https://api.the-odds-api.com/v4/sports/" + _this.convertSport(sport) + "/events/" + game + "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=" + playerProps + "&bookmakers=draftkings&oddsFormat=american";
      const promise = yield fetch(urlNew);
      const processedResponse = yield promise.json();
      _this.playerProps = processedResponse;
      _this.playerPropData = _this.convertPropDataToInterface();
      console.log(_this.playerProps);
      return _this.playerPropData;
    })();
  }
  convertPropDataToInterface() {
    var tempData = [];
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
    console.log(tempData);
    return tempData;
  }
  convertSport(sport) {
    return this.sportsToTitle[sport];
  }
  getSports() {
    var _this2 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const promise = yield fetch("https://api.the-odds-api.com/v4/sports/?apiKey=5ab6923d5aa0ae822b05168709bb910c");
      const processedResponse = yield promise.json();
      _this2.selectedSportGames = processedResponse;
      console.log(processedResponse);
      return processedResponse;
    })();
  }
  //: Promise<DbNHLGameBookData[]>
  getDatesAndGames(sport) {
    var _this3 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const sportNew = _this3.convertSport(sport);
      const apiCall = "https://api.the-odds-api.com/v4/sports/" + sportNew + "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american";
      const promise = yield fetch(apiCall);
      const processedResponse = yield promise.json();
      _this3.selectedSportsData = processedResponse;
      _this3.sportsBookData = _this3.convertSportsDataToInterface();
      return _this3.sportsBookData;
    })();
  }
  convertSportsDataToInterface() {
    var tempData = [];
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
    console.log(tempData);
    return tempData;
  }
  static #_ = this.ɵfac = function draftKingsApiController_Factory(t) {
    return new (t || draftKingsApiController)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: draftKingsApiController,
    factory: draftKingsApiController.ɵfac
  });
}

/***/ }),

/***/ 9637:
/*!*****************************************!*\
  !*** ./src/app/ApiCalls/nbaApiCalls.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nbaApiController: () => (/* binding */ nbaApiController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/shared/Controllers/NbaController */ 3777);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);



class nbaApiController {
  constructor() {
    this.arrayOfNBATeams = {
      Atlanta_Hawks: 1,
      Boston_Celtics: 2,
      Brooklyn_Nets: 4,
      Charlotte_Hornets: 5,
      Chicago_Bulls: 6,
      Cleveland_Cavaliers: 7,
      Dallas_Mavericks: 8,
      Denver_Nuggets: 9,
      Detroit_Pistons: 10,
      Golden_State_Warriors: 11,
      Houston_Rockets: 14,
      Indiana_Pacers: 15,
      Los_Angeles_Clippers: 16,
      Los_Angeles_Lakers: 17,
      Memphis_Grizzlies: 19,
      Miami_Heat: 20,
      Milwaukee_Bucks: 21,
      Minnesota_Timberwolves: 22,
      New_Orleans_Pelicans: 23,
      New_York_Knicks: 24,
      Oklahoma_City_Thunder: 25,
      Orlando_Magic: 26,
      Philadelphia_76ers: 27,
      Phoenix_Suns: 28,
      Portland_Trail_Blazers: 29,
      Sacramento_Kings: 30,
      San_Antonio_Spurs: 31,
      Toronto_Raptors: 38,
      Utah_Jazz: 40,
      Washington_Wizards: 41
    };
    this.nbaPlayerStatData = [];
    this.playerStatData = [];
  }
  getNbaPlayerDataFromApi(games) {
    var _this = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      var gameArray = _this.splitGameString(games);
      var temp = [];
      for (let i = 0; i < gameArray.length; i++) {
        let teamId = _this.arrayOfNBATeams[_this.addUnderScoreToName(gameArray[i])];
        const url = `https://api-nba-v1.p.rapidapi.com/players?team=${teamId}&season=2023`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
          }
        };
        try {
          const response = yield fetch(url, options);
          const result = yield response.json();
          const processedResult = result.response;
          processedResult.forEach(e => {
            if (e.firstname.includes("Jr.")) {
              e.firstname = e.firstname.replace("Jr.", "");
              e.firstname = e.firstname.trim();
              e.lastname += " Jr";
            }
            if (e.firstname.includes("II")) {
              e.firstname = e.firstname.replace("II", "");
              e.firstname = e.firstname.trim();
              e.lastname += " II";
            }
            if (e.firstname.includes("III")) {
              e.firstname = e.firstname.replace("III", "");
              e.firstname = e.firstname.trim();
              e.lastname += " III";
            }
            if (e.firstname.includes("IV")) {
              e.firstname = e.firstname.replace("IV", "");
              e.firstname = e.firstname.trim();
              e.lastname += " IV";
            }
            console.log(e.firstname);
            console.log(e.lastname);
            if (e.lastname.toLowerCase() == "claxton" && e.firstname.toLowerCase() == "nic") {
              e.firstname = "Nicolas";
            }
            var playerName = e.firstname + " " + e.lastname;
            if (playerName.includes(".")) {
              playerName = playerName.replaceAll(".", "");
            }
            temp.push({
              playerId: e.id,
              playerName: playerName,
              teamId: teamId
            });
          });
        } catch (error) {
          console.error(error);
        }
      }
      return temp;
    })();
  }
  loadNba2022PlayerStatData(id) {
    var _this2 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?id=${id}&season=2022`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
      };
      const promise = yield fetch(url, options);
      const processedResponse = yield promise.json();
      _this2.playerStatData = processedResponse.response;
      yield _this2.convertNbaStatDataToInterface(id, 2022).then(items => _this2.nbaPlayerStatData = items);
      return _this2.nbaPlayerStatData;
    })();
  }
  loadNba2023PlayerStatData(id) {
    var _this3 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?id=${id}&season=2023`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
      };
      const promise = yield fetch(url, options);
      const processedResponse = yield promise.json();
      _this3.playerStatData = processedResponse.response;
      _this3.nbaPlayerStatData = yield _this3.convertNbaStatDataToInterface(id, 2023);
      return _this3.nbaPlayerStatData;
    })();
  }
  convertNbaStatDataToInterface(id, season) {
    var _this4 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      var temp = [];
      var player = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_1__.NbaController.nbaLoadPlayerInfoFromId(id);
      for (let i = 0; i < _this4.playerStatData.length; i++) {
        if (_this4.playerStatData[i].game.id >= 12478 && _this4.playerStatData[i].game.id <= 12548) {
          continue;
        }
        var game = yield _this4.loadGameFromId(_this4.playerStatData[i].game.id);
        temp.push({
          playerId: _this4.playerStatData[i].player.id,
          playerName: _this4.playerStatData[i].player.firstname + " " + _this4.playerStatData[i].player.lastname,
          teamName: _this4.playerStatData[i].team.name,
          teamId: _this4.playerStatData[i].team.id,
          teamAgainstName: _this4.arrayOfNBATeams[_this4.addUnderScoreToName(game.teams.visitors.name)] == _this4.playerStatData[i].team.id ? game.teams.home.name : game.teams.visitors.name,
          teamAgainstId: _this4.arrayOfNBATeams[_this4.addUnderScoreToName(game.teams.visitors.name)] == _this4.playerStatData[i].team.id ? game.teams.home.id : game.teams.visitors.id,
          homeOrAway: _this4.arrayOfNBATeams[_this4.addUnderScoreToName(game.teams.visitors.name)] == _this4.playerStatData[i].team.id ? "Away" : "Home",
          season: season,
          gameId: _this4.playerStatData[i].game.id,
          gameDate: _this4.convertDate(game.date.start),
          playerStarted: _this4.playerStatData[i].min != "00:00" ? "Y" : "N",
          assists: _this4.playerStatData[i].assists,
          points: _this4.playerStatData[i].points,
          fgm: _this4.playerStatData[i].fgm,
          fga: _this4.playerStatData[i].fga,
          fgp: parseInt(_this4.playerStatData[i].fgp),
          ftm: _this4.playerStatData[i].ftm,
          fta: _this4.playerStatData[i].fta,
          ftp: parseInt(_this4.playerStatData[i].ftp),
          tpm: _this4.playerStatData[i].tpm,
          tpa: _this4.playerStatData[i].tpa,
          tpp: parseInt(_this4.playerStatData[i].tpp),
          offReb: _this4.playerStatData[i].offReb,
          defReb: _this4.playerStatData[i].defReb,
          totReb: _this4.playerStatData[i].totReb,
          pFouls: _this4.playerStatData[i].pFouls,
          steals: _this4.playerStatData[i].steals,
          turnover: _this4.playerStatData[i].turnovers,
          blocks: _this4.playerStatData[i].blocks,
          doubleDouble: _this4.isDoubleDouble(_this4.playerStatData[i]) == true ? 1 : 0,
          tripleDouble: _this4.isTripleDouble(_this4.playerStatData[i]) == true ? 1 : 0
        });
      }
      return temp;
    })();
  }
  loadGameFromId(id) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `https://api-nba-v1.p.rapidapi.com/games?id=${id}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
      };
      const response = yield fetch(url, options);
      const result = yield response.json();
      return result.response[0];
    })();
  }
  isDoubleDouble(statData) {
    let count = 0;
    if (statData.assists >= 10) {
      count++;
    }
    if (statData.points >= 10) {
      count++;
    }
    if (statData.blocks >= 10) {
      count++;
    }
    if (statData.steals >= 10) {
      count++;
    }
    if (statData.totReb >= 10) {
      count++;
    }
    if (count >= 2) {
      return true;
    } else {
      return false;
    }
  }
  isTripleDouble(statData) {
    let count = 0;
    if (statData.assists >= 10) {
      count++;
    }
    if (statData.points >= 10) {
      count++;
    }
    if (statData.blocks >= 10) {
      count++;
    }
    if (statData.steals >= 10) {
      count++;
    }
    if (statData.rebounds >= 10) {
      count++;
    }
    if (count >= 3) {
      return true;
    } else {
      return false;
    }
  }
  splitGameString(game) {
    var bothGames = [];
    var temp = '';
    var vsIndex = 0;
    vsIndex = game.indexOf("vs");
    bothGames.push(game.slice(0, vsIndex - 1));
    bothGames.push(game.slice(vsIndex + 3, game.length));
    return bothGames;
  }
  addUnderScoreToName(game) {
    game = game.replaceAll(" ", "_");
    return game;
  }
  convertDate(fullDate) {
    var tempDate = fullDate?.split("T");
    var time = tempDate[1].slice(0, 2);
    var subtractDay = false;
    if (parseInt(time) - 6 <= 0) {
      subtractDay = true;
    }
    var indexOfFirstDash = tempDate[0].indexOf("-");
    var tempDate2 = tempDate[0].slice(indexOfFirstDash + 1, tempDate[0].length + 1);
    var finalDate = tempDate2.replace("-", "/");
    if (subtractDay) {
      //finalDate = finalDate.replace(finalDate.charAt(finalDate.length-1) , (parseInt(finalDate.charAt(finalDate.length-1))-1).toString())
      var newDate = finalDate.split("/");
      newDate[1] = (parseInt(newDate[1]) - 1).toString();
      finalDate = newDate[0] + "/" + newDate[1];
    }
    return finalDate;
  }
  static #_ = this.ɵfac = function nbaApiController_Factory(t) {
    return new (t || nbaApiController)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: nbaApiController,
    factory: nbaApiController.ɵfac
  });
}

/***/ }),

/***/ 1296:
/*!*****************************************!*\
  !*** ./src/app/ApiCalls/nhlApiCalls.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nhlApiController: () => (/* binding */ nhlApiController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var src_shared_Controllers_NhlPlayerInfoController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/shared/Controllers/NhlPlayerInfoController */ 8994);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);



class nhlApiController {
  constructor() {
    this.nhlPlayerStatData = [];
    this.nhlPlayerInfo = [];
  }
  loadNhl2022PlayerStatData(id) {
    var _this = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=gameLog&season=20222023`;
      const promise = yield fetch(url);
      const processedResponse = yield promise.json();
      _this.playerStatData = processedResponse;
      yield _this.convertNhlStatDataToInterface(id).then(items => _this.nhlPlayerStatData = items);
      return _this.nhlPlayerStatData;
    })();
  }
  loadNhl2023PlayerStatData(id) {
    var _this2 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=gameLog&season=20232024`;
      const promise = yield fetch(url);
      const processedResponse = yield promise.json();
      _this2.playerStatData = processedResponse;
      _this2.nhlPlayerStatData = yield _this2.convertNhlStatDataToInterface(id);
      return _this2.nhlPlayerStatData;
    })();
  }
  convertNhlStatDataToInterface(id) {
    var _this3 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      var temp = [];
      var player = yield src_shared_Controllers_NhlPlayerInfoController__WEBPACK_IMPORTED_MODULE_1__.NhlPlayerInfoController.nhlLoadPlayerInfoFromId(id);
      for (let i = 0; i < _this3.playerStatData.stats[0].splits.length; i++) {
        temp.push({
          playerId: id,
          playerName: player[0].playerName,
          teamName: _this3.playerStatData.stats[0].splits[i].team.name,
          teamId: _this3.playerStatData.stats[0].splits[i].team.id,
          gameDate: _this3.playerStatData.stats[0].splits[i].date,
          playerStarted: _this3.playerStatData.stats[0].splits[i].stat.shifts > 0 ? "Y" : "N",
          assists: _this3.playerStatData.stats[0].splits[i].stat.assists,
          goals: _this3.playerStatData.stats[0].splits[i].stat.goals,
          pim: _this3.playerStatData.stats[0].splits[i].stat.pim,
          shots: _this3.playerStatData.stats[0].splits[i].stat.shots,
          shotPct: _this3.playerStatData.stats[0].splits[i].stat.shotPct,
          games: _this3.playerStatData.stats[0].splits[i].stat.games,
          hits: _this3.playerStatData.stats[0].splits[i].stat.hits,
          powerPlayGoals: _this3.playerStatData.stats[0].splits[i].stat.powerPlayGoals,
          powerPlayPoints: _this3.playerStatData.stats[0].splits[i].stat.powerPlayPoints,
          plusMinus: _this3.playerStatData.stats[0].splits[i].stat.plusMinus,
          points: _this3.playerStatData.stats[0].splits[i].stat.points,
          gameId: _this3.playerStatData.stats[0].splits[i].game.gamePk,
          teamAgainst: _this3.playerStatData.stats[0].splits[i].opponent.name,
          teamAgainstId: _this3.playerStatData.stats[0].splits[i].opponent.id,
          season: _this3.playerStatData.stats[0].splits[i].season,
          winLossTie: _this3.playerStatData.stats[0].splits[i].isWin == true ? "Win" : _this3.playerStatData.stats[0].splits[i].isOT == false ? "Loss" : "Tie"
        });
      }
      return temp;
    })();
  }
  getplayerInfo() {
    var _this4 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      var url = "https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster";
      const promise = yield fetch(url);
      const processedResponse = yield promise.json();
      _this4.playerInfo = processedResponse;
      _this4.nhlPlayerInfo = _this4.convertInfoDataToInterface();
      return _this4.nhlPlayerInfo;
    })();
  }
  convertInfoDataToInterface() {
    var temp = [];
    for (let i = 0; i < this.playerInfo.teams.length; i++) {
      for (let j = 0; j < this.playerInfo.teams[i].roster.roster.length; j++) {
        temp.push({
          playerId: this.playerInfo.teams[i].roster.roster[j].person.id,
          playerName: this.playerInfo.teams[i].roster.roster[j].person.fullName,
          teamName: this.playerInfo.teams[i].abbreviation,
          teamId: this.playerInfo.teams[i].id
        });
      }
    }
    return temp;
  }
  static #_ = this.ɵfac = function nhlApiController_Factory(t) {
    return new (t || nhlApiController)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: nhlApiController,
    factory: nhlApiController.ɵfac
  });
}

/***/ }),

/***/ 3966:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _homescreen_homescreen_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./homescreen/homescreen.component */ 9357);
/* harmony import */ var _prop_screen_prop_screen_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prop-screen/prop-screen.component */ 2972);
/* harmony import */ var _player_stats_player_stats_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player-stats/player-stats.component */ 1329);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);






const routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: 'home',
  component: _homescreen_homescreen_component__WEBPACK_IMPORTED_MODULE_0__.HomeScreenComponent
}, {
  path: 'props',
  component: _prop_screen_prop_screen_component__WEBPACK_IMPORTED_MODULE_1__.PropScreenComponent
}, {
  path: 'playerStats',
  component: _player_stats_player_stats_component__WEBPACK_IMPORTED_MODULE_2__.PlayerStatsComponent
}, {
  path: 'playerStats/:sport/:id',
  component: _player_stats_player_stats_component__WEBPACK_IMPORTED_MODULE_2__.PlayerStatsComponent
}];
class AppRoutingModule {
  static #_ = this.ɵfac = function AppRoutingModule_Factory(t) {
    return new (t || AppRoutingModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
    type: AppRoutingModule
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forRoot(routes), _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

/***/ }),

/***/ 6401:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 7947);


class AppComponent {
  static #_ = this.ɵfac = function AppComponent_Factory(t) {
    return new (t || AppComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: AppComponent,
    selectors: [["app-root"]],
    decls: 1,
    vars: 0,
    template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 8629:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 3966);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 6401);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ 4860);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! remult */ 726);
/* harmony import */ var _prop_screen_prop_screen_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prop-screen/prop-screen.component */ 2972);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/platform-browser/animations */ 4987);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/card */ 8497);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/toolbar */ 2484);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/icon */ 6515);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/sidenav */ 1465);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/list */ 3228);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/form-field */ 1333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/select */ 6355);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/tabs */ 989);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/table */ 6798);
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/grid-list */ 647);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/divider */ 9400);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/progress-bar */ 8173);
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/expansion */ 8060);
/* harmony import */ var _prop_screen_prop_checkout_prop_checkout_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./prop-screen/prop-checkout/prop-checkout.component */ 4269);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/dialog */ 7401);
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/slider */ 549);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/chips */ 1757);
/* harmony import */ var _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/cdk/scrolling */ 275);
/* harmony import */ var _homescreen_homescreen_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./homescreen/homescreen.component */ 9357);
/* harmony import */ var _player_stats_player_stats_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./player-stats/player-stats.component */ 1329);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/material/checkbox */ 6658);
/* harmony import */ var _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/material/autocomplete */ 9892);
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/material/slide-toggle */ 9293);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @angular/material/input */ 26);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 1699);


























//import { PredictionScreenComponent } from './prediction-screen/prediction-screen.component';









class AppModule {
  constructor(zone) {
    remult__WEBPACK_IMPORTED_MODULE_2__.remult.apiClient.wrapMessageHandling = handler => zone.run(() => handler());
  }
  static #_ = this.ɵfac = function AppModule_Factory(t) {
    return new (t || AppModule)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.NgZone));
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({
    type: AppModule,
    bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__.BrowserModule,
    /* RouterModule.forRoot([
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeScreenComponent},
      {path: 'props', component: PropScreenComponent},
    ]), */
    _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_11__.BrowserAnimationsModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_12__.MatButtonModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_13__.MatCardModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_14__.MatToolbarModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__.MatIconModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_16__.MatSidenavModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_17__.MatListModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__.MatFormFieldModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_19__.MatSelectModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_20__.MatTabsModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatTableModule, _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__.MatGridListModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_23__.MatDividerModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_24__.MatProgressBarModule, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_25__.MatExpansionModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_26__.MatDialogModule, _angular_material_slider__WEBPACK_IMPORTED_MODULE_27__.MatSliderModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_28__.MatChipsModule, _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_29__.ScrollingModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClientModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_30__.MatCheckboxModule, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_31__.MatAutocompleteModule, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_32__.MatSlideToggleModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_33__.MatInputModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.ReactiveFormsModule]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _prop_screen_prop_screen_component__WEBPACK_IMPORTED_MODULE_3__.PropScreenComponent, _prop_screen_prop_checkout_prop_checkout_component__WEBPACK_IMPORTED_MODULE_4__.PropCheckoutComponent, _homescreen_homescreen_component__WEBPACK_IMPORTED_MODULE_5__.HomeScreenComponent, _player_stats_player_stats_component__WEBPACK_IMPORTED_MODULE_6__.PlayerStatsComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__.BrowserModule,
    /* RouterModule.forRoot([
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeScreenComponent},
      {path: 'props', component: PropScreenComponent},
    ]), */
    _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_11__.BrowserAnimationsModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_12__.MatButtonModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_13__.MatCardModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_14__.MatToolbarModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__.MatIconModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_16__.MatSidenavModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_17__.MatListModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__.MatFormFieldModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_19__.MatSelectModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_20__.MatTabsModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatTableModule, _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__.MatGridListModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_23__.MatDividerModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_24__.MatProgressBarModule, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_25__.MatExpansionModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_26__.MatDialogModule, _angular_material_slider__WEBPACK_IMPORTED_MODULE_27__.MatSliderModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_28__.MatChipsModule, _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_29__.ScrollingModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClientModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_30__.MatCheckboxModule, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_31__.MatAutocompleteModule, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_32__.MatSlideToggleModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_33__.MatInputModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.ReactiveFormsModule]
  });
})();

/***/ }),

/***/ 9357:
/*!****************************************************!*\
  !*** ./src/app/homescreen/homescreen.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HomeScreenComponent: () => (/* binding */ HomeScreenComponent)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/card */ 8497);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/toolbar */ 2484);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 6515);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/sidenav */ 1465);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/chips */ 1757);










function HomeScreenComponent_mat_card_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-card")(1, "mat-card-content", 11)(2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Welcome, This application is currently a work in progress. It is designed to offer you the best stats before placing a bet");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function HomeScreenComponent_mat_card_23_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r2);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.propClicked());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Props");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "br")(7, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function HomeScreenComponent_mat_card_23_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r2);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r3.predictionClicked = true);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Predictions");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
}
class HomeScreenComponent {
  constructor(router) {
    this.router = router;
    this.title = 'angulardemo1';
    this.opened = false;
    this.clicked = false;
    this.predictionClicked = false;
    this.screen = '';
  }
  propClicked() {
    this.router.navigate(["/props"]);
  }
  buttonClick(event) {
    this.screen = event;
    //console.log(this.screen);
  }

  ngOnInit() {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {})();
  }
  static #_ = this.ɵfac = function HomeScreenComponent_Factory(t) {
    return new (t || HomeScreenComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: HomeScreenComponent,
    selectors: [["home-screen"]],
    decls: 25,
    vars: 2,
    consts: [["color", "primary", 1, "example-toolbar"], ["mat-icon-button", "", 3, "click"], [1, "example-app-name"], [1, "example-spacer"], ["aria-label", "Fish selection"], ["color", "accent", "selected", ""], ["color", "accent"], [2, "background-color", "black"], [3, "opened", "openedChange"], ["mat-raised-button", "", "color", "primary", 3, "click"], [4, "ngIf"], [1, "welcome"]],
    template: function HomeScreenComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-toolbar", 0)(1, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function HomeScreenComponent_Template_button_click_1_listener() {
          return ctx.opened = !ctx.opened;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "menu");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Sports Betting App");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "mat-chip-listbox", 4)(8, "mat-chip-option", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Draft Kings");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "mat-chip-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Fan Duel");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "mat-chip-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Barstool");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-sidenav-container", 7)(15, "mat-sidenav", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("openedChange", function HomeScreenComponent_Template_mat_sidenav_openedChange_15_listener($event) {
          return ctx.opened = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function HomeScreenComponent_Template_button_click_16_listener() {
          return ctx.clicked = true;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "Home");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function HomeScreenComponent_Template_button_click_18_listener() {
          return ctx.clicked = true;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "Sports Betting");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function HomeScreenComponent_Template_button_click_20_listener() {
          return ctx.clicked = true;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Player Stats");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "mat-sidenav-content");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, HomeScreenComponent_mat_card_23_Template, 10, 0, "mat-card", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("opened", ctx.opened);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.clicked && !ctx.predictionClicked);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterOutlet, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatIconButton, _angular_material_card__WEBPACK_IMPORTED_MODULE_5__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_5__.MatCardContent, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_6__.MatToolbar, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_8__.MatSidenav, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_8__.MatSidenavContainer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_8__.MatSidenavContent, _angular_material_chips__WEBPACK_IMPORTED_MODULE_9__.MatChipListbox, _angular_material_chips__WEBPACK_IMPORTED_MODULE_9__.MatChipOption],
    styles: ["mat-sidenav-container[_ngcontent-%COMP%] {\n  height: 93vh;\n}\n\nmat-sidenav[_ngcontent-%COMP%] {\n  width: 150px;\n  background-color: #eee;\n}\n\nmat-sidenav[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  columns: 1;\n  width: inherit;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n\n.sports-tab[_ngcontent-%COMP%] {\n  border-top: 2px solid white;\n}\n\n.welcome[_ngcontent-%COMP%] {\n  text-align: center;\n}\n\nmat-chip-option[_ngcontent-%COMP%] {\n  height: 75%;\n}\n\n.example-spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvaG9tZXNjcmVlbi9ob21lc2NyZWVuLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksWUFBQTtBQUFKOztBQUVBO0VBQ0ksWUFBQTtFQUNBLHNCQUFBO0FBQ0o7O0FBQ0E7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxVQUFBO0VBQ0EsY0FBQTtFQUNBLFNBQUE7RUFDQSxnQkFBQTtBQUVKOztBQUFBO0VBQ0ksMkJBQUE7QUFHSjs7QUFEQTtFQUNHLGtCQUFBO0FBSUg7O0FBRkE7RUFDSSxXQUFBO0FBS0o7O0FBSEE7RUFDSSxjQUFBO0FBTUoiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubWF0LXNpZGVuYXYtY29udGFpbmVye1xyXG4gICAgaGVpZ2h0OmNhbGMoMjA1dmggLSAxMTJ2aCk7XHJcbn1cclxubWF0LXNpZGVuYXZ7XHJcbiAgICB3aWR0aDoxNTBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XHJcbn1cclxubWF0LXNpZGVuYXYgYnV0dG9ue1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBjb2x1bW5zOiAxO1xyXG4gICAgd2lkdGg6IGluaGVyaXQ7XHJcbiAgICBnYXA6IDFyZW07XHJcbiAgICBtYXJnaW4tdG9wOiAxcmVtO1xyXG59IFxyXG4uc3BvcnRzLXRhYntcclxuICAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB3aGl0ZTtcclxufVxyXG4ud2VsY29tZXtcclxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcbm1hdC1jaGlwLW9wdGlvbntcclxuICAgIGhlaWdodDogNzUlO1xyXG59XHJcbi5leGFtcGxlLXNwYWNlciB7XHJcbiAgICBmbGV4OiAxIDEgYXV0bztcclxuICB9Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 1329:
/*!********************************************************!*\
  !*** ./src/app/player-stats/player-stats.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlayerStatsComponent: () => (/* binding */ PlayerStatsComponent)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var _ApiCalls_nbaApiCalls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ApiCalls/nbaApiCalls */ 9637);
/* harmony import */ var _ApiCalls_nhlApiCalls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ApiCalls/nhlApiCalls */ 1296);
/* harmony import */ var _ApiCalls_draftKingsApiCalls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ApiCalls/draftKingsApiCalls */ 4243);
/* harmony import */ var src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/Controllers/NbaController */ 3777);
/* harmony import */ var chart_js_auto__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! chart.js/auto */ 2112);
/* harmony import */ var chartjs_plugin_annotation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! chartjs-plugin-annotation */ 3225);
/* harmony import */ var src_shared_Controllers_NhlPlayerInfoController__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Controllers/NhlPlayerInfoController */ 8994);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/table */ 6798);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/form-field */ 1333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/select */ 6355);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/core */ 5309);
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/grid-list */ 647);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/checkbox */ 6658);
/* harmony import */ var _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/autocomplete */ 9892);
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/slide-toggle */ 9293);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/input */ 26);



























function PlayerStatsComponent_mat_option_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("onSelectionChange", function PlayerStatsComponent_mat_option_11_Template_mat_option_onSelectionChange_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r31);
      const player_r29 = restoredCtx.$implicit;
      const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r30.loadNewPlayer(player_r29.playerId, player_r29.playerName));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const player_r29 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", player_r29.playerName);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", player_r29.playerName, " ");
  }
}
function PlayerStatsComponent_li_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "li")(1, "mat-checkbox", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function PlayerStatsComponent_li_26_Template_mat_checkbox_ngModelChange_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r34);
      const box_r32 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](box_r32.showLine = $event);
    })("ngModelChange", function PlayerStatsComponent_li_26_Template_mat_checkbox_ngModelChange_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r34);
      const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r35.reDrawLineGraph());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const box_r32 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", box_r32.showLine)("color", box_r32.color);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", box_r32.label, " ");
  }
}
function PlayerStatsComponent_mat_option_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("onSelectionChange", function PlayerStatsComponent_mat_option_29_Template_mat_option_onSelectionChange_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r38);
      const season_r36 = restoredCtx.$implicit;
      const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r37.updateSeasonsDisplayed(season_r36));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const season_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", season_r36, " ");
  }
}
function PlayerStatsComponent_th_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Game ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function PlayerStatsComponent_td_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r39 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"](" ", element_r39.homeOrAway == "Away" ? "@" : "", "", element_r39.teamAgainstName, " ");
  }
}
function PlayerStatsComponent_td_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Average ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function PlayerStatsComponent_th_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function PlayerStatsComponent_td_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r42 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r42.gameDate, " ");
  }
}
function PlayerStatsComponent_td_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "td", 47);
  }
}
function PlayerStatsComponent_th_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Points ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function PlayerStatsComponent_td_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r43 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r43.points, " ");
  }
}
function PlayerStatsComponent_td_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r12.getTotalCost("points"), " ");
  }
}
function PlayerStatsComponent_th_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Assists ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function PlayerStatsComponent_td_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r44 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r44.assists, " ");
  }
}
function PlayerStatsComponent_td_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r15.getTotalCost("assists"), " ");
  }
}
function PlayerStatsComponent_th_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Rebounds ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function PlayerStatsComponent_td_53_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r45 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r45.totReb, " ");
  }
}
function PlayerStatsComponent_td_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r18.getTotalCost("totReb"), " ");
  }
}
function PlayerStatsComponent_th_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Blocks ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function PlayerStatsComponent_td_57_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r46 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r46.blocks, " ");
  }
}
function PlayerStatsComponent_td_58_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r21.getTotalCost("blocks"), " ");
  }
}
function PlayerStatsComponent_th_60_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Threes ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function PlayerStatsComponent_td_61_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r47 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r47.tpm, " ");
  }
}
function PlayerStatsComponent_td_62_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r24.getTotalCost("tpm"), " ");
  }
}
function PlayerStatsComponent_tr_63_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "tr", 48);
  }
}
function PlayerStatsComponent_tr_64_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "tr", 49);
  }
  if (rf & 2) {
    const row_r48 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("demo-row-is-clicked", row_r48.isHighlighted);
  }
}
function PlayerStatsComponent_tr_65_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "tr", 50);
  }
}
function PlayerStatsComponent_mat_form_field_72_mat_option_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r54 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("onSelectionChange", function PlayerStatsComponent_mat_form_field_72_mat_option_4_Template_mat_option_onSelectionChange_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r54);
      const stat_r51 = restoredCtx.$implicit;
      const forms_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().$implicit;
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r52.updateForm(forms_r49, stat_r51));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const stat_r51 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpropertyInterpolate"]("value", stat_r51.dataName);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](stat_r51.label);
  }
}
function PlayerStatsComponent_mat_form_field_72_Template(rf, ctx) {
  if (rf & 1) {
    const _r56 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-form-field", 51)(1, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "mat-select");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](4, PlayerStatsComponent_mat_form_field_72_mat_option_4_Template, 2, 2, "mat-option", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "input", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function PlayerStatsComponent_mat_form_field_72_Template_input_ngModelChange_5_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r56);
      const forms_r49 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](forms_r49.number = $event);
    })("click", function PlayerStatsComponent_mat_form_field_72_Template_input_click_5_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function PlayerStatsComponent_mat_form_field_72_Template_button_click_6_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r56);
      const forms_r49 = restoredCtx.$implicit;
      const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r58.deleteformArray(forms_r49));
    })("click", function PlayerStatsComponent_mat_form_field_72_Template_button_click_6_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7, "Delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const forms_r49 = ctx.$implicit;
    const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r28.fullDataset);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", forms_r49.number);
  }
}
class PlayerStatsComponent {
  constructor(router, route, nbaApiController, nhlApiController, draftKingsApiController) {
    this.router = router;
    this.route = route;
    this.nbaApiController = nbaApiController;
    this.nhlApiController = nhlApiController;
    this.draftKingsApiController = draftKingsApiController;
    this.myControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl('');
    this.displayedColumns = ["Game", "Date", "Points", "Assists", "Rebounds", "Blocks", "Threes"];
    //
    this.playerName = '';
    this.playerId = 0;
    this.selectedSport = '';
    this.selectedStatSearchNumber = 0;
    this.filteredSearch = [];
    this.searchName = '';
    this.playerAverage = 0;
    this.playerStd = 0;
    this.fullDataset = [{
      label: "Points",
      data: [],
      backgroundColor: 'blue',
      showLine: true,
      dataName: 'points'
    }, {
      label: "Assists",
      data: [],
      backgroundColor: 'green',
      showLine: false,
      dataName: 'assists'
    }, {
      label: "Rebounds",
      data: [],
      backgroundColor: 'red',
      showLine: false,
      dataName: 'totReb'
    }, {
      label: "Blocks",
      data: [],
      backgroundColor: 'yellow',
      showLine: false,
      dataName: 'blocks'
    }, {
      label: "Threes",
      data: [],
      backgroundColor: 'purple',
      showLine: false,
      dataName: 'tpm'
    }, {
      label: "Double Doubles",
      data: [],
      backgroundColor: 'orange',
      showLine: false,
      dataName: 'doubleDoubles'
    }];
    this.formArray = [];
    //line graph checkbox variables
    this.allComplete = false;
    this.showLinePoints = true;
    this.showLineAssists = false;
    this.showLineRebounds = false;
    this.showLineDoubleDoubles = false;
    this.showLineThrees = false;
    this.showLineBlocks = false;
    this.isCombineStats = false;
    this.seasonArray = [];
    this.seasonArrayTable = [];
    //nba
    this.nbaPlayerInfo = [];
    this.nbaPlayerStatsInfo2022 = [];
    this.nbaPlayerStatsInfo2023 = [];
    this.nbaAllPlayerInfo = [];
    this.nbaPlayerStatsInfo2023Table = [];
    this.nbaPlayerStatsInfo2022Table = [];
    this.playerSeasons = [];
    this.playerSeason = '2023';
    //nhl
    this.nhlPlayerInfo = [];
    this.nhlPlayerStatsInfo2022 = [];
    this.nhlPlayerStatsInfo2023 = [];
    this.nhlAllPlayerInfo = [];
  }
  loadData() {
    var _this = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.route.snapshot.paramMap.get('id') != null) {
        _this.playerId = _this.route.snapshot.paramMap.get('id');
      }
      if (_this.route.snapshot.paramMap.get('sport') != null) {
        _this.selectedSport = _this.route.snapshot.paramMap.get('sport');
      }
      yield _this.getPlayerInfo();
      yield _this.getAllPlayerInfo();
      _this.calculateMeanAndStd();
    })();
  }
  getPlayerInfo() {
    var _this2 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.selectedSport == "NBA") {
        _this2.selectedStatSearchNumber = 0;
        _this2.nbaPlayerInfo = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_4__.NbaController.nbaLoadPlayerInfoFromId(_this2.playerId);
        _this2.playerName = _this2.nbaPlayerInfo[0].playerName;
        _this2.nbaPlayerStatsInfo2022 = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_4__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(_this2.playerId, 2022);
        _this2.nbaPlayerStatsInfo2023 = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_4__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(_this2.playerId, 2023);
        _this2.nbaPlayerStatsInfo2023Table = structuredClone(_this2.nbaPlayerStatsInfo2023);
        _this2.nbaPlayerStatsInfo2023Table = _this2.nbaPlayerStatsInfo2023Table.reverse();
        _this2.nbaPlayerStatsInfo2023Table.forEach(e => e.isHighlighted = false);
        _this2.nbaPlayerStatsInfo2022Table = structuredClone(_this2.nbaPlayerStatsInfo2023);
        _this2.nbaPlayerStatsInfo2022Table = _this2.nbaPlayerStatsInfo2023Table.reverse();
        _this2.nbaPlayerStatsInfo2022Table.forEach(e => e.isHighlighted = false);
        _this2.searchName = _this2.playerName;
        _this2.playerSeasons.push("2023");
        if (_this2.nbaPlayerStatsInfo2022.length > 1) {
          _this2.playerSeasons.push("2022");
        }
        _this2.seasonArray = _this2.nbaPlayerStatsInfo2023;
        _this2.seasonArrayTable = _this2.nbaPlayerStatsInfo2023Table;
      }
      if (_this2.selectedSport == "NHL") {
        _this2.nhlPlayerInfo = yield src_shared_Controllers_NhlPlayerInfoController__WEBPACK_IMPORTED_MODULE_6__.NhlPlayerInfoController.nhlLoadPlayerInfoFromId(_this2.playerId);
        _this2.playerName = _this2.nbaPlayerInfo[0].playerName;
        _this2.nbaPlayerStatsInfo2022 = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_4__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(_this2.playerId, 2022);
        _this2.nbaPlayerStatsInfo2023 = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_4__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(_this2.playerId, 2023);
      }
    })();
  }
  getAllPlayerInfo() {
    var _this3 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3.selectedSport == "NBA") {
        _this3.nbaAllPlayerInfo = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_4__.NbaController.nbaLoadAllPlayerInfoFrom();
        _this3.filteredSearch = _this3.nbaAllPlayerInfo.filter(e => e.playerName == _this3.searchName);
      }
    })();
  }
  loadNewPlayer(id, name) {
    var _this4 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this4.playerId = id;
      yield _this4.getPlayerInfo();
      _this4.reDrawLineGraph();
      _this4.formArray = [];
    })();
  }
  calculateMeanAndStd() {
    this.playerAverage = this.seasonArray.map(t => t.points).reduce((acc, value) => acc + value, 0) / this.seasonArray.length;
    let summedData = 0;
    this.seasonArray.forEach(e => summedData += (e.points - this.playerAverage) ** 2);
    summedData = summedData / this.seasonArray.length;
    summedData = Math.sqrt(summedData);
    this.playerStd = summedData;
    console.log(this.playerStd);
  }
  searchNumberSubmit() {
    //for now we're going to make this just over and single stats
    console.log(this.formArray);
    // later we can add over or under and combined stats
    for (let i = 0; i < this.seasonArrayTable.length; i++) {
      for (let j = 0; j < this.formArray.length; j++) {
        console.log(this.seasonArrayTable[i][this.formArray[j].dataName] > this.formArray[j].number);
        if (this.seasonArrayTable[i][this.formArray[j].dataName] > this.formArray[j].number) {
          this.seasonArrayTable[i].isHighlighted = true;
        } else {
          this.seasonArrayTable[i].isHighlighted = false;
          break;
        }
      }
    }
  }
  clearSearch() {
    this.seasonArrayTable.forEach(e => {
      e.isHighlighted = false;
    });
  }
  filterSearch() {
    this.filteredSearch = this.nbaAllPlayerInfo.filter(e => e.playerName.toLowerCase().includes(this.searchName.toLowerCase()));
  }
  setSearchEmpty() {
    this.searchName = this.playerName;
  }
  addStatForm() {
    this.formArray.push({
      stat: "",
      dataName: '',
      number: 0,
      id: this.formArray.length
    });
  }
  updateForm(form, stat) {
    let changedForm = this.formArray.filter(e => e.id == form.id)[0];
    changedForm.stat = stat.label;
    changedForm.dataName = stat.dataName;
  }
  deleteformArray(form) {
    this.formArray = this.formArray.filter(e => e != form);
  }
  getTotalCost(stat) {
    var num = this.seasonArrayTable.map(t => t[stat]).reduce((acc, value) => acc + value, 0);
    return (num / this.seasonArrayTable.length).toFixed(2);
  }
  updateSeasonsDisplayed(season) {
    console.log("here");
    this.playerSeason = season;
    if (this.playerSeason == "2023") {
      this.seasonArray = this.nbaPlayerStatsInfo2023;
      this.seasonArrayTable = this.nbaPlayerStatsInfo2023Table;
    } else if (this.playerSeason == "2022") {
      this.seasonArray = this.nbaPlayerStatsInfo2022;
      this.seasonArrayTable = this.nbaPlayerStatsInfo2022Table;
    }
    this.table.renderRows();
    this.reDrawLineGraph();
  }
  createChart() {
    var points = [];
    var assists = [];
    var rebounds = [];
    var blocks = [];
    var threes = [];
    var doubleDoubles = [];
    var dataPoint = [];
    var index = 1;
    this.seasonArray.forEach(e => {
      points.push(e.points);
      assists.push(e.assists);
      rebounds.push(e.totReb);
      blocks.push(e.blocks);
      threes.push(e.tpm);
      doubleDoubles.push(e.doubleDouble);
      dataPoint.push(index.toString());
      index++;
    });
    var arrayOFpoints = [points, assists, rebounds, blocks, threes, doubleDoubles];
    for (let i = 0; i < arrayOFpoints.length; i++) {
      this.fullDataset[i].data = arrayOFpoints[i];
    }
    var filteredDataSet = [];
    this.fullDataset.forEach(e => {
      if (e.showLine) {
        filteredDataSet.push(e);
      }
    });
    var finalDataSet = [];
    var finalDataSetResult = [];
    filteredDataSet.forEach(e => {
      finalDataSet = finalDataSet.concat(e.data);
    });
    console.log(filteredDataSet);
    for (let i = 0; i < finalDataSet.length / filteredDataSet.length; i++) {
      let sumIndex = 0;
      let initial = true;
      for (let j = 0; j < filteredDataSet.length; j++) {
        if (initial == true) {
          sumIndex += finalDataSet[i];
          initial = false;
        } else {
          sumIndex += finalDataSet[i + j * (finalDataSet.length / filteredDataSet.length)];
        }
      }
      finalDataSetResult.push(sumIndex);
    }
    console.log(finalDataSetResult);
    var fullDisplayDataSet = [];
    var stringOfPoints = '';
    var count = 0;
    filteredDataSet.forEach(e => {
      if (filteredDataSet.length == 1 || count == 0) {
        stringOfPoints += e.label;
        count++;
      } else {
        stringOfPoints += " + " + e.label;
      }
    });
    console.log(stringOfPoints);
    fullDisplayDataSet = [{
      label: stringOfPoints,
      data: finalDataSetResult,
      backgroundColor: 'blue',
      showLine: true
    }];
    if (!this.isCombineStats) {
      fullDisplayDataSet = filteredDataSet;
    }
    var annotationVal = 0;
    console.log(filteredDataSet);
    finalDataSetResult.forEach(e => {
      annotationVal += e;
    });
    annotationVal = annotationVal / finalDataSetResult.length;
    var max = 0;
    finalDataSetResult.forEach(e => {
      if (e > max) {
        max = e;
      }
    });
    max = max + max / 2;
    if (max.toString().includes(".")) {
      var maxNew = max.toString().split(".");
      max = parseInt(maxNew[0]) + 1;
    }
    var annotationObj = {
      type: 'line',
      borderColor: 'black',
      borderDash: [6, 6],
      borderDashOffset: 0,
      borderWidth: 3,
      scaleID: 'y',
      label: {
        display: true,
        drawTime: 'beforeDatasetsDraw',
        callout: {
          display: true,
          borderColor: 'rgba(102, 102, 102, 0.5)',
          borderDash: [6, 6],
          borderWidth: 2,
          margin: 0
        },
        content: 'Average: ' + annotationVal.toFixed(2),
        position: 'center',
        xAdjust: 150,
        yAdjust: -100
      },
      value: annotationVal
    };
    var annotation = [];
    if (this.isCombineStats) {
      annotation.push(annotationObj);
    } else {
      filteredDataSet.forEach(e => {
        annotationVal = 0;
        e.data.forEach(n => annotationVal += n);
        annotationVal = annotationVal / e.data.length;
        annotationObj = {
          type: 'line',
          borderColor: 'black',
          borderDash: [6, 6],
          borderDashOffset: 0,
          borderWidth: 3,
          scaleID: 'y',
          label: {
            display: true,
            drawTime: 'beforeDatasetsDraw',
            callout: {
              display: true,
              borderColor: 'rgba(102, 102, 102, 0.5)',
              borderDash: [6, 6],
              borderWidth: 2,
              margin: 0
            },
            content: 'Average: ' + annotationVal.toFixed(2),
            position: 'center',
            xAdjust: 150,
            yAdjust: -100
          },
          value: annotationVal
        };
        annotation.push(annotationObj);
        annotationVal = 0;
      });
    }
    this.chart = new chart_js_auto__WEBPACK_IMPORTED_MODULE_5__["default"]("lineChart", {
      type: 'line',
      data: {
        labels: dataPoint,
        datasets: fullDisplayDataSet
      },
      options: {
        elements: {
          point: {
            radius: 5
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Points by Game'
          },
          annotation: {
            common: {
              drawTime: 'beforeDatasetsDraw'
            },
            annotations: annotation
          }
        },
        scales: {
          y: {
            min: 0,
            max: max
          }
        },
        maintainAspectRatio: false
      }
    });
  }
  createChart2() {
    var points = [];
    var assists = [];
    var rebounds = [];
    var blocks = [];
    var threes = [];
    var doubleDoubles = [];
    var dataPoint = [];
    var pointsFinal = [];
    var assistsFinal = [];
    var reboundsFinal = [];
    var blocksFinal = [];
    var thressFinal = [];
    var doubleDoublesFinal = [];
    var combinedArrays = [];
    var index = 1;
    for (let i = 0; i < 100; i++) {
      dataPoint.push(i);
    }
    this.seasonArray.forEach(e => {
      points.push(e.points);
      assists.push(e.assists);
      rebounds.push(e.totReb);
      blocks.push(e.blocks);
      threes.push(e.tpm);
      doubleDoubles.push(e.doubleDouble);
      //dataPoint.push(index)
      index++;
    });
    var arrayOFunfiltered = [points, assists, rebounds, blocks, threes, doubleDoubles];
    for (let i = 0; i < 100; i++) {
      let num = points.filter(e => e == i);
      pointsFinal.push(num.length);
      let num2 = assists.filter(e => e == i);
      assistsFinal.push(num2.length);
      let num3 = rebounds.filter(e => e == i);
      reboundsFinal.push(num3.length);
      let num4 = blocks.filter(e => e == i);
      blocksFinal.push(num4.length);
      let num5 = threes.filter(e => e == i);
      thressFinal.push(num5.length);
      let num6 = doubleDoubles.filter(e => e == i);
      doubleDoublesFinal.push(num6.length);
    }
    var arrayOFpoints = [pointsFinal, assistsFinal, reboundsFinal, blocksFinal, thressFinal, doubleDoublesFinal];
    for (let i = 0; i < arrayOFpoints.length; i++) {
      this.fullDataset[i].data = arrayOFpoints[i];
      this.fullDataset[i].unfilteredData = arrayOFunfiltered[i];
      console.log(this.fullDataset[i].unfilteredData);
    }
    var filteredDataSet = [];
    this.fullDataset.forEach(e => {
      if (e.showLine) {
        filteredDataSet.push(e);
        combinedArrays.push(e.unfilteredData);
      }
    });
    console.log(combinedArrays);
    var combinedArrayFinal = [];
    for (let i = 0; i < combinedArrays[0].length; i++) {
      let sum = 0;
      for (let j = 0; j < combinedArrays.length; j++) {
        sum += combinedArrays[j][i];
      }
      combinedArrayFinal.push(sum);
    }
    var newFilteredData = [];
    for (let i = 0; i < 100; i++) {
      let temp = combinedArrayFinal.filter(e => e == i);
      newFilteredData.push(temp.length);
    }
    var stringOfPoints = '';
    var count = 0;
    filteredDataSet.forEach(e => {
      if (filteredDataSet.length == 1 || count == 0) {
        stringOfPoints += e.label;
        count++;
      } else {
        stringOfPoints += " + " + e.label;
      }
    });
    console.log(combinedArrayFinal);
    if (this.isCombineStats) {
      filteredDataSet = [{
        label: stringOfPoints,
        data: newFilteredData,
        backgroundColor: 'blue',
        showLine: true
      }];
    }
    this.chart2 = new chart_js_auto__WEBPACK_IMPORTED_MODULE_5__["default"]("barChart", {
      type: 'bar',
      data: {
        labels: dataPoint,
        datasets: filteredDataSet
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 1,
            barThickness: 'flex'
          }
        },
        scales: {
          y: {
            min: 0,
            max: 10
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Distrbution'
          }
        },
        maintainAspectRatio: false
      }
    });
  }
  createNormalDistChart() {
    var points = [];
    var assists = [];
    var rebounds = [];
    var blocks = [];
    var threes = [];
    var doubleDoubles = [];
    var dataPoint = [];
    var pointsFinal = [];
    var assistsFinal = [];
    var reboundsFinal = [];
    var blocksFinal = [];
    var thressFinal = [];
    var doubleDoublesFinal = [];
    var combinedArrays = [];
    var index = 1;
    for (let i = 0; i < 100; i++) {
      dataPoint.push(i);
    }
    this.seasonArray.forEach(e => {
      points.push(e.points);
      assists.push(e.assists);
      rebounds.push(e.totReb);
      blocks.push(e.blocks);
      threes.push(e.tpm);
      doubleDoubles.push(e.doubleDouble);
      //dataPoint.push(index)
      index++;
    });
    var arrayOFunfiltered = [points, assists, rebounds, blocks, threes, doubleDoubles];
    for (let i = 0; i < 100; i++) {
      let num = points.filter(e => e == i);
      pointsFinal.push(num.length);
      let num2 = assists.filter(e => e == i);
      assistsFinal.push(num2.length);
      let num3 = rebounds.filter(e => e == i);
      reboundsFinal.push(num3.length);
      let num4 = blocks.filter(e => e == i);
      blocksFinal.push(num4.length);
      let num5 = threes.filter(e => e == i);
      thressFinal.push(num5.length);
      let num6 = doubleDoubles.filter(e => e == i);
      doubleDoublesFinal.push(num6.length);
    }
    var arrayOFpoints = [pointsFinal, assistsFinal, reboundsFinal, blocksFinal, thressFinal, doubleDoublesFinal];
    for (let i = 0; i < arrayOFpoints.length; i++) {
      this.fullDataset[i].data = arrayOFpoints[i];
      this.fullDataset[i].unfilteredData = arrayOFunfiltered[i];
      console.log(this.fullDataset[i].unfilteredData);
    }
    var filteredDataSet = [];
    this.fullDataset.forEach(e => {
      if (e.showLine) {
        filteredDataSet.push(e);
        combinedArrays.push(e.unfilteredData);
      }
    });
    console.log(combinedArrays);
    var combinedArrayFinal = [];
    for (let i = 0; i < combinedArrays[0].length; i++) {
      let sum = 0;
      for (let j = 0; j < combinedArrays.length; j++) {
        sum += combinedArrays[j][i];
      }
      combinedArrayFinal.push(sum);
    }
    combinedArrayFinal = [5, 5, 5, 5, 8, 8, 8, 8, 12, 12, 12, 12, 12, 12, 12, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 56, 56, 56, 56, 56, 56, 56, 62, 62, 62, 62, 65, 65];
    var newFilteredData = [];
    for (let i = 0; i < 100; i++) {
      let temp = combinedArrayFinal.filter(e => e == i);
      newFilteredData.push(temp.length);
    }
    var stringOfPoints = '';
    var count = 0;
    filteredDataSet.forEach(e => {
      if (filteredDataSet.length == 1 || count == 0) {
        stringOfPoints += e.label;
        count++;
      } else {
        stringOfPoints += " + " + e.label;
      }
    });
    console.log(combinedArrayFinal);
    if (this.isCombineStats) {
      filteredDataSet = [{
        label: stringOfPoints,
        data: newFilteredData,
        backgroundColor: 'blue',
        showLine: true
      }];
    }
    this.chart3 = new chart_js_auto__WEBPACK_IMPORTED_MODULE_5__["default"]("NormalDistChart", {
      type: 'line',
      data: {
        labels: dataPoint,
        datasets: filteredDataSet
      },
      options: {
        elements: {
          line: {
            tension: .4
          },
          point: {
            radius: 5
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Normal Distribution'
          }
        },
        maintainAspectRatio: false
      }
    });
  }
  reDrawLineGraph() {
    this.chart.destroy();
    this.chart2.destroy();
    this.chart3.destroy();
    this.createChart();
    this.createChart2();
    this.createNormalDistChart();
  }
  ngOnInit() {
    var _this5 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      chart_js_auto__WEBPACK_IMPORTED_MODULE_5__["default"].register(chartjs_plugin_annotation__WEBPACK_IMPORTED_MODULE_9__["default"]);
      yield _this5.loadData();
      _this5.createChart();
      _this5.createChart2();
      _this5.createNormalDistChart();
    })();
  }
  static #_ = this.ɵfac = function PlayerStatsComponent_Factory(t) {
    return new (t || PlayerStatsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_ApiCalls_nbaApiCalls__WEBPACK_IMPORTED_MODULE_1__.nbaApiController), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_ApiCalls_nhlApiCalls__WEBPACK_IMPORTED_MODULE_2__.nhlApiController), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_ApiCalls_draftKingsApiCalls__WEBPACK_IMPORTED_MODULE_3__.draftKingsApiController));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
    type: PlayerStatsComponent,
    selectors: [["app-player-stats"]],
    viewQuery: function PlayerStatsComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatTable, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.table = _t.first);
      }
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵProvidersFeature"]([_ApiCalls_nbaApiCalls__WEBPACK_IMPORTED_MODULE_1__.nbaApiController, _ApiCalls_nhlApiCalls__WEBPACK_IMPORTED_MODULE_2__.nhlApiController, _ApiCalls_draftKingsApiCalls__WEBPACK_IMPORTED_MODULE_3__.draftKingsApiController])],
    decls: 80,
    vars: 18,
    consts: [["cols", "4", "rowHeight", "50px"], ["colspan", "4", 2, "background-color", "darkgray"], [2, "font-size", "200%"], [1, "example-form"], [1, "example-full-width"], ["type", "text", "placeholder", "Search Player Name", "aria-label", "Number", "matInput", "", 3, "ngModel", "formControl", "matAutocomplete", "ngModelChange"], ["auto", "matAutocomplete"], [3, "value", "onSelectionChange", 4, "ngFor", "ngForOf"], ["rowspan", "8"], ["id", "lineChart"], ["id", "barChart"], ["id", "NormalDistChart"], [1, "example-list-section"], [3, "ngModel", "ngModelChange"], [4, "ngFor", "ngForOf"], [3, "placeholder"], ["value", "season", 3, "onSelectionChange", 4, "ngFor", "ngForOf"], ["rowspan", "1", "colspan", "4", 2, "background-color", "darkcyan"], ["colspan", "2", "rowspan", "8", 2, "overflow", "visible"], ["mat-table", "", 1, "mat-elevation-z8", 2, "height", "inherit", 3, "dataSource"], ["matColumnDef", "Game"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["mat-footer-cell", "", 4, "matFooterCellDef"], ["matColumnDef", "Date"], ["matColumnDef", "Points"], ["matColumnDef", "Assists"], ["matColumnDef", "Rebounds"], ["matColumnDef", "Blocks"], ["matColumnDef", "Threes"], ["mat-header-row", "", 4, "matHeaderRowDef", "matHeaderRowDefSticky"], ["mat-row", "", "style", "height:auto;", 3, "demo-row-is-clicked", 4, "matRowDef", "matRowDefColumns"], ["mat-footer-row", "", "style", "border-top: 2px solid black;", 4, "matFooterRowDef"], ["rowspan", "8", "colspan", "2"], [2, "height", "inherit", "width", "100%"], ["cols", "4", "rowHeight", "10px"], ["colspan", "4", "rowspan", "15", 2, "background-color", "gray", "display", "flex", "justify-content", "flex-start", "align-items", "flex-start"], [2, "height", "inherit", "width", "100%", "display", "flex", "justify-content", "flex-start", "align-items", "center"], [2, "display", "flex"], ["style", "padding-left: 1rem; padding-top: 1rem; ", 4, "ngFor", "ngForOf"], [2, "display", "flex", "flex-direction", "column", "padding-top", "2rem", "gap", "1rem"], ["mat-raised-button", "", 2, "height", "fit-content", "width", "fit-content", "border-radius", "10px", 3, "click"], [3, "value", "onSelectionChange"], [3, "ngModel", "color", "ngModelChange"], ["value", "season", 3, "onSelectionChange"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-footer-cell", ""], ["mat-header-row", ""], ["mat-row", "", 2, "height", "auto"], ["mat-footer-row", "", 2, "border-top", "2px solid black"], [2, "padding-left", "1rem", "padding-top", "1rem"], ["matInput", "", "type", "number", 3, "ngModel", "ngModelChange", "click"], ["mat-raised-button", "", 2, "margin-top", "1rem", 3, "click"]],
    template: function PlayerStatsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-grid-list", 0)(1, "mat-grid-tile", 1)(2, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, "Search Player");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "form", 3)(7, "mat-form-field", 4)(8, "input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function PlayerStatsComponent_Template_input_ngModelChange_8_listener($event) {
          return ctx.searchName = $event;
        })("ngModelChange", function PlayerStatsComponent_Template_input_ngModelChange_8_listener() {
          return ctx.filterSearch();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "mat-autocomplete", null, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](11, PlayerStatsComponent_mat_option_11_Template, 2, 2, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](12, "mat-grid-tile", 8)(13, "canvas", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "mat-grid-tile", 8)(16, "canvas", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](18, "mat-grid-tile", 8)(19, "canvas", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](21, "mat-grid-tile", 8)(22, "span", 12)(23, "mat-slide-toggle", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function PlayerStatsComponent_Template_mat_slide_toggle_ngModelChange_23_listener($event) {
          return ctx.isCombineStats = $event;
        })("ngModelChange", function PlayerStatsComponent_Template_mat_slide_toggle_ngModelChange_23_listener() {
          return ctx.reDrawLineGraph();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](24, "Combine Stats");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](26, PlayerStatsComponent_li_26_Template, 3, 3, "li", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](27, "mat-form-field")(28, "mat-select", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](29, PlayerStatsComponent_mat_option_29_Template, 2, 1, "mat-option", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](30, "mat-grid-tile", 17)(31, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](32, " Stats");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](33, "mat-grid-tile", 18)(34, "table", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](35, 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](36, PlayerStatsComponent_th_36_Template, 2, 0, "th", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](37, PlayerStatsComponent_td_37_Template, 2, 2, "td", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](38, PlayerStatsComponent_td_38_Template, 2, 0, "td", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](39, 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](40, PlayerStatsComponent_th_40_Template, 2, 0, "th", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](41, PlayerStatsComponent_td_41_Template, 2, 1, "td", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](42, PlayerStatsComponent_td_42_Template, 1, 0, "td", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](43, 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](44, PlayerStatsComponent_th_44_Template, 2, 0, "th", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](45, PlayerStatsComponent_td_45_Template, 2, 1, "td", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](46, PlayerStatsComponent_td_46_Template, 2, 1, "td", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](47, 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](48, PlayerStatsComponent_th_48_Template, 2, 0, "th", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](49, PlayerStatsComponent_td_49_Template, 2, 1, "td", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](50, PlayerStatsComponent_td_50_Template, 2, 1, "td", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](51, 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](52, PlayerStatsComponent_th_52_Template, 2, 0, "th", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](53, PlayerStatsComponent_td_53_Template, 2, 1, "td", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](54, PlayerStatsComponent_td_54_Template, 2, 1, "td", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](55, 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](56, PlayerStatsComponent_th_56_Template, 2, 0, "th", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](57, PlayerStatsComponent_td_57_Template, 2, 1, "td", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](58, PlayerStatsComponent_td_58_Template, 2, 1, "td", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](59, 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](60, PlayerStatsComponent_th_60_Template, 2, 0, "th", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](61, PlayerStatsComponent_td_61_Template, 2, 1, "td", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](62, PlayerStatsComponent_td_62_Template, 2, 1, "td", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](63, PlayerStatsComponent_tr_63_Template, 1, 0, "tr", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](64, PlayerStatsComponent_tr_64_Template, 1, 2, "tr", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](65, PlayerStatsComponent_tr_65_Template, 1, 0, "tr", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](66, "mat-grid-tile", 33)(67, "div", 34)(68, "mat-grid-list", 35)(69, "mat-grid-tile", 36)(70, "div", 37)(71, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](72, PlayerStatsComponent_mat_form_field_72_Template, 8, 2, "mat-form-field", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](73, "div", 40)(74, "button", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function PlayerStatsComponent_Template_button_click_74_listener() {
          return ctx.addStatForm();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](75, "Add");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](76, "button", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function PlayerStatsComponent_Template_button_click_76_listener() {
          return ctx.clearSearch();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](77, "Clear");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](78, "button", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function PlayerStatsComponent_Template_button_click_78_listener() {
          return ctx.searchNumberSubmit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](79, "Search");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()()()()()();
      }
      if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", ctx.playerName, ": ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.searchName)("formControl", ctx.myControl)("matAutocomplete", _r0);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.filteredSearch);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx.chart);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx.chart2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx.chart3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.isCombineStats);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.fullDataset);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpropertyInterpolate"]("placeholder", ctx.playerSeason);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.playerSeasons);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dataSource", ctx.seasonArrayTable);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns)("matHeaderRowDefSticky", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matFooterRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.formArray);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgForm, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatButton, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__.MatLabel, _angular_material_select__WEBPACK_IMPORTED_MODULE_15__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_16__.MatOption, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatFooterCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatFooterRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatFooterCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_11__.MatFooterRow, _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_17__.MatGridList, _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_17__.MatGridTile, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_18__.MatCheckbox, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_19__.MatAutocomplete, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_19__.MatAutocompleteTrigger, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_20__.MatSlideToggle, _angular_material_input__WEBPACK_IMPORTED_MODULE_21__.MatInput, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControlDirective],
    styles: [".demo-row-is-clicked[_ngcontent-%COMP%] {\n  background-color: lightcoral;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGxheWVyLXN0YXRzL3BsYXllci1zdGF0cy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLDRCQUFBO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIuZGVtby1yb3ctaXMtY2xpY2tlZCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOmxpZ2h0Y29yYWw7XHJcbiAgfSJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 4269:
/*!**********************************************************************!*\
  !*** ./src/app/prop-screen/prop-checkout/prop-checkout.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PropCheckoutComponent: () => (/* binding */ PropCheckoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/card */ 8497);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ 6515);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/divider */ 9400);







function PropCheckoutComponent_mat_card_content_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card-content", 4)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PropCheckoutComponent_mat_card_content_5_Template_button_click_13_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const p_r1 = restoredCtx.$implicit;
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r3.remove(p_r1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const p_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](p_r1.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](p_r1.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](p_r1.point);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](p_r1.price);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](p_r1.percentTotal);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](p_r1.percentTeam);
  }
}
class PropCheckoutComponent {
  constructor() {
    this.prop = [{
      name: '',
      id: '',
      description: '',
      price: '',
      point: '',
      event: '',
      isDisabled: false,
      percentTotal: '',
      percentTeam: '',
      avgTotal: '',
      avgTeam: '',
      team1: '',
      team2: '',
      isOpened: false,
      teamAgainst: '',
      averageDifferential: '',
      gamesPlayed: "",
      gamesPlayedvsTeam: "",
      average2022: "",
      average2022vsTeam: ""
    }];
    this.exit = true;
    this.length = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.exitSend = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.value = 80;
  }
  display() {
    console.log(this.prop);
  }
  remove(p) {
    p.isDisabled = false;
    this.prop = this.prop.filter(item => item != p);
    this.length.emit(this.prop);
  }
  exitModal() {
    this.exit = false;
    this.exitSend.emit(this.exit);
  }
  static #_ = this.ɵfac = function PropCheckoutComponent_Factory(t) {
    return new (t || PropCheckoutComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: PropCheckoutComponent,
    selectors: [["app-prop-checkout"]],
    inputs: {
      prop: "prop",
      exit: "exit"
    },
    outputs: {
      length: "length",
      exitSend: "exitSend"
    },
    decls: 9,
    vars: 1,
    consts: [[1, "card-header"], ["class", "team-prop-display", 4, "ngFor", "ngForOf"], ["align", "start", 1, "container-class"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "team-prop-display"], ["mat-mini-fab", "", "color", "warn", 3, "click"]],
    template: function PropCheckoutComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card")(1, "mat-card-header", 0)(2, "mat-card-title");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Prop Checkout");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "mat-divider", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, PropCheckoutComponent_mat_card_content_5_Template, 16, 6, "mat-card-content", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-card-actions", 2)(7, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PropCheckoutComponent_Template_button_click_7_listener() {
          return ctx.exitModal();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Exit");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.prop);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatMiniFabButton, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCardActions, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCardHeader, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCardTitle, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIcon, _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__.MatDivider],
    styles: ["mat-card[_ngcontent-%COMP%] {\n  width: -moz-fit-content;\n  width: fit-content;\n  position: fixed;\n  right: 2px;\n  bottom: 2px;\n  border: 2px solid rgb(255, 56, 56);\n  border-radius: 10px;\n  z-index: 10;\n}\n\n*[_ngcontent-%COMP%] {\n  background-color: rgb(255, 56, 56);\n}\n\n.team-prop-display[_ngcontent-%COMP%] {\n  background-color: rgb(255, 56, 56);\n  display: flex;\n  justify-items: center;\n  padding-top: 1rem;\n  gap: 1rem;\n}\n\n.container-class[_ngcontent-%COMP%] {\n  gap: 1rem;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvcC1zY3JlZW4vcHJvcC1jaGVja291dC9wcm9wLWNoZWNrb3V0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksdUJBQUE7RUFBQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLGtDQUFBO0VBQ0EsbUJBQUE7RUFDQSxXQUFBO0FBQ0o7O0FBQ0E7RUFDSSxrQ0FBQTtBQUVKOztBQUFBO0VBQ0ksa0NBQUE7RUFDQSxhQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLFNBQUE7QUFHSjs7QUFEQTtFQUNJLFNBQUE7QUFJSiIsInNvdXJjZXNDb250ZW50IjpbIm1hdC1jYXJke1xyXG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgcmlnaHQ6IDJweDtcclxuICAgIGJvdHRvbTogMnB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgcmdiKDI1NSwgNTYsIDU2KTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICB6LWluZGV4OiAxMDtcclxufVxyXG4qe1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjpyZ2IoMjU1LCA1NiwgNTYpO1xyXG59XHJcbi50ZWFtLXByb3AtZGlzcGxheXtcclxuICAgIGJhY2tncm91bmQtY29sb3I6cmdiKDI1NSwgNTYsIDU2KTtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcclxuICAgIHBhZGRpbmctdG9wOiAxcmVtO1xyXG4gICAgZ2FwOiAxcmVtO1xyXG59XHJcbi5jb250YWluZXItY2xhc3N7XHJcbiAgICBnYXA6IDFyZW07XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 2972:
/*!******************************************************!*\
  !*** ./src/app/prop-screen/prop-screen.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PropScreenComponent: () => (/* binding */ PropScreenComponent)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/table */ 6798);
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/animations */ 2501);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! remult */ 726);
/* harmony import */ var src_shared_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/dbTasks/PlayerInfoMlb */ 9517);
/* harmony import */ var src_shared_Controllers_MlbController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/Controllers/MlbController */ 3351);
/* harmony import */ var src_shared_dbTasks_DbGameBookData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/dbTasks/DbGameBookData */ 9731);
/* harmony import */ var src_shared_Controllers_SportsBookController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/Controllers/SportsBookController */ 9223);
/* harmony import */ var src_shared_dbTasks_DbPlayerPropData__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/dbTasks/DbPlayerPropData */ 21);
/* harmony import */ var src_shared_Controllers_PlayerPropController__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/Controllers/PlayerPropController */ 8522);
/* harmony import */ var src_shared_dbTasks_DbNhlPlayerInfo__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/dbTasks/DbNhlPlayerInfo */ 5761);
/* harmony import */ var src_shared_Controllers_NhlPlayerInfoController__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/Controllers/NhlPlayerInfoController */ 8994);
/* harmony import */ var src_shared_dbTasks_DbNhlPlayerGameStats__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/dbTasks/DbNhlPlayerGameStats */ 797);
/* harmony import */ var src_shared_Controllers_NhlPlayerGameStatsController__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/Controllers/NhlPlayerGameStatsController */ 9411);
/* harmony import */ var _ApiCalls_nbaApiCalls__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../ApiCalls/nbaApiCalls */ 9637);
/* harmony import */ var src_shared_dbTasks_NbaPlayerInfoDb__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/dbTasks/NbaPlayerInfoDb */ 6552);
/* harmony import */ var src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/Controllers/NbaController */ 3777);
/* harmony import */ var _ApiCalls_nhlApiCalls__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../ApiCalls/nhlApiCalls */ 1296);
/* harmony import */ var _ApiCalls_draftKingsApiCalls__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../ApiCalls/draftKingsApiCalls */ 4243);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/common/http */ 4860);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/tabs */ 989);
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/grid-list */ 647);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/progress-bar */ 8173);
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/expansion */ 8060);
/* harmony import */ var _prop_checkout_prop_checkout_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./prop-checkout/prop-checkout.component */ 4269);

































function PropScreenComponent_mat_tab_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "mat-tab", 10);
  }
  if (rf & 2) {
    const sport_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpropertyInterpolate"]("label", sport_r7.title);
  }
}
function PropScreenComponent_mat_tab_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "mat-tab", 10);
  }
  if (rf & 2) {
    const date_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpropertyInterpolate"]("label", date_r8);
  }
}
function PropScreenComponent_mat_tab_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "mat-tab", 10);
  }
  if (rf & 2) {
    const game_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpropertyInterpolate"]("label", game_r9.game);
  }
}
function PropScreenComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div")(1, "mat-grid-list", 11)(2, "mat-grid-tile", 12)(3, "div", 13)(4, "mat-grid-list", 14)(5, "mat-grid-tile", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](7, "mat-grid-tile", 16)(8, "div", 13)(9, "mat-grid-list", 14)(10, "mat-grid-tile", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](12, "div", 17)(13, "mat-grid-list", 18)(14, "mat-grid-tile", 19)(15, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](16, "-110");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](17, "mat-grid-tile", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](18, " Money Line ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](19, "mat-grid-tile", 22)(20, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](21, "+110");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](22, "mat-grid-tile", 22)(23, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](24, "-4 -110");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](25, "mat-grid-tile", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](26, " Spread ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](27, "mat-grid-tile", 22)(28, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](29, "+110");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](30, "mat-grid-tile", 22)(31, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](32, "-110");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](33, "mat-grid-tile", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](34, " Total ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](35, "mat-grid-tile", 22)(36, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](37, "+110");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", ctx_r3.displayPropHtml1.name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", ctx_r3.displayPropHtml2.name, " ");
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_button_7_Template_button_click_0_listener($event) {
      return $event.stopPropagation();
    })("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_button_7_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r17);
      const props_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]().$implicit;
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r15.findBestBetsFromEvent(props_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1, "Best Bets");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_mat_progress_bar_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "mat-progress-bar", 33);
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "th", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1, " Player ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r34 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", element_r34.name, " ");
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "th", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1, " Over/Under ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r35 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", element_r35.description, " ");
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "th", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1, " Price ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "td", 47)(1, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_9_Template_button_click_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r38);
      const element_r36 = restoredCtx.$implicit;
      const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r37.addItemToCheckout(element_r36));
    })("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_9_Template_button_click_1_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const element_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("disabled", element_r36.isDisabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](element_r36.price);
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "th", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1, " Point ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r40 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", element_r40.point, " ");
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "th", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1, " Detailed Stats ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "td", 47)(1, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_15_Template_button_click_1_listener($event) {
      return $event.stopPropagation();
    })("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_15_Template_button_click_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r44);
      const element_r41 = restoredCtx.$implicit;
      const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r43.detailedStatsClicked(element_r41));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](2, "Detailed Stats");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_17_mat_progress_bar_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "mat-progress-bar", 33);
  }
  if (rf & 2) {
    const element_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]().$implicit;
    const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("@detailExpand", element_r45 == ctx_r46.expandedElement ? "expanded" : "collapsed");
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_17_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div", 51)(1, "div", 52)(2, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](4, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](6, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](8, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](10, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](12, "div", 52)(13, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](15, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](17, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](19, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const element_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]().$implicit;
    const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("@detailExpand", element_r45 == ctx_r47.expandedElement ? "expanded" : "collapsed");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("Chance of happenging overall: ", element_r45.percentTotal, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate2"]("Chance of happening vs ", element_r45.teamAgainst, ": ", element_r45.percentTeam, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("Average this season: ", element_r45.avgTotal, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate2"]("Average this season vs ", element_r45.teamAgainst, ": ", element_r45.avgTeam, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("Average Differential: ", element_r45.averageDifferential, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("Games Played: ", element_r45.gamesPlayed, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate2"]("Games played vs: ", element_r45.teamAgainst, " : ", element_r45.gamesPlayedVsTeam, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("Average last season: ", element_r45.average2022, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate2"]("Average last season vs ", element_r45.teamAgainst, " : ", element_r45.average2022vsTeam, "");
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "td", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](1, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_17_mat_progress_bar_1_Template, 1, 1, "mat-progress-bar", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](2, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_17_div_2_Template, 21, 14, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵattribute"]("colspan", ctx_r30.displayedColumns.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r30.displayProgressBar);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx_r30.displayProgressBar);
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "tr", 53);
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r52 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "tr", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_19_Template_tr_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r52);
      const element_r50 = restoredCtx.$implicit;
      const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r51.expandedElement = ctx_r51.expandedElement === element_r50 ? null : element_r50);
    })("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_19_Template_tr_click_0_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "tr", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_20_Template_tr_click_0_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
const _c0 = function () {
  return ["expandedDetail"];
};
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "table", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](1, 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](2, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_2_Template, 2, 0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](3, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_3_Template, 2, 1, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](4, 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](5, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_5_Template, 2, 0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](6, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_6_Template, 2, 1, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](7, 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](8, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_8_Template, 2, 0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](9, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_9_Template, 3, 2, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](10, 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](11, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_11_Template, 2, 0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](12, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_12_Template, 2, 1, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](13, 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](14, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_th_14_Template, 2, 0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](15, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_15_Template, 3, 0, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](16, 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](17, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_td_17_Template, 3, 3, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](18, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_18_Template, 1, 0, "tr", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](19, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_19_Template, 1, 0, "tr", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](20, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_tr_20_Template, 1, 0, "tr", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const props_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2).$implicit;
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("dataSource", props_r11);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("matHeaderRowDef", ctx_r19.displayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("matRowDefColumns", ctx_r19.displayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("matRowDefColumns", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpureFunction0"](4, _c0));
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](0, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_mat_progress_bar_0_Template, 1, 0, "mat-progress-bar", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](1, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_table_1_Template, 21, 5, "table", 32);
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r13.displayProgressBar);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx_r13.displayProgressBar);
  }
}
function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r58 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "mat-expansion-panel", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("opened", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_Template_mat_expansion_panel_opened_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r58);
      const props_r11 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](props_r11[0].isOpened = true);
    })("closed", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_Template_mat_expansion_panel_closed_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r58);
      const props_r11 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](props_r11[0].isOpened = false);
    })("afterExpand", function PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_Template_mat_expansion_panel_afterExpand_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r58);
      const props_r11 = restoredCtx.$implicit;
      const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r60.computeStatsForAllPlayersInProp(props_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "mat-expansion-panel-header", 27)(2, "mat-panel-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](4, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](5, "mat-panel-description");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](6, " Over/Under ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](7, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_button_7_Template, 2, 0, "button", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](8, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_ng_template_8_Template, 2, 2, "ng-template", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const props_r11 = ctx.$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](4, 2, props_r11[0].event), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", props_r11[0].isOpened && !ctx_r10.displayProgressBar);
  }
}
function PropScreenComponent_mat_accordion_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "mat-accordion");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](1, PropScreenComponent_mat_accordion_12_mat_expansion_panel_1_Template, 9, 4, "mat-expansion-panel", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngForOf", ctx_r4.playerPropObjectArray);
  }
}
function PropScreenComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "div");
  }
}
function PropScreenComponent_app_prop_checkout_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r62 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "app-prop-checkout", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("exitSend", function PropScreenComponent_app_prop_checkout_14_Template_app_prop_checkout_exitSend_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r62);
      const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r61.isExit($event));
    })("length", function PropScreenComponent_app_prop_checkout_14_Template_app_prop_checkout_length_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r62);
      const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r63.getArrayLength($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("prop", ctx_r6.checkoutArray);
  }
}
class PropScreenComponent {
  constructor(http, nbaApiController, nhlApiController, draftKingsApiController, router) {
    this.http = http;
    this.nbaApiController = nbaApiController;
    this.nhlApiController = nhlApiController;
    this.draftKingsApiController = draftKingsApiController;
    this.router = router;
    this.mlbPlayerrInfoRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(src_shared_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__.PlayerInfoMlb);
    this.SportsBookRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(src_shared_dbTasks_DbGameBookData__WEBPACK_IMPORTED_MODULE_4__.DbGameBookData);
    this.playerPropRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(src_shared_dbTasks_DbPlayerPropData__WEBPACK_IMPORTED_MODULE_6__.DbPlayerPropData);
    this.nhlPlayerInfoRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(src_shared_dbTasks_DbNhlPlayerInfo__WEBPACK_IMPORTED_MODULE_8__.DbNhlPlayerInfo);
    this.nhlPlayerGameStatRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(src_shared_dbTasks_DbNhlPlayerGameStats__WEBPACK_IMPORTED_MODULE_10__.DbNhlPlayerGameStats);
    this.nbaPlayerInfoRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(src_shared_dbTasks_NbaPlayerInfoDb__WEBPACK_IMPORTED_MODULE_13__.NbaPlayerInfoDb);
    this.playerPropsClicked = false;
    this.gamePropsClicked = true;
    this.arrayOfMLBTeams = {
      Minnesota_Twins: "MIN",
      Detroit_Tigers: "DET",
      Cincinnati_Reds: "CIN",
      Chicago_Cubs: "CHC",
      Milwaukee_Brewers: "MIL",
      Philadelphia_Phillies: "PHI",
      Oakland_Athletics: "OAK",
      Los_Angeles_Angels: "LAA",
      Pittsburgh_Pirates: "PIT",
      Cleveland_Guardians: "CLE",
      Tampa_Bay_Rays: "TB",
      Boston_Red_Socks: "BOS",
      Seattle_Mariners: "SEA",
      Miami_Marlins: "MIA",
      Los_Angeles_Dodgers: "LAD",
      New_York_Yankees: "NYY",
      Washington_Nationals: "WAS",
      New_York_Mets: "NYM",
      San_Francisco_Giants: "SF",
      Kansas_City_Royals: "KC",
      Chicago_White_Sox: "CHW",
      Atlanta_Braves: "ATL",
      St_Louis_Cardinals: "STL",
      Arizona_Diamondbacks: "ARI",
      Baltimore_Orioles: "BAL",
      Colorado_Rockies: "COL",
      Houston_Astros: "HOU",
      San_Diego_Padres: "SD",
      Texas_Rangers: "TEX",
      Toronto_Blue_Jays: "TOR"
    };
    this.arrayOfNBATeams = {
      Atlanta_Hawks: 1,
      Boston_Celtics: 2,
      Brooklyn_Nets: 4,
      Charlotte_Hornets: 5,
      Chicago_Bulls: 6,
      Cleveland_Cavaliers: 7,
      Dallas_Mavericks: 8,
      Denver_Nuggets: 9,
      Detroit_Pistons: 10,
      Golden_State_Warriors: 11,
      Houston_Rockets: 14,
      Indiana_Pacers: 15,
      Los_Angeles_Clippers: 16,
      Los_Angeles_Lakers: 17,
      Memphis_Grizzlies: 19,
      Miami_Heat: 20,
      Milwaukee_Bucks: 21,
      Minnesota_Timberwolves: 22,
      New_Orleans_Pelicans: 23,
      New_York_Knicks: 24,
      Oklahoma_City_Thunder: 25,
      Orlando_Magic: 26,
      Philadelphia_76ers: 27,
      Phoenix_Suns: 28,
      Portland_Trail_Blazers: 29,
      Sacramento_Kings: 30,
      San_Antonio_Spurs: 31,
      Toronto_Raptors: 38,
      Utah_Jazz: 40,
      Washington_Wizards: 41
    };
    this.home_team = '';
    this.away_team = '';
    this.itemsInCheckout = 0;
    this.checkoutArray = [];
    this.playerPropButtonDisabled = false;
    this.nbaCount = 0;
    this.sportsNew = [];
    this.gameString = '';
    this.selectedSport = '';
    this.selectedDate = '';
    this.selectedGame = '';
    this.selectedGameid = '';
    this.exit = true;
    this.date = new Date();
    //API strings
    this.pre_initial_prop = "https://api.the-odds-api.com/v4/sports/";
    this.post_initial_prop = "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american";
    this.pre_get_games = "https://api.the-odds-api.com/v4/sports/";
    this.post_get_games = "/scores?apiKey=5ab6923d5aa0ae822b05168709bb910c";
    this.displayedColumns = ['name', 'description', 'point', 'price', 'detailedStats'];
    this.APIUrl = "http://localhost:5086/api/MlbPlayerInfo/";
    this.notes = [];
    this.sports = [];
    this.sportPropArray = [{
      sportName: '',
      dateArray: []
    }];
    this.datePrropArray = [{
      date: '',
      gameProp: []
    }];
    this.gamePropArray = [{
      gameId: '',
      gameProps: []
    }];
    this.propsArray = [{
      propName: '',
      playerProps: []
    }];
    this.playerPropsArray = [{
      name: '',
      id: '',
      description: '',
      price: '',
      point: '',
      event: '',
      isDisabled: false,
      percentTotal: '',
      percentTeam: '',
      avgTotal: '',
      avgTeam: '',
      team1: '',
      team2: '',
      isOpened: false,
      teamAgainst: '',
      averageDifferential: '',
      gamesPlayed: "",
      gamesPlayedvsTeam: "",
      average2022: "",
      average2022vsTeam: ""
    }];
    this.mlbPlayerId = [{
      Name: '',
      Id: '',
      teamName: '',
      teamId: ''
    }];
    this.playerPropObjectArray = [];
    this.dates = [];
    this.games = [];
    this.displayPropHtml1 = {
      name: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: ''
    };
    this.displayPropHtml2 = {
      name: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: ''
    };
    this.listOfSupportedSports = ["NBA", "NHL"];
    this.sportsToTitle = {
      NBA: "basketball_nba",
      NFL: "americanfootball_nfl",
      MLB: "baseball_mlb",
      NHL: "icehockey_nhl"
    };
    this.postDateSelectedSportGames = {};
    this.selectedSportsDates = [];
    this.playerInfoTemp = [];
    this.playerInfoFinal = [];
    this.gamePropData = [];
    this.sportsBookData = [];
    this.sportsBookDataFinal = [];
    this.playerPropData = [];
    this.playerPropDataFinal = [];
    this.nhlPlayerInfo = [];
    this.nhlPlayerInfoFinal = [];
    this.nhlPlayerStatData = [];
    this.nhlPlayerStatDataFinal = [];
    this.nhlPlayerStatData2022Final = [];
    this.nhlPlayerStatData2023Final = [];
    this.nbaPlayerStatData = [];
    this.nbaPlayerStatDataFinal = [];
    this.nbaPlayerStatData2022Final = [];
    this.nbaPlayerStatData2023Final = [];
    //add a button that can find the highest prop percentages out of the selected prop
    //Find a player stat api and create an interface and array of objects that stores the data for each player connected to team that way it can be easily accessed when needed to reference the stats
    this.playerAverageForSeason = 0;
    this.playerAverageVsTeam = 0;
    this.playerPercentForSeason = 0;
    this.playerPercentVsTeam = 0;
    this.teamAgainst = '';
    this.gamesPlayed = 0;
    this.gamesPlayedVsTeam = 0;
    this.playerId = 0;
    this.average2022 = 0;
    this.average2022vsTeam = 0;
    this.differential = 0;
    this.tempPlayerStatData = [{}];
    this.displayProgressBar = true;
  }
  trimSports(sports) {
    //need to figure out a way to order the sports but for now just show the main ones
    sports.forEach(sport => {
      this.listOfSupportedSports.forEach(s => {
        if (sport.title == s) {
          this.sportsNew.push(sport);
        }
      });
    });
    this.selectedSport = this.sportsNew[0].title;
  }
  setSelectedDate(date) {
    this.selectedDate = date;
  }
  setSelectedSport(sport) {
    this.selectedSport = sport;
  }
  setSelectedGame(game) {
    const temp = this.games.filter(x => x.game === game);
    this.selectedGame = temp[0].id;
  }
  onSportClick(sport) {
    var _this = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      console.log(sport);
      _this.selectedDate = '';
      _this.setSelectedSport(sport.tab.textLabel);
      //await this.checkSportPlayerInfoDb();
      if (_this.selectedSport != "NBA") {
        yield _this.checkPlayerInfoDb();
      }
      yield _this.checkSportsBookDb();
      _this.updateDates();
    })();
  }
  onDateClick(date) {
    console.log(date);
    this.setSelectedDate(date.tab.textLabel);
    this.updateGames();
  }
  onGameClick(game) {
    var _this2 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      console.log(game);
      _this2.gameString = game.tab.textLabel;
      _this2.setSelectedGame(game.tab.textLabel);
      if (_this2.selectedSport == "NBA") {
        yield _this2.checkPlayerInfoDb();
      }
      _this2.playerPropsClicked = false;
      _this2.displayProp();
    })();
  }
  checkSportBookDb() {
    var _this3 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3.selectedSport === "MLB") {
        var dbEmpty;
        //try{
        //change below find methods to call the controller instead
        //dbEmpty = await MlbController.getMlbBookLength()
        /* if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()){
          await this.getMlbPlayerIds();
           
          await MlbController.updatePlayerINfo(this.playerInfoTemp);
          
        
          await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
         }
         else{
          await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
         }
        }catch (error: any){
        alert(error.message)
        } */
      }
    })();
  }

  checkSportPlayerInfoDb() {
    var _this4 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this4.selectedSport === "MLB") {
        var dbEmpty;
        try {
          dbEmpty = yield _this4.mlbPlayerrInfoRepo.find({
            where: {
              playerId: {
                "!=": 0
              }
            }
          });
          if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != _this4.date.getDate()) {
            yield _this4.getMlbPlayerIds();
            yield src_shared_Controllers_MlbController__WEBPACK_IMPORTED_MODULE_3__.MlbController.updatePlayerINfo(_this4.playerInfoTemp);
            yield src_shared_Controllers_MlbController__WEBPACK_IMPORTED_MODULE_3__.MlbController.loadPlayers().then(item => _this4.playerInfoFinal = item);
          } else {
            yield src_shared_Controllers_MlbController__WEBPACK_IMPORTED_MODULE_3__.MlbController.loadPlayers().then(item => _this4.playerInfoFinal = item);
          }
        } catch (error) {
          alert(error.message);
        }
      }
      /* if (this.selectedSport === "NHL") {
        var dbEmpty
        try{
          dbEmpty = await this.mlbPlayerrInfoRepo.find({where: { playerId:{ "!=":0} }})
          if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()){
            await this.getMlbPlayerIds();
             
            await MlbController.updatePlayerINfo(this.playerInfoTemp);
            
          
            await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
           }
           else{
            await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
           }
        }catch (error: any){
          alert(error.message)
        }
      } */
    })();
  }
  //adding items to checkout
  addPropToChechout(event) {
    console.log(event);
  }
  addItemToCheckout(event) {
    console.log(event);
    event.isDisabled = true;
    //var bestBets = this.findBestBetsFromEvent(event);
    //bestBets.forEach(element => {
    // this.checkoutArray.push(element);
    // });
    this.checkoutArray.push(event);
  }
  isExit(event) {
    this.checkoutArray.forEach(e => e.isDisabled = false);
    this.checkoutArray = [];
  }
  getArrayLength(event) {
    this.checkoutArray = event;
  }
  findBestBetsFromEvent(event) {
    console.log(event);
    var bestBets = this.addBestBets(event);
    bestBets.forEach(element => {
      this.checkoutArray.push(element);
    });
    console.log();
  }
  addBestBets(event) {
    var bets = [];
    for (var i = 0; i < event.length; i++) {
      if (parseInt(event[i].percentTeam) >= .900 || parseInt(event[i].percentTotal) >= .500) {
        bets.push(event[i]);
      }
    }
    console.log(bets);
    return bets;
  }
  testFunc(event) {
    console.log(event);
  }
  convertSport(sport) {
    return this.sportsToTitle[sport];
  }
  convertDate(fullDate) {
    var tempDate = fullDate?.split("T");
    var time = tempDate[1].slice(0, 2);
    var subtractDay = false;
    if (parseInt(time) - 6 <= 0) {
      subtractDay = true;
    }
    var indexOfFirstDash = tempDate[0].indexOf("-");
    var tempDate2 = tempDate[0].slice(indexOfFirstDash + 1, tempDate[0].length + 1);
    var finalDate = tempDate2.replace("-", "/");
    if (subtractDay) {
      finalDate = finalDate.replace(finalDate.charAt(finalDate.length - 1), (parseInt(finalDate.charAt(finalDate.length - 1)) - 1).toString());
    }
    return finalDate;
  }
  updateDates() {
    this.dates = [];
    this.sportsBookDataFinal.forEach(x => {
      if (!this.dates.includes(this.convertDate(x.commenceTime))) {
        this.dates.push(this.convertDate(x.commenceTime));
      }
    });
    this.setSelectedDate(this.dates[0]);
    this.updateGames();
  }
  updateGames() {
    this.games = [];
    this.sportsBookDataFinal.forEach(x => {
      if (this.selectedDate == this.convertDate(x.commenceTime)) {
        let check = this.games.filter(e => e.id == x.bookId);
        if (check.length == 0) {
          this.games.push({
            game: `${x.homeTeam} vs ${x.awayTeam}`,
            id: x.bookId
          });
        }
      }
    });
  }
  displayProp() {
    const tempProp = this.sportsBookDataFinal.filter(x => x.bookId == this.selectedGame);
    var name1 = '';
    var h2h = '';
    var spreadPoint = '';
    var spreadPrice = '';
    var totalPoint = '';
    var totalPrice = '';
    var team1 = tempProp.filter(e => e.teamName == e.homeTeam);
    var team2 = tempProp.filter(e => e.teamName == e.awayTeam);
    name1 = team1[0].teamName;
    h2h = team1.filter(e => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team1.filter(e => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team1.filter(e => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter(e => e.marketKey == "totals" && e.teamName == "Over")[0].point.toString();
    totalPrice = tempProp.filter(e => e.marketKey == "totals" && e.teamName == "Over")[0].price.toString();
    this.displayPropHtml1 = {
      name: name1,
      h2h: h2h,
      spreadPoint: spreadPoint,
      spreadPrice: spreadPrice,
      totalPoint: totalPoint,
      totalPrice: totalPrice
    };
    name1 = team2[0].teamName;
    h2h = team2.filter(e => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team2.filter(e => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team2.filter(e => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter(e => e.marketKey == "totals" && e.teamName == "Under")[0].point.toString();
    totalPrice = tempProp.filter(e => e.marketKey == "totals" && e.teamName == "Under")[0].price.toString();
    this.displayPropHtml2 = {
      name: name1,
      h2h: h2h,
      spreadPoint: spreadPoint,
      spreadPrice: spreadPrice,
      totalPoint: totalPoint,
      totalPrice: totalPrice
    };
    //console.log(this.displayPropHtml)
  }

  checkSportsBookDb() {
    var _this5 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      var dbEmpty;
      console.log("Here in sports book db");
      try {
        dbEmpty = yield _this5.SportsBookRepo.find({
          where: {
            sportTitle: _this5.selectedSport
          }
        });
        if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != _this5.date.getDate()) {
          var results = yield _this5.draftKingsApiController.getDatesAndGames(_this5.selectedSport);
          yield src_shared_Controllers_SportsBookController__WEBPACK_IMPORTED_MODULE_5__.SportsBookController.addBookData(results);
          yield src_shared_Controllers_SportsBookController__WEBPACK_IMPORTED_MODULE_5__.SportsBookController.loadSportBook(_this5.selectedSport).then(item => _this5.sportsBookDataFinal = item);
          console.log(_this5.sportsBookDataFinal);
        } else {
          yield src_shared_Controllers_SportsBookController__WEBPACK_IMPORTED_MODULE_5__.SportsBookController.loadSportBook(_this5.selectedSport).then(item => _this5.sportsBookDataFinal = item);
        }
      } catch (error) {
        alert(error.message);
      }
    })();
  }
  checkPlayerInfoDb() {
    var _this6 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      var dbEmpty = [];
      if (_this6.selectedSport == "NHL") {
        try {
          dbEmpty = yield _this6.nhlPlayerInfoRepo.find({
            where: {
              playerId: {
                "!=": 0
              }
            }
          });
          if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != _this6.date.getDate()) {
            var results = yield _this6.nhlApiController.getplayerInfo();
            yield src_shared_Controllers_NhlPlayerInfoController__WEBPACK_IMPORTED_MODULE_9__.NhlPlayerInfoController.nhlAddPlayerINfoData(results);
          }
        } catch (error) {
          alert(error.message);
        }
      }
      if (_this6.selectedSport == "NBA") {
        try {
          var gameArray = _this6.splitGameString(_this6.gameString);
          let teamId = _this6.arrayOfNBATeams[_this6.addUnderScoreToName(gameArray[0])];
          console.log(_this6.addUnderScoreToName(gameArray[0]));
          let dbEmpty = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerInfoFromTeamId(teamId);
          if (dbEmpty.length == 0) {
            var returnCall = yield _this6.nbaApiController.getNbaPlayerDataFromApi(_this6.gameString);
            yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaAddPlayerInfoData(returnCall);
          } else if (dbEmpty.length > 0) {
            if (_this6.convertDate(dbEmpty[0].createdAt?.toString()) != _this6.getMonthAndDay()) {
              var returnCall = yield _this6.nbaApiController.getNbaPlayerDataFromApi(_this6.gameString);
              yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaAddPlayerInfoData(returnCall);
            }
          }
        } catch (error) {
          alert(error.message);
        }
        dbEmpty = [];
      }
    })();
  }
  splitGameString(game) {
    var bothGames = [];
    var temp = '';
    var vsIndex = 0;
    vsIndex = game.indexOf("vs");
    bothGames.push(game.slice(0, vsIndex - 1));
    bothGames.push(game.slice(vsIndex + 3, game.length));
    return bothGames;
  }
  addUnderScoreToName(game) {
    game = game.replaceAll(" ", "_");
    return game;
  }
  onPropTypeClicked(event) {
    var _this7 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (event.tab.textLabel == "Player Props") {
        _this7.gamePropsClicked = false;
        yield _this7.loadPlayerProps();
      } else if (event.tab.textLabel == "Game Props") {
        _this7.playerPropsClicked = false;
        _this7.gamePropsClicked = true;
      }
    })();
  }
  //add checkplayerstat db for prevous and current season, if there is 0 data in 2022 then try the api call, if no data from api call for 2022 season then load one row for 2022 that has all defaults
  // then check 2023 season, if there is 0 data for the 2023 season or the insert date is not the current date then try the
  //API calls
  loadPlayerProps() {
    var _this8 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this8.playerPropsClicked == true) {
        _this8.playerPropsClicked = false;
        return;
      }
      _this8.playerPropsClicked = true;
      try {
        var dbEmpty = yield _this8.playerPropRepo.find({
          where: {
            bookId: _this8.selectedGame
          }
        });
        if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != _this8.date.getDate()) {
          var results = yield _this8.draftKingsApiController.getPlayerProps(_this8.selectedSport, _this8.selectedGame);
          yield src_shared_Controllers_PlayerPropController__WEBPACK_IMPORTED_MODULE_7__.PlayerPropController.addPlayerPropData(results);
          yield src_shared_Controllers_PlayerPropController__WEBPACK_IMPORTED_MODULE_7__.PlayerPropController.loadPlayerPropData(_this8.selectedSport).then(item => _this8.playerPropDataFinal = item);
          console.log(_this8.sportsBookDataFinal);
          _this8.addplayerPropToArray();
        } else {
          yield src_shared_Controllers_PlayerPropController__WEBPACK_IMPORTED_MODULE_7__.PlayerPropController.loadPlayerPropData(_this8.selectedSport).then(item => _this8.playerPropDataFinal = item);
          _this8.addplayerPropToArray();
          console.log(_this8.sportsBookDataFinal);
          console.log(_this8.sportsBookData);
        }
      } catch (error) {
        alert(error.message);
      }
    })();
  }
  //add this back when game props get fleshed out more
  /* async loadGameProps() {
    if (this.gamePropsClicked == true) {
      this.gamePropsClicked = false;
      return;
    }
    this.gamePropsClicked = true;
    var urlNew = '';
    if (this.selectedSport === "MLB") {
      //replace batterhomeruns with stringcontaining all mlb player props
      urlNew = this.pre_initial_player_prop + this.convertSport(this.selectedSport) + this.middle_initial_player_prop + this.selectedGame + this.middle_next_player_prop + "batter_home_runs,batter_hits,batter_total_bases" + this.post_initial_player_prop;
    }
       const promise = await fetch(urlNew);
    const processedResponse = await promise.json();
    this.playerProps = processedResponse;
    console.log(this.playerProps)
    this.addplayerPropToArray();
  } */
  addplayerPropToArray() {
    // takes the stream from the database and converts it to the objects for display
    var differentPropTypes = [];
    this.playerPropDataFinal.forEach(e => {
      if (!differentPropTypes.includes(e.marketKey)) {
        differentPropTypes.push(e.marketKey);
      }
    });
    this.playerPropObjectArray = [];
    for (let j = 0; j < differentPropTypes.length; j++) {
      this.playerPropsArray = [];
      for (var u = 0; u < this.playerPropDataFinal.length; u++) {
        if (this.playerPropDataFinal[u].marketKey == differentPropTypes[j]) {
          var playerName = this.playerPropDataFinal[u].playerName;
          playerName = playerName.replaceAll(".", "");
          this.playerPropsArray.push({
            name: playerName,
            id: '',
            description: this.playerPropDataFinal[u].description,
            price: this.playerPropDataFinal[u].price.toString(),
            point: this.playerPropDataFinal[u].point.toString(),
            event: this.removeUnderscoreFromPlayerProp(this.playerPropDataFinal[u].marketKey),
            isDisabled: false,
            percentTotal: "",
            percentTeam: "",
            avgTotal: "",
            avgTeam: "",
            team1: this.playerPropDataFinal[u].homeTeam,
            team2: this.playerPropDataFinal[u].awayTeam,
            isOpened: false,
            teamAgainst: '',
            averageDifferential: "",
            gamesPlayed: "",
            gamesPlayedvsTeam: "",
            average2022: "",
            average2022vsTeam: ""
          });
        }
      }
      this.playerPropObjectArray[j] = this.playerPropsArray;
    }
    this.playerProps = new _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatTableDataSource(this.playerPropObjectArray);
  }
  removeUnderscoreFromPlayerProp(prop) {
    prop = prop.replaceAll("_", " ");
    return prop;
  }
  getPlayerStatsForSeason(element) {
    var _this9 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (element.percentTotal === "") {
        yield _this9.getPlayerStatsForSeasonCall(element);
      }
    })();
  }
  getPlayerStatsForSeasonCall(element) {
    var _this10 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        if (_this10.selectedSport == "NHL") {
          for (let i = 0; i < element.length; i++) {
            let player = yield src_shared_Controllers_NhlPlayerInfoController__WEBPACK_IMPORTED_MODULE_9__.NhlPlayerInfoController.nhlLoadPlayerInfoFromName(element[i].name);
            let db2022 = yield _this10.nhlPlayerGameStatRepo.find({
              where: {
                season: "20222023",
                playerId: player[0].playerId
              }
            });
            let db2023 = yield _this10.nhlPlayerGameStatRepo.find({
              where: {
                season: "20232024",
                playerId: player[0].playerId
              }
            });
            if (db2022.length == 0) {
              var results = yield _this10.nhlApiController.loadNhl2022PlayerStatData(player[0].playerId);
              if (results.length == 0) {
                yield src_shared_Controllers_NhlPlayerGameStatsController__WEBPACK_IMPORTED_MODULE_11__.NhlPlayerGameStatsController.nhlAddPlayerINfo2022BlankData(player[0].playerId, player[0].playerName);
              } else {
                yield src_shared_Controllers_NhlPlayerGameStatsController__WEBPACK_IMPORTED_MODULE_11__.NhlPlayerGameStatsController.nhlAddPlayerINfo2022Data(results);
              }
              yield src_shared_Controllers_NhlPlayerGameStatsController__WEBPACK_IMPORTED_MODULE_11__.NhlPlayerGameStatsController.nhlLoadPlayerInfo2022FromId(player[0].playerId).then(item => _this10.nhlPlayerStatData2022Final = item);
            } else {
              yield src_shared_Controllers_NhlPlayerGameStatsController__WEBPACK_IMPORTED_MODULE_11__.NhlPlayerGameStatsController.nhlLoadPlayerInfo2022FromId(player[0].playerId).then(item => _this10.nhlPlayerStatData2022Final = item);
            }
            if (db2023.length == 0 || db2023[0].createdAt?.getDate() != _this10.date.getDate()) {
              var results = yield _this10.nhlApiController.loadNhl2023PlayerStatData(player[0].playerId);
              yield src_shared_Controllers_NhlPlayerGameStatsController__WEBPACK_IMPORTED_MODULE_11__.NhlPlayerGameStatsController.nhlAddPlayerINfo2023Data(results);
              yield src_shared_Controllers_NhlPlayerGameStatsController__WEBPACK_IMPORTED_MODULE_11__.NhlPlayerGameStatsController.nhlLoadPlayerInfo2023FromId(player[0].playerId).then(item => _this10.nhlPlayerStatData2023Final = item);
            } else {
              yield src_shared_Controllers_NhlPlayerGameStatsController__WEBPACK_IMPORTED_MODULE_11__.NhlPlayerGameStatsController.nhlLoadPlayerInfo2023FromId(player[0].playerId).then(item => _this10.nhlPlayerStatData2023Final = item);
            }
            yield _this10.computeStatForPlayer(element[i]);
          }
        }
        if (_this10.selectedSport == "NBA") {
          for (let i = 0; i < element.length; i++) {
            let player = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerInfoFromName(element[i].name);
            let db2022 = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2022);
            let db2023 = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023);
            if (db2022.length == 0) {
              let results = yield _this10.nbaApiController.loadNba2022PlayerStatData(player[0].playerId);
              if (results.length == 0) {
                yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaAddPlayerStat2022BlankData(player[0].playerId, player[0].playerName);
              } else {
                yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaAddPlayerGameStats2022(results);
              }
              yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2022).then(item => _this10.nbaPlayerStatData2022Final = item);
            } else {
              yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2022).then(item => _this10.nbaPlayerStatData2022Final = item);
            }
            if (db2023.length == 0) {
              let results = yield _this10.nbaApiController.loadNba2023PlayerStatData(player[0].playerId);
              yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaAddPlayerGameStats2023(results);
              yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => _this10.nbaPlayerStatData2023Final = item);
            } else if (db2023.length != 0) {
              if (_this10.convertDate(db2023[db2023.length - 1].createdAt?.toString()) != _this10.getMonthAndDay()) {
                let results = yield _this10.nbaApiController.loadNba2023PlayerStatData(player[0].playerId);
                yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaAddPlayerGameStats2023(results);
                yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => _this10.nbaPlayerStatData2023Final = item);
              } else {
                yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => _this10.nbaPlayerStatData2023Final = item);
                //here
              }
            }

            yield _this10.computeStatForPlayer(element[i]);
          }
        }
        _this10.displayProgressBar = false;
      } catch (error) {
        console.log(error);
      }
    })();
  }
  computeStatsForAllPlayersInProp(element) {
    var _this11 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (element[0].percentTeam == "") {
        yield _this11.getPlayerStatsForSeasonCall(element);
      }
    })();
  }
  computeStatForPlayer(element) {
    var _this12 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      //add this function to get called when the original elements get added to the interface
      //don't make the call each time. Make the call once then add it to an array then once they click again check to see if it's already stored
      _this12.playerAverageForSeason = 0;
      _this12.playerPercentForSeason = 0;
      _this12.playerAverageVsTeam = 0;
      _this12.playerPercentVsTeam = 0;
      _this12.teamAgainst = '';
      _this12.differential = 0;
      _this12.gamesPlayedVsTeam = 0;
      _this12.playerId = 0;
      _this12.average2022 = 0;
      _this12.average2022vsTeam = 0;
      var numberOfGamesStarted = 0;
      var numberOfGamesStartedVsTeam = 0;
      var numberOfGamesStartedVsTeam2022 = 0;
      if (_this12.selectedSport == "MLB") {
        var resultArray = Object.keys(_this12.tempPlayerStatData).map(personNamedIndex => {
          let newStatData = _this12.tempPlayerStatData[personNamedIndex];
          return newStatData;
        });
        var numberOfGamesStarted = 0;
        var numberOfGamesStartedVsTeam = 0;
        if (resultArray[0].team == _this12.getTeamName(element.team1)) {
          _this12.teamAgainst = _this12.getTeamName(element.team2);
        } else {
          _this12.teamAgainst = _this12.getTeamName(element.team1);
        }
        var d = new Date();
        var year = d.getFullYear().toString();
        var month = (d.getMonth() + 1).toString();
        if (month.length == 1) {
          month = "0" + month;
        }
        var day = d.getDate().toString();
        console.log(day);
        if (day.length == 1) {
          day = "0" + day;
        }
        var fullDate = year + month + day;
        //add a check to get the prop variable to searc for, H, HR, TB etc
        var propCde = '';
        switch (element.event) {
          case "batter hits":
            propCde = "H";
            break;
          case "batter home runs":
            propCde = "HR";
            break;
          case "batter total bases":
            propCde = "TB";
            break;
        }
        console.log(propCde);
        for (let i = 0; i < resultArray.length; i++) {
          if (resultArray[i].started == "True") {
            var gameDate = resultArray[i].gameID.slice(0, 8);
            if (gameDate == fullDate) {
              continue;
            }
            numberOfGamesStarted++;
            _this12.playerAverageForSeason += parseInt(resultArray[i].Hitting[propCde]);
            if (element.name == "Over") {
              if (parseInt(resultArray[i].Hitting[propCde]) > element.point) {
                _this12.playerPercentForSeason++;
              }
            } else if (element.name == "Under") {
              if (parseInt(resultArray[i].Hitting[propCde]) < element.point) {
                _this12.playerPercentForSeason++;
              }
            }
            if (resultArray[i].gameID.includes(_this12.teamAgainst)) {
              numberOfGamesStartedVsTeam++;
              _this12.playerAverageVsTeam += parseInt(resultArray[i].Hitting[propCde]);
              if (element.name == "Over") {
                if (parseInt(resultArray[i].Hitting[propCde]) > element.point) {
                  _this12.playerPercentVsTeam++;
                }
              } else if (element.name == "Under") {
                if (parseInt(resultArray[i].Hitting[propCde]) < element.point) {
                  _this12.playerPercentVsTeam++;
                }
              }
            }
          }
        }
        if (numberOfGamesStarted == 0) {
          _this12.playerAverageForSeason = 0;
          _this12.playerPercentForSeason = 0;
        } else {
          _this12.playerAverageForSeason = (_this12.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
          _this12.playerPercentForSeason = (_this12.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
        }
        if (numberOfGamesStartedVsTeam == 0) {
          _this12.playerAverageVsTeam = 0;
          _this12.playerPercentVsTeam = 0;
        } else {
          _this12.playerAverageVsTeam = (_this12.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
          _this12.playerPercentVsTeam = (_this12.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        }
      }
      if (_this12.selectedSport == "NHL") {
        var teamName = _this12.nhlPlayerStatData2023Final[0].teamName;
        if (teamName.includes(".")) {
          teamName = teamName.replaceAll(".", "");
        }
        _this12.teamAgainst = teamName == element.team1 ? element.team2 : element.team1;
        var d = new Date();
        var year = d.getFullYear().toString();
        var month = (d.getMonth() + 1).toString();
        if (month.length == 1) {
          month = "0" + month;
        }
        var day = d.getDate().toString();
        if (day.length == 1) {
          day = "0" + day;
        }
        var fullDate = year + month + day;
        //add a check to get the prop variable to searc for, H, HR, TB etc
        var propCde = '';
        switch (element.event) {
          case "player assists":
            propCde = "assists";
            break;
          case "player points":
            propCde = "points";
            break;
          case "player shots on goal":
            propCde = "shots";
            break;
        }
        numberOfGamesStarted = _this12.nhlPlayerStatData2023Final.length;
        _this12.nhlPlayerStatData2023Final.forEach(e => {
          _this12.playerAverageForSeason += e[propCde];
          if (element.description == "Over") {
            if (parseInt(e[propCde]) > element.point) {
              _this12.playerPercentForSeason++;
            }
          } else if (element.description == "Under") {
            if (parseInt(e[propCde]) < element.point) {
              _this12.playerPercentForSeason++;
            }
          }
          if (e.teamAgainst == _this12.teamAgainst) {
            numberOfGamesStartedVsTeam++;
            _this12.playerAverageVsTeam += e[propCde];
            if (element.name == "Over") {
              if (e[propCde] > element.point) {
                _this12.playerPercentVsTeam++;
              }
            } else if (element.name == "Under") {
              if (e[propCde] < element.point) {
                _this12.playerPercentVsTeam++;
              }
            }
          }
        });
        _this12.nhlPlayerStatData2022Final.forEach(e => {
          _this12.average2022 += e[propCde];
          if (e.teamAgainst == _this12.teamAgainst) {
            numberOfGamesStartedVsTeam2022++;
            _this12.average2022vsTeam += e[propCde];
          }
        });
        if (numberOfGamesStarted == 0) {
          _this12.playerAverageForSeason = 0;
          _this12.playerPercentForSeason = 0;
        } else {
          _this12.playerAverageForSeason = (_this12.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
          _this12.playerPercentForSeason = (_this12.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
        }
        if (numberOfGamesStartedVsTeam == 0) {
          _this12.playerAverageVsTeam = -1;
          _this12.playerPercentVsTeam = -1;
        } else {
          _this12.playerAverageVsTeam = (_this12.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
          _this12.playerPercentVsTeam = (_this12.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        }
        if (element.description == "Over") {
          _this12.differential = _this12.playerAverageForSeason / element.point;
        } else if (element.description == "Under") {
          if (_this12.playerAverageForSeason == 0) {
            _this12.differential = 0;
          } else {
            _this12.differential = element.point / _this12.playerAverageForSeason;
          }
        }
        _this12.gamesPlayedVsTeam = numberOfGamesStartedVsTeam;
        if (_this12.average2022 > 0 && _this12.nhlPlayerStatData2022Final.length > 0) {
          _this12.average2022 = (_this12.average2022 / _this12.nhlPlayerStatData2022Final.length).toFixed(3);
        } else {
          _this12.average2022 = -1;
        }
        if (_this12.average2022vsTeam > 0 && _this12.nhlPlayerStatData2022Final.length > 0) {
          _this12.average2022vsTeam = (_this12.average2022vsTeam / numberOfGamesStartedVsTeam2022).toFixed(3);
        } else {
          _this12.average2022vsTeam = -1;
        }
      }
      if (_this12.selectedSport == "NBA") {
        let tempTeamName1 = element.team1;
        let tempTeamName2 = element.team2;
        if (tempTeamName1.includes(" ")) {
          tempTeamName1 = tempTeamName1.replaceAll(" ", "_");
        }
        if (tempTeamName2.includes(" ")) {
          tempTeamName2 = tempTeamName2.replaceAll(" ", "_");
        }
        let teamId1 = _this12.arrayOfNBATeams[tempTeamName1];
        let teamId2 = _this12.arrayOfNBATeams[tempTeamName2];
        let playerId = yield src_shared_Controllers_NbaController__WEBPACK_IMPORTED_MODULE_14__.NbaController.nbaLoadPlayerInfoFromName(element.name);
        _this12.teamAgainst = _this12.arrayOfNBATeams[_this12.addUnderScoreToName(element.team1)] == _this12.nbaPlayerStatData2023Final[0].teamId ? element.team2 : element.team1;
        var d = new Date();
        var year = d.getFullYear().toString();
        var month = (d.getMonth() + 1).toString();
        if (month.length == 1) {
          month = "0" + month;
        }
        var day = d.getDate().toString();
        console.log(day);
        if (day.length == 1) {
          day = "0" + day;
        }
        var fullDate = year + month + day;
        //add a check to get the prop variable to searc for, H, HR, TB etc
        let propCde;
        switch (element.event) {
          case "player assists":
            propCde = "assists";
            break;
          case "player double double":
            propCde = "doubleDouble";
            break;
          case "player points":
            propCde = "points";
            break;
          case "player rebounds":
            propCde = "totReb";
            break;
          case "player threes":
            propCde = "tpm";
            break;
        }
        numberOfGamesStarted = _this12.nbaPlayerStatData2023Final.length;
        _this12.nbaPlayerStatData2023Final.forEach(e => {
          _this12.playerAverageForSeason += e[propCde];
          if (element.description == "Over") {
            if (parseInt(e[propCde]) > element.point) {
              _this12.playerPercentForSeason++;
            }
          } else if (element.description == "Under") {
            if (parseInt(e[propCde]) < element.point) {
              _this12.playerPercentForSeason++;
            }
          }
          if (e.teamAgainst == _this12.teamAgainst) {
            numberOfGamesStartedVsTeam++;
            _this12.playerAverageVsTeam += e[propCde];
            if (element.name == "Over") {
              if (e[propCde] > element.point) {
                _this12.playerPercentVsTeam++;
              }
            } else if (element.name == "Under") {
              if (e[propCde] < element.point) {
                _this12.playerPercentVsTeam++;
              }
            }
          }
        });
        _this12.nbaPlayerStatData2022Final.forEach(e => {
          _this12.average2022 += e[propCde];
          if (e.teamAgainst == _this12.teamAgainst) {
            numberOfGamesStartedVsTeam2022++;
            _this12.average2022vsTeam += e[propCde];
          }
        });
        if (numberOfGamesStarted == 0) {
          _this12.playerAverageForSeason = 0;
          _this12.playerPercentForSeason = 0;
        } else {
          _this12.playerAverageForSeason = (_this12.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
          _this12.playerPercentForSeason = (_this12.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
        }
        if (numberOfGamesStartedVsTeam == 0) {
          _this12.playerAverageVsTeam = -1;
          _this12.playerPercentVsTeam = -1;
        } else {
          _this12.playerAverageVsTeam = (_this12.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
          _this12.playerPercentVsTeam = (_this12.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        }
        if (element.description == "Over") {
          _this12.differential = _this12.playerAverageForSeason / element.point;
        } else if (element.description == "Under") {
          if (_this12.playerAverageForSeason == 0) {
            _this12.differential = 0;
          } else {
            _this12.differential = element.point / _this12.playerAverageForSeason;
          }
        }
        _this12.playerId = _this12.nbaPlayerStatData2023Final[0].playerId;
        _this12.gamesPlayed = _this12.nbaPlayerStatData2023Final.length;
        _this12.gamesPlayedVsTeam = numberOfGamesStartedVsTeam;
        if (_this12.average2022 > 0 && _this12.nbaPlayerStatData2022Final.length > 0) {
          _this12.average2022 = (_this12.average2022 / _this12.nbaPlayerStatData2022Final.length).toFixed(3);
        } else {
          _this12.average2022 = -1;
        }
        if (_this12.average2022vsTeam > 0 && _this12.nbaPlayerStatData2022Final.length > 0) {
          _this12.average2022vsTeam = (_this12.average2022vsTeam / numberOfGamesStartedVsTeam2022).toFixed(3);
        } else {
          _this12.average2022vsTeam = -1;
        }
      }
      _this12.updatePlayerPropArray(element);
    })();
  }
  updatePlayerPropArray(element) {
    element.avgTotal = this.playerAverageForSeason;
    element.percentTotal = this.playerPercentForSeason;
    element.percentTeam = this.playerPercentVsTeam;
    element.avgTeam = this.playerAverageVsTeam;
    element.teamAgainst = this.teamAgainst;
    element.averageDifferential = this.differential.toFixed(3);
    element.gamesPlayed = this.gamesPlayed;
    element.gamesPlayedVsTeam = this.gamesPlayedVsTeam;
    element.average2022 = this.average2022;
    element.average2022vsTeam = this.average2022vsTeam;
    element.id = this.playerId;
  }
  playerNameSpanishConvert(list) {
    var newList = list;
    for (let i = 0; i < newList.length; i++) {
      var name = newList[i].playerName;
      if (name.includes("á")) {
        name = name.replaceAll("á", "a");
      }
      if (name.includes("é")) {
        name = name.replaceAll("é", "e");
      }
      if (name.includes("í")) {
        name = name.replaceAll("í", "i");
      }
      if (name.includes("ñ")) {
        name = name.replaceAll("ñ", "n");
      }
      if (name.includes("ó")) {
        name = name.replaceAll("ó", "o");
      }
      if (name.includes("ú")) {
        name = name.replaceAll("ú", "u");
      }
      newList[i].playerName = name;
    }
    return newList;
  }
  getMlbPlayerIds() {
    var _this13 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerList';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
          'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
        }
      };
      const response = yield fetch(url, options);
      const result = yield response.json();
      let temp = result.body;
      temp.forEach(e => _this13.playerInfoTemp.push({
        playerId: e.playerID,
        playerName: e.longName,
        teamName: e.team,
        teamId: e.teamID
      }));
      _this13.playerInfoTemp = _this13.playerNameSpanishConvert(_this13.playerInfoTemp);
    })();
  }
  getMlbPlayerIdFromName(name) {
    var player = this.mlbPlayerId.filter(x => x.Name == name);
    return player[0].Id;
  }
  getTeamName(team) {
    team = this.insertUnderscore(team);
    return this.arrayOfMLBTeams[team];
  }
  insertUnderscore(team) {
    team = team.replaceAll(' ', '_');
    if (team.includes(".")) {
      console.log("Here");
      team = team.replaceAll('.', '');
    }
    console.log(team);
    return team;
  }
  getDate() {
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = d.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    var fullDate = day + "/" + month + "/" + year;
    return fullDate;
  }
  getMonthAndDay() {
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = d.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    var fullDate = month + "/" + day;
    return fullDate;
  }
  ngOnInit() {
    var _this14 = this;
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this14.trimSports(yield _this14.draftKingsApiController.getSports());
    })();
  }
  detailedStatsClicked(element) {
    this.router.navigate(["/playerStats/" + this.selectedSport + "/" + element.id]);
  }
  static #_ = this.ɵfac = function PropScreenComponent_Factory(t) {
    return new (t || PropScreenComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_20__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_ApiCalls_nbaApiCalls__WEBPACK_IMPORTED_MODULE_12__.nbaApiController), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_ApiCalls_nhlApiCalls__WEBPACK_IMPORTED_MODULE_15__.nhlApiController), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_ApiCalls_draftKingsApiCalls__WEBPACK_IMPORTED_MODULE_16__.draftKingsApiController), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_21__.Router));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdefineComponent"]({
    type: PropScreenComponent,
    selectors: [["app-prop-screen"]],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵProvidersFeature"]([_ApiCalls_nbaApiCalls__WEBPACK_IMPORTED_MODULE_12__.nbaApiController, _ApiCalls_nhlApiCalls__WEBPACK_IMPORTED_MODULE_15__.nhlApiController, _ApiCalls_draftKingsApiCalls__WEBPACK_IMPORTED_MODULE_16__.draftKingsApiController])],
    decls: 15,
    vars: 12,
    consts: [[2, "height", "100vh", "background-color", "#252324"], [1, "sports-tab", 3, "backgroundColor", "selectedTabChange"], [3, "label", 4, "ngFor", "ngForOf"], [1, "dates-tab", 3, "backgroundColor", "selectedTabChange"], [1, "games-tab", 3, "backgroundColor", "selectedTabChange"], [1, "props-tab", 3, "backgroundColor", "selectedIndex", "selectedTabChange"], ["label", "Game Props"], ["label", "Player Props"], [4, "ngIf"], [3, "prop", "exitSend", "length", 4, "ngIf"], [3, "label"], ["cols", "2", "rowHeight", "1.25:1"], [2, "background-color", "lightblue"], [2, "height", "inherit", "width", "100%"], ["cols", "4", "rowHeight", "100px"], ["colspan", "4", 2, "justify-content", "center", "align-content", "center", "font-size", "xx-large"], [2, "background-color", "lightcoral"], [2, "position", "absolute", "top", "20rem", "left", "0", "right", "0", "margin-left", "auto", "margin-right", "auto", "height", "400px", "width", "300px", "background-color", "lightslategray"], ["cols", "5", "rowHeight", "40px"], ["colspan", "2", 2, "margin-top", "2rem", "font-size", "x-large"], ["mat-raised-button", "", "color", "primary"], ["colspan", "1", 2, "margin-top", "2rem", "text-wrap", "balance", "text-align", "center"], ["colspan", "2", 2, "margin-top", "2rem"], ["mat-raised-button", "", "color", "primary", 2, "white-space", "initial"], ["colspan", "1", 2, "margin-top", "2rem"], [3, "opened", "closed", "afterExpand", 4, "ngFor", "ngForOf"], [3, "opened", "closed", "afterExpand"], [1, "header-panel"], ["mat-raised-button", "", "class", "panel-button", "color", "primary", 3, "click", 4, "ngIf"], ["matExpansionPanelContent", ""], ["mat-raised-button", "", "color", "primary", 1, "panel-button", 3, "click"], ["mode", "indeterminate", 4, "ngIf"], ["mat-table", "", "multiTemplateDataRows", "", "class", "mat-elevation-z8 player-table", 3, "dataSource", 4, "ngIf"], ["mode", "indeterminate"], ["mat-table", "", "multiTemplateDataRows", "", 1, "mat-elevation-z8", "player-table", 3, "dataSource"], ["matColumnDef", "name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "description"], ["matColumnDef", "price"], ["matColumnDef", "point"], ["matColumnDef", "detailedStats"], ["matColumnDef", "expandedDetail"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["mat-row", "", "class", "example-detail-row", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-raised-button", "", "color", "primary", 3, "disabled", "click"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["class", "example-element-detail", "style", "display: flex; flex-direction: column;", 4, "ngIf"], [1, "example-element-detail", 2, "display", "flex", "flex-direction", "column"], [2, "display", "flex", "gap", "3rem"], ["mat-header-row", ""], ["mat-row", "", 3, "click"], ["mat-row", "", 1, "example-detail-row", 3, "click"], [3, "prop", "exitSend", "length"]],
    template: function PropScreenComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div", 0)(1, "mat-tab-group", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("selectedTabChange", function PropScreenComponent_Template_mat_tab_group_selectedTabChange_1_listener($event) {
          return ctx.onSportClick($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](2, PropScreenComponent_mat_tab_2_Template, 1, 1, "mat-tab", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](3, "mat-tab-group", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("selectedTabChange", function PropScreenComponent_Template_mat_tab_group_selectedTabChange_3_listener($event) {
          return ctx.onDateClick($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](4, PropScreenComponent_mat_tab_4_Template, 1, 1, "mat-tab", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](5, "mat-tab-group", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("selectedTabChange", function PropScreenComponent_Template_mat_tab_group_selectedTabChange_5_listener($event) {
          return ctx.onGameClick($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](6, PropScreenComponent_mat_tab_6_Template, 1, 1, "mat-tab", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](7, "mat-tab-group", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("selectedTabChange", function PropScreenComponent_Template_mat_tab_group_selectedTabChange_7_listener($event) {
          return ctx.onPropTypeClicked($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](8, "mat-tab", 6)(9, "mat-tab", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](10, PropScreenComponent_div_10_Template, 38, 2, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](11, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](12, PropScreenComponent_mat_accordion_12_Template, 2, 1, "mat-accordion", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](13, PropScreenComponent_div_13_Template, 1, 0, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](14, PropScreenComponent_app_prop_checkout_14_Template, 1, 1, "app-prop-checkout", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("backgroundColor", "warn");
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngForOf", ctx.sportsNew);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("backgroundColor", "primary");
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngForOf", ctx.dates);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("backgroundColor", "warn");
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngForOf", ctx.games);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("backgroundColor", "primary")("selectedIndex", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx.gamePropsClicked);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx.playerPropsClicked);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx.playerPropsClicked);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx.checkoutArray.length > 0 && ctx.exit);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_22__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_22__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_23__.MatButton, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_24__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_24__.MatTabGroup, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_19__.MatRow, _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_25__.MatGridList, _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_25__.MatGridTile, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_26__.MatProgressBar, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_27__.MatAccordion, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_27__.MatExpansionPanel, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_27__.MatExpansionPanelHeader, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_27__.MatExpansionPanelTitle, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_27__.MatExpansionPanelDescription, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_27__.MatExpansionPanelContent, _prop_checkout_prop_checkout_component__WEBPACK_IMPORTED_MODULE_17__.PropCheckoutComponent, _angular_common__WEBPACK_IMPORTED_MODULE_22__.TitleCasePipe],
    styles: ["*[_ngcontent-%COMP%] {\n  z-index: 1;\n}\n\n.mat-tab-label1[_ngcontent-%COMP%] {\n  padding: 15px 0 15px 0;\n}\n\n.team-prop-display[_ngcontent-%COMP%] {\n  background-color: rgb(255, 56, 56);\n  display: flex;\n  justify-items: center;\n  padding-top: 1rem;\n}\n\n.team-prop-display[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n  margin-left: 1rem;\n}\n\n.card-header[_ngcontent-%COMP%] {\n  background-color: rgb(174, 174, 245);\n}\n\n.example-element-detail[_ngcontent-%COMP%] {\n  overflow: hidden;\n  display: flex;\n  gap: 3rem;\n}\n\ntr.example-detail-row[_ngcontent-%COMP%] {\n  height: 0;\n}\n\nmat-panel-description[_ngcontent-%COMP%] {\n  gap: 60rem;\n}\n\n.player-table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.mat-column-detailedStats[_ngcontent-%COMP%] {\n  width: 125px;\n  text-align: center;\n  font-weight: bold;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvcC1zY3JlZW4vcHJvcC1zY3JlZW4uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxVQUFBO0FBQ0o7O0FBQ0E7RUFBa0Isc0JBQUE7QUFHbEI7O0FBRkE7RUFDSSxrQ0FBQTtFQUNBLGFBQUE7RUFDQSxxQkFBQTtFQUNBLGlCQUFBO0FBS0o7O0FBSEE7RUFDSSxrQkFBQTtFQUNBLGlCQUFBO0FBTUo7O0FBSkE7RUFDSSxvQ0FBQTtBQU9KOztBQUxBO0VBQ0ksZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsU0FBQTtBQVFKOztBQU5FO0VBQ0UsU0FBQTtBQVNKOztBQVBFO0VBQ0UsVUFBQTtBQVVKOztBQU5FO0VBQ0UsV0FBQTtBQVNKOztBQUpFO0VBQ0UsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7QUFPSiIsInNvdXJjZXNDb250ZW50IjpbIip7XHJcbiAgICB6LWluZGV4OiAxO1xyXG59XHJcbi5tYXQtdGFiLWxhYmVsMSB7IHBhZGRpbmc6IDE1cHggMCAxNXB4IDA7IH1cclxuLnRlYW0tcHJvcC1kaXNwbGF5e1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjpyZ2IoMjU1LCA1NiwgNTYpO1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAganVzdGlmeS1pdGVtczogY2VudGVyO1xyXG4gICAgcGFkZGluZy10b3A6IDFyZW07XHJcbn1cclxuLnRlYW0tcHJvcC1kaXNwbGF5IGJ1dHRvbntcclxuICAgIG1hcmdpbi1yaWdodDogMXJlbTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxcmVtO1xyXG59XHJcbi5jYXJkLWhlYWRlcntcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxNzQsIDE3NCwgMjQ1KTtcclxufVxyXG4uZXhhbXBsZS1lbGVtZW50LWRldGFpbCB7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGdhcDogM3JlbTtcclxuICB9XHJcbiAgdHIuZXhhbXBsZS1kZXRhaWwtcm93IHtcclxuICAgIGhlaWdodDogMDtcclxuICB9XHJcbiAgbWF0LXBhbmVsLWRlc2NyaXB0aW9ue1xyXG4gICAgZ2FwOiA2MHJlbTtcclxuICB9XHJcblxyXG5cclxuICAucGxheWVyLXRhYmxlIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxuICBcclxuIFxyXG4gIFxyXG4gIC5tYXQtY29sdW1uLWRldGFpbGVkU3RhdHMge1xyXG4gICAgd2lkdGg6IDEyNXB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgfSJdLCJzb3VyY2VSb290IjoiIn0= */"],
    data: {
      animation: [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_28__.trigger)('detailExpand', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_28__.state)('collapsed', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_28__.style)({
        height: '0px',
        minHeight: '0'
      })), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_28__.state)('expanded', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_28__.style)({
        height: '*'
      })), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_28__.transition)('expanded <=> collapsed', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_28__.animate)('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))])]
    }
  });
}

/***/ }),

/***/ 4913:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 8629);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ }),

/***/ 3351:
/*!*************************************************!*\
  !*** ./src/shared/Controllers/MlbController.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MlbController: () => (/* binding */ MlbController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! remult */ 726);
/* harmony import */ var _dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dbTasks/PlayerInfoMlb */ 9517);




class MlbController {
  static updatePlayerINfo(player) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__.PlayerInfoMlb);
      var d = new Date();
      for (const name of player) {
        yield taskRepo.delete(name.playerId);
        yield taskRepo.insert({
          playerId: name.playerId,
          playerName: name.playerName,
          teamName: name.teamName,
          teamId: name.teamId
        });
      }
    })();
  }
  static getPlayerInfoById(id) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__.PlayerInfoMlb);
      return yield taskRepo.find({
        where: {
          playerId: id
        }
      });
    })();
  }
  static getPlayerInfoByName(name) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__.PlayerInfoMlb);
      return yield taskRepo.find({
        where: {
          playerName: name
        }
      });
    })();
  }
  static getPlayersInfoByTeamId(id) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__.PlayerInfoMlb);
      return yield taskRepo.find({
        where: {
          teamId: id
        }
      });
    })();
  }
  static getPlayersInfoByTeamName(name) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__.PlayerInfoMlb);
      return yield taskRepo.find({
        where: {
          teamName: name
        }
      });
    })();
  }
  static getPlayersInfoLength() {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__.PlayerInfoMlb);
      return yield taskRepo.find({
        where: {
          playerId: {
            "!=": 0
          }
        }
      });
    })();
  }
  static loadPlayers() {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_PlayerInfoMlb__WEBPACK_IMPORTED_MODULE_2__.PlayerInfoMlb);
      return yield taskRepo.find({
        limit: 20
      });
    })();
  }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], MlbController, "updatePlayerINfo", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], MlbController, "getPlayerInfoById", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], MlbController, "getPlayerInfoByName", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], MlbController, "getPlayersInfoByTeamId", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], MlbController, "getPlayersInfoByTeamName", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], MlbController, "getPlayersInfoLength", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], MlbController, "loadPlayers", null);

/***/ }),

/***/ 3777:
/*!*************************************************!*\
  !*** ./src/shared/Controllers/NbaController.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NbaController: () => (/* binding */ NbaController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! remult */ 726);
/* harmony import */ var _dbTasks_NbaPlayerInfoDb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dbTasks/NbaPlayerInfoDb */ 6552);
/* harmony import */ var _dbTasks_DbNbaGameStats__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dbTasks/DbNbaGameStats */ 286);





class NbaController {
  //player info database calls
  static nbaAddPlayerInfoData(playerData) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_NbaPlayerInfoDb__WEBPACK_IMPORTED_MODULE_2__.NbaPlayerInfoDb);
      console.log("Here in addPlayerInfoData");
      var dbToDelete = yield taskRepo.find({
        where: {
          playerId: {
            "!=": 0
          }
        }
      });
      if (dbToDelete.length > 0) {
        for (const d of dbToDelete) {
          yield taskRepo.delete(d);
        }
      }
      playerData.forEach(e => {
        if (e.playerName.includes("ü")) {
          e.playerName = e.playerName.replaceAll("ü", "u");
        }
        if (e.playerName.includes("é")) {
          e.playerName = e.playerName.replaceAll("é", "e");
        }
        if (e.playerName.includes("è")) {
          e.playerName = e.playerName.replaceAll("è", "e");
        }
        if (e.playerName.includes(".")) {
          e.playerName = e.playerName.replaceAll(".", "");
        }
      });
      for (const data of playerData) {
        yield taskRepo.insert({
          playerId: data.playerId,
          playerName: data.playerName,
          teamId: data.teamId
        });
      }
    })();
  }
  static nbaLoadPlayerInfoFromId(id) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_NbaPlayerInfoDb__WEBPACK_IMPORTED_MODULE_2__.NbaPlayerInfoDb);
      return yield taskRepo.find({
        where: {
          playerId: id
        }
      });
    })();
  }
  static nbaLoadPlayerInfoFromName(name) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      console.log("here in loadPlayerInfoFromName");
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_NbaPlayerInfoDb__WEBPACK_IMPORTED_MODULE_2__.NbaPlayerInfoDb);
      return yield taskRepo.find({
        where: {
          playerName: name
        }
      });
    })();
  }
  static nbaLoadPlayerInfoFromTeamId(id) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      console.log("here in nbaLoadPlayerInfoFromTeamId");
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_NbaPlayerInfoDb__WEBPACK_IMPORTED_MODULE_2__.NbaPlayerInfoDb);
      return yield taskRepo.find({
        where: {
          teamId: id
        }
      });
    })();
  }
  static nbaLoadAllPlayerInfoFrom() {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      console.log("here in nbaLoadAllPlayerInfoFrom");
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_NbaPlayerInfoDb__WEBPACK_IMPORTED_MODULE_2__.NbaPlayerInfoDb);
      return yield taskRepo.find({
        where: {
          playerId: {
            "!=": 0
          }
        }
      });
    })();
  }
  // player game stat database calls
  static nbaAddPlayerGameStats2022(playerData) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo2 = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNbaGameStats__WEBPACK_IMPORTED_MODULE_3__.DbNbaGameStats);
      console.log("Here in addPlayerGameStats2022");
      var dbToDelete = yield taskRepo2.find({
        where: {
          playerId: playerData[0].playerId,
          season: 2022
        }
      });
      if (dbToDelete.length < 1) {
        playerData.forEach(e => {
          if (e.playerName.includes("ü")) {
            e.playerName = e.playerName.replaceAll("ü", "u");
          }
          if (e.playerName.includes("é")) {
            e.playerName = e.playerName.replaceAll("é", "e");
          }
          if (e.playerName.includes("è")) {
            e.playerName = e.playerName.replaceAll("è", "e");
          }
        });
        for (const data of playerData) {
          yield taskRepo2.insert({
            playerId: data.playerId,
            playerName: data.playerName,
            teamName: data.teamName,
            teamId: data.teamId,
            teamAgainstName: data.teamAgainstName,
            teamAgainstId: data.teamAgainstId,
            homeOrAway: data.homeOrAway,
            season: data.season,
            gameId: data.gameId,
            gameDate: data.gameDate,
            playerStarted: data.playerStarted,
            assists: data.assists,
            points: data.points,
            fgm: data.fgm,
            fga: data.fga,
            fgp: data.fgp,
            ftm: data.ftm,
            fta: data.fta,
            ftp: data.ftp,
            tpm: data.tpm,
            tpa: data.tpa,
            tpp: data.tpp,
            offReb: data.offReb,
            defReb: data.defReb,
            totReb: data.totReb,
            pFouls: data.pFouls,
            steals: data.steals,
            turnover: data.turnover,
            blocks: data.blocks
          });
        }
      }
    })();
  }
  static nbaAddPlayerGameStats2023(playerData) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo2 = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNbaGameStats__WEBPACK_IMPORTED_MODULE_3__.DbNbaGameStats);
      console.log("Here in addPlayerGameStats2023");
      var db2023 = yield taskRepo2.find({
        where: {
          playerId: playerData[0].playerId,
          season: 2023
        }
      });
      var newGamesToAdd = playerData;
      var db2023WithoutIdOrCreatedDate = [];
      if (db2023.length > 0) {
        db2023.forEach(data => db2023WithoutIdOrCreatedDate.push({
          playerId: data.playerId,
          playerName: data.playerName,
          teamName: data.teamName,
          teamId: data.teamId,
          teamAgainstName: data.teamAgainstName,
          teamAgainstId: data.teamAgainstId,
          homeOrAway: data.homeOrAway,
          season: data.season,
          gameId: data.gameId,
          gameDate: data.gameDate,
          playerStarted: data.playerStarted,
          assists: data.assists,
          points: data.points,
          fgm: data.fgm,
          fga: data.fga,
          fgp: data.fgp,
          ftm: data.ftm,
          fta: data.fta,
          ftp: data.ftp,
          tpm: data.tpm,
          tpa: data.tpa,
          tpp: data.tpp,
          offReb: data.offReb,
          defReb: data.defReb,
          totReb: data.totReb,
          pFouls: data.pFouls,
          steals: data.steals,
          turnover: data.turnover,
          blocks: data.blocks,
          doubleDouble: data.doubleDouble,
          tripleDouble: data.tripleDouble
        }));
        newGamesToAdd = [];
        //if there is already data in for the player then we need to find the difference between the already stored data and the data coming in and then insert just the difference 
        //instead of deleting everything and reinserting 
        newGamesToAdd = playerData.filter(({
          gameId: game1
        }) => !db2023WithoutIdOrCreatedDate.some(({
          gameId: game2
        }) => game1 === game2));
        console.log(newGamesToAdd.length);
      }
      newGamesToAdd.forEach(e => {
        if (e.playerName.includes("ü")) {
          e.playerName = e.playerName.replaceAll("ü", "u");
        }
        if (e.playerName.includes("é")) {
          e.playerName = e.playerName.replaceAll("é", "e");
        }
        if (e.playerName.includes("è")) {
          e.playerName = e.playerName.replaceAll("è", "e");
        }
      });
      for (const data of newGamesToAdd) {
        yield taskRepo2.insert({
          playerId: data.playerId,
          playerName: data.playerName,
          teamName: data.teamName,
          teamId: data.teamId,
          teamAgainstName: data.teamAgainstName,
          teamAgainstId: data.teamAgainstId,
          homeOrAway: data.homeOrAway,
          season: data.season,
          gameId: data.gameId,
          gameDate: data.gameDate,
          playerStarted: data.playerStarted,
          assists: data.assists,
          points: data.points,
          fgm: data.fgm,
          fga: data.fga,
          fgp: data.fgp,
          ftm: data.ftm,
          fta: data.fta,
          ftp: data.ftp,
          tpm: data.tpm,
          tpa: data.tpa,
          tpp: data.tpp,
          offReb: data.offReb,
          defReb: data.defReb,
          totReb: data.totReb,
          pFouls: data.pFouls,
          steals: data.steals,
          turnover: data.turnover,
          blocks: data.blocks
        });
      }
    })();
  }
  static nbaLoadPlayerStatsInfoFromIdAndSeason(id, season) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNbaGameStats__WEBPACK_IMPORTED_MODULE_3__.DbNbaGameStats);
      return yield taskRepo.find({
        where: {
          playerId: id,
          season: season
        }
      });
    })();
  }
  static nbaLoadPlayerStatsInfoFromNameAndSeason(name, season) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNbaGameStats__WEBPACK_IMPORTED_MODULE_3__.DbNbaGameStats);
      return yield taskRepo.find({
        where: {
          playerName: name,
          season: season
        }
      });
    })();
  }
  static nbaAddPlayerStat2022BlankData(playerId, playerName) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNbaGameStats__WEBPACK_IMPORTED_MODULE_3__.DbNbaGameStats);
      yield taskRepo.insert({
        playerId: playerId,
        playerName: playerName,
        teamName: "",
        teamId: 0,
        season: 2022,
        gameId: 0,
        playerStarted: "N",
        assists: 0,
        points: 0,
        fgm: 0,
        fga: 0,
        fgp: 0,
        ftm: 0,
        fta: 0,
        ftp: 0,
        tpm: 0,
        tpa: 0,
        tpp: 0,
        offReb: 0,
        defReb: 0,
        totReb: 0,
        pFouls: 0,
        steals: 0,
        turnover: 0,
        blocks: 0
      });
    })();
  }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaAddPlayerInfoData", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaLoadPlayerInfoFromId", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaLoadPlayerInfoFromName", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaLoadPlayerInfoFromTeamId", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaLoadAllPlayerInfoFrom", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaAddPlayerGameStats2022", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaAddPlayerGameStats2023", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaLoadPlayerStatsInfoFromIdAndSeason", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaLoadPlayerStatsInfoFromNameAndSeason", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NbaController, "nbaAddPlayerStat2022BlankData", null);

/***/ }),

/***/ 9411:
/*!****************************************************************!*\
  !*** ./src/shared/Controllers/NhlPlayerGameStatsController.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NhlPlayerGameStatsController: () => (/* binding */ NhlPlayerGameStatsController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! remult */ 726);
/* harmony import */ var _dbTasks_DbNhlPlayerGameStats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dbTasks/DbNhlPlayerGameStats */ 797);




class NhlPlayerGameStatsController {
  static nhlAddPlayerINfo2022Data(playerData) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNhlPlayerGameStats__WEBPACK_IMPORTED_MODULE_2__.DbNhlPlayerGameStats);
      for (const data of playerData) {
        yield taskRepo.insert({
          playerId: data.playerId,
          playerName: data.playerName,
          teamName: data.teamName,
          teamId: data.teamId,
          gameDate: data.gameDate,
          playerStarted: data.playerStarted,
          assists: data.assists,
          goals: data.goals,
          pim: data.pim,
          shots: data.shots,
          shotPct: data.shotPct,
          games: data.games,
          hits: data.hits,
          powerPlayGoals: data.powerPlayGoals,
          powerPlayPoints: data.powerPlayPoints,
          plusMinus: data.plusMinus,
          points: data.points,
          gameId: data.gameId,
          teamAgainst: data.teamAgainst,
          teamAgainstId: data.teamAgainstId,
          season: data.season,
          winLossTie: data.winLossTie
        });
      }
    })();
  }
  static nhlAddPlayerINfo2022BlankData(id, name) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNhlPlayerGameStats__WEBPACK_IMPORTED_MODULE_2__.DbNhlPlayerGameStats);
      yield taskRepo.insert({
        playerId: id,
        playerName: name,
        teamName: "asd",
        teamId: 0,
        gameDate: "fasdf",
        playerStarted: "as",
        assists: 0,
        goals: 0,
        pim: 0,
        shots: 0,
        shotPct: 0,
        games: 0,
        hits: 0,
        powerPlayGoals: 0,
        powerPlayPoints: 0,
        plusMinus: 0,
        points: 0,
        gameId: "asd",
        teamAgainst: "asd",
        teamAgainstId: "asd",
        season: "20222023",
        winLossTie: "data.winLossTie"
      });
    })();
  }
  static nhlAddPlayerINfo2023Data(playerData) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNhlPlayerGameStats__WEBPACK_IMPORTED_MODULE_2__.DbNhlPlayerGameStats);
      var db2023 = yield taskRepo.find({
        where: {
          season: playerData[0].season,
          playerId: playerData[0].playerId
        }
      });
      for (var d of db2023) {
        yield taskRepo.delete(d);
      }
      for (const data of playerData) {
        yield taskRepo.insert({
          playerId: data.playerId,
          playerName: data.playerName,
          teamName: data.teamName,
          teamId: data.teamId,
          gameDate: data.gameDate,
          playerStarted: data.playerStarted,
          assists: data.assists,
          goals: data.goals,
          pim: data.pim,
          shots: data.shots,
          shotPct: data.shotPct,
          games: data.games,
          hits: data.hits,
          powerPlayGoals: data.powerPlayGoals,
          powerPlayPoints: data.powerPlayPoints,
          plusMinus: data.plusMinus,
          points: data.points,
          gameId: data.gameId,
          teamAgainst: data.teamAgainst,
          teamAgainstId: data.teamAgainstId,
          season: data.season,
          winLossTie: data.winLossTie
        });
      }
    })();
  }
  static nhlLoadPlayerInfo2022FromId(id) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNhlPlayerGameStats__WEBPACK_IMPORTED_MODULE_2__.DbNhlPlayerGameStats);
      return yield taskRepo.find({
        where: {
          playerId: id,
          season: "20222023"
        }
      });
    })();
  }
  static nhlLoadPlayerInfo2023FromId(id) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNhlPlayerGameStats__WEBPACK_IMPORTED_MODULE_2__.DbNhlPlayerGameStats);
      return yield taskRepo.find({
        where: {
          playerId: id,
          season: "20232024"
        }
      });
    })();
  }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NhlPlayerGameStatsController, "nhlAddPlayerINfo2022Data", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NhlPlayerGameStatsController, "nhlAddPlayerINfo2022BlankData", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NhlPlayerGameStatsController, "nhlAddPlayerINfo2023Data", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NhlPlayerGameStatsController, "nhlLoadPlayerInfo2022FromId", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NhlPlayerGameStatsController, "nhlLoadPlayerInfo2023FromId", null);

/***/ }),

/***/ 8994:
/*!***********************************************************!*\
  !*** ./src/shared/Controllers/NhlPlayerInfoController.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NhlPlayerInfoController: () => (/* binding */ NhlPlayerInfoController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! remult */ 726);
/* harmony import */ var _dbTasks_DbNhlPlayerInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dbTasks/DbNhlPlayerInfo */ 5761);




class NhlPlayerInfoController {
  static nhlAddPlayerINfoData(playerData) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNhlPlayerInfo__WEBPACK_IMPORTED_MODULE_2__.DbNhlPlayerInfo);
      //var d = new Date;
      var dbToDelete = yield taskRepo.find({
        where: {
          playerId: {
            "!=": 0
          }
        }
      });
      if (dbToDelete.length > 0) {
        for (const d of dbToDelete) {
          yield taskRepo.delete(d);
        }
      }
      playerData.forEach(e => {
        if (e.playerName.includes("ü")) {
          e.playerName = e.playerName.replaceAll("ü", "u");
        }
        if (e.playerName.includes("é")) {
          e.playerName = e.playerName.replaceAll("é", "e");
        }
        if (e.playerName.includes("è")) {
          e.playerName = e.playerName.replaceAll("è", "e");
        }
      });
      for (const data of playerData) {
        yield taskRepo.insert({
          playerId: data.playerId,
          playerName: data.playerName,
          teamName: data.teamName,
          teamId: data.teamId
        });
      }
    })();
  }
  static nhlLoadPlayerInfoFromId(id) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNhlPlayerInfo__WEBPACK_IMPORTED_MODULE_2__.DbNhlPlayerInfo);
      return yield taskRepo.find({
        where: {
          playerId: id
        }
      });
    })();
  }
  static nhlLoadPlayerInfoFromName(name) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      console.log("Here in nhl name");
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbNhlPlayerInfo__WEBPACK_IMPORTED_MODULE_2__.DbNhlPlayerInfo);
      return yield taskRepo.find({
        where: {
          playerName: name
        }
      });
    })();
  }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NhlPlayerInfoController, "nhlAddPlayerINfoData", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NhlPlayerInfoController, "nhlLoadPlayerInfoFromId", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], NhlPlayerInfoController, "nhlLoadPlayerInfoFromName", null);

/***/ }),

/***/ 8522:
/*!********************************************************!*\
  !*** ./src/shared/Controllers/PlayerPropController.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlayerPropController: () => (/* binding */ PlayerPropController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! remult */ 726);
/* harmony import */ var _dbTasks_DbPlayerPropData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dbTasks/DbPlayerPropData */ 21);




class PlayerPropController {
  static addPlayerPropData(playerData) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbPlayerPropData__WEBPACK_IMPORTED_MODULE_2__.DbPlayerPropData);
      var d = new Date();
      var dbToDelete = yield taskRepo.find({
        where: {
          sportTitle: playerData[0].sportTitle
        }
      });
      if (dbToDelete.length > 0) {
        for (const d of dbToDelete) {
          yield taskRepo.delete(d);
        }
      }
      for (const data of playerData) {
        yield taskRepo.insert({
          bookId: data.bookId,
          sportKey: data.sportKey,
          sportTitle: data.sportTitle,
          homeTeam: data.homeTeam,
          awayTeam: data.awayTeam,
          commenceTime: data.commenceTime,
          bookMaker: data.bookMaker,
          marketKey: data.marketKey,
          description: data.description,
          playerName: data.playerName,
          price: data.price,
          point: data.point
        });
      }
    })();
  }
  static loadPlayerPropData(sport) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbPlayerPropData__WEBPACK_IMPORTED_MODULE_2__.DbPlayerPropData);
      return yield taskRepo.find({
        where: {
          sportTitle: sport
        }
      });
    })();
  }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], PlayerPropController, "addPlayerPropData", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], PlayerPropController, "loadPlayerPropData", null);

/***/ }),

/***/ 9223:
/*!********************************************************!*\
  !*** ./src/shared/Controllers/SportsBookController.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SportsBookController: () => (/* binding */ SportsBookController)
/* harmony export */ });
/* harmony import */ var C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! remult */ 726);
/* harmony import */ var _dbTasks_DbGameBookData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dbTasks/DbGameBookData */ 9731);




class SportsBookController {
  static addBookData(bookData) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbGameBookData__WEBPACK_IMPORTED_MODULE_2__.DbGameBookData);
      var d = new Date();
      var dbToDelete = yield taskRepo.find({
        where: {
          sportTitle: bookData[0].sportTitle
        }
      });
      if (dbToDelete.length > 0) {
        for (const d of dbToDelete) {
          yield taskRepo.delete(d);
        }
      }
      for (const data of bookData) {
        yield taskRepo.insert({
          bookId: data.bookId,
          sportKey: data.sportKey,
          sportTitle: data.sportTitle,
          homeTeam: data.homeTeam,
          awayTeam: data.awayTeam,
          commenceTime: data.commenceTime,
          bookMaker: data.bookMaker,
          marketKey: data.marketKey,
          teamName: data.teamName,
          price: data.price,
          point: data.point
        });
      }
    })();
  }
  static loadSportBook(sport) {
    return (0,C_GIT_remult_angular_todo_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const taskRepo = remult__WEBPACK_IMPORTED_MODULE_1__.remult.repo(_dbTasks_DbGameBookData__WEBPACK_IMPORTED_MODULE_2__.DbGameBookData);
      return yield taskRepo.find({
        where: {
          sportTitle: sport
        }
      });
    })();
  }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], SportsBookController, "addBookData", null);
(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_1__.BackendMethod)({
  allowed: true
})], SportsBookController, "loadSportBook", null);

/***/ }),

/***/ 9731:
/*!**********************************************!*\
  !*** ./src/shared/dbTasks/DbGameBookData.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DbGameBookData: () => (/* binding */ DbGameBookData)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! remult */ 726);


let DbGameBookData = class DbGameBookData {
  constructor() {
    this.id = '';
    this.bookId = '';
    this.sportKey = "";
    this.sportTitle = '';
    this.homeTeam = "";
    this.awayTeam = "";
    this.commenceTime = "";
    this.bookMaker = '';
    this.marketKey = '';
    this.teamName = '';
    this.price = 0;
    this.point = 0;
  }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.cuid()], DbGameBookData.prototype, "id", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbGameBookData.prototype, "bookId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbGameBookData.prototype, "sportKey", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbGameBookData.prototype, "sportTitle", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbGameBookData.prototype, "homeTeam", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbGameBookData.prototype, "awayTeam", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.date()], DbGameBookData.prototype, "commenceTime", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbGameBookData.prototype, "bookMaker", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbGameBookData.prototype, "marketKey", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbGameBookData.prototype, "teamName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.number()], DbGameBookData.prototype, "price", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.number()], DbGameBookData.prototype, "point", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.createdAt()], DbGameBookData.prototype, "createdAt", void 0);
DbGameBookData = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_0__.Entity)("DbGameBookData", {
  allowApiCrud: true
})], DbGameBookData);

/***/ }),

/***/ 286:
/*!**********************************************!*\
  !*** ./src/shared/dbTasks/DbNbaGameStats.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DbNbaGameStats: () => (/* binding */ DbNbaGameStats)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! remult */ 726);


let DbNbaGameStats = class DbNbaGameStats {
  constructor() {
    this.id = '';
    this.playerId = 0;
    this.playerName = "";
    this.teamName = '';
    this.teamId = 0;
    this.teamAgainstName = '';
    this.teamAgainstId = 0;
    this.homeOrAway = '';
    this.season = 0;
    this.gameId = 0;
    this.gameDate = '';
    this.playerStarted = "";
    this.assists = 0;
    this.points = 0;
    this.fgm = 0;
    this.fga = 0;
    this.fgp = 0;
    this.ftm = 0;
    this.fta = 0;
    this.ftp = 0;
    this.tpm = 0;
    this.tpa = 0;
    this.tpp = 0;
    this.offReb = 0;
    this.defReb = 0;
    this.totReb = 0;
    this.pFouls = 0;
    this.steals = 0;
    this.turnover = 0;
    this.blocks = 0;
    this.doubleDouble = 0;
    this.tripleDouble = 0;
  }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.cuid()], DbNbaGameStats.prototype, "id", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "playerId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNbaGameStats.prototype, "playerName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNbaGameStats.prototype, "teamName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "teamId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNbaGameStats.prototype, "teamAgainstName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "teamAgainstId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNbaGameStats.prototype, "homeOrAway", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "season", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "gameId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNbaGameStats.prototype, "gameDate", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNbaGameStats.prototype, "playerStarted", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "assists", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "points", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "fgm", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "fga", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "fgp", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "ftm", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "fta", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "ftp", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "tpm", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "tpa", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "tpp", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "offReb", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "defReb", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "totReb", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "pFouls", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "steals", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "turnover", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "blocks", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "doubleDouble", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNbaGameStats.prototype, "tripleDouble", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.createdAt()], DbNbaGameStats.prototype, "createdAt", void 0);
DbNbaGameStats = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_0__.Entity)("DbNbaGameStats", {
  allowApiCrud: true
})], DbNbaGameStats);

/***/ }),

/***/ 797:
/*!****************************************************!*\
  !*** ./src/shared/dbTasks/DbNhlPlayerGameStats.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DbNhlPlayerGameStats: () => (/* binding */ DbNhlPlayerGameStats)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! remult */ 726);


let DbNhlPlayerGameStats = class DbNhlPlayerGameStats {
  constructor() {
    this.id = '';
    this.playerId = 0;
    this.playerName = "";
    this.teamName = '';
    this.teamId = 0;
    this.gameDate = '';
    this.playerStarted = "";
    this.assists = 0;
    this.goals = 0;
    this.pim = 0;
    this.shots = 0;
    this.shotPct = 0;
    this.games = 0;
    this.hits = 0;
    this.powerPlayGoals = 0;
    this.powerPlayPoints = 0;
    this.plusMinus = 0;
    this.points = 0;
    this.gameId = "";
    this.teamAgainst = "";
    this.teamAgainstId = '';
    this.season = '';
    this.winLossTie = '';
  }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.cuid()], DbNhlPlayerGameStats.prototype, "id", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "playerId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "playerName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "teamName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "teamId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "gameDate", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "playerStarted", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "assists", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "goals", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "pim", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "shots", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.number()], DbNhlPlayerGameStats.prototype, "shotPct", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "games", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "hits", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "powerPlayGoals", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "powerPlayPoints", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "plusMinus", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerGameStats.prototype, "points", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "gameId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "teamAgainst", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "teamAgainstId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "season", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerGameStats.prototype, "winLossTie", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.createdAt()], DbNhlPlayerGameStats.prototype, "createdAt", void 0);
DbNhlPlayerGameStats = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_0__.Entity)("DbNhlPlayerGameStats", {
  allowApiCrud: true
})], DbNhlPlayerGameStats);

/***/ }),

/***/ 5761:
/*!***********************************************!*\
  !*** ./src/shared/dbTasks/DbNhlPlayerInfo.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DbNhlPlayerInfo: () => (/* binding */ DbNhlPlayerInfo)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! remult */ 726);


let DbNhlPlayerInfo = class DbNhlPlayerInfo {
  constructor() {
    this.playerId = 0;
    this.playerName = "";
    this.teamName = '';
    this.teamId = 0;
  }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerInfo.prototype, "playerId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerInfo.prototype, "playerName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbNhlPlayerInfo.prototype, "teamName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], DbNhlPlayerInfo.prototype, "teamId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.createdAt()], DbNhlPlayerInfo.prototype, "createdAt", void 0);
DbNhlPlayerInfo = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_0__.Entity)("DbNhlPlayerInfo", {
  allowApiCrud: true
})], DbNhlPlayerInfo);

/***/ }),

/***/ 21:
/*!************************************************!*\
  !*** ./src/shared/dbTasks/DbPlayerPropData.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DbPlayerPropData: () => (/* binding */ DbPlayerPropData)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! remult */ 726);


let DbPlayerPropData = class DbPlayerPropData {
  constructor() {
    this.id = '';
    this.bookId = '';
    this.sportKey = "";
    this.sportTitle = '';
    this.homeTeam = "";
    this.awayTeam = "";
    this.commenceTime = "";
    this.bookMaker = '';
    this.marketKey = '';
    this.description = '';
    this.playerName = '';
    this.price = 0;
    this.point = 0;
  }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.cuid()], DbPlayerPropData.prototype, "id", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "bookId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "sportKey", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "sportTitle", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "homeTeam", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "awayTeam", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.date()], DbPlayerPropData.prototype, "commenceTime", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "bookMaker", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "marketKey", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "description", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], DbPlayerPropData.prototype, "playerName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.number()], DbPlayerPropData.prototype, "price", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.number()], DbPlayerPropData.prototype, "point", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.createdAt()], DbPlayerPropData.prototype, "createdAt", void 0);
DbPlayerPropData = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_0__.Entity)("DbPlayerPropData", {
  allowApiCrud: true
})], DbPlayerPropData);

/***/ }),

/***/ 6552:
/*!***********************************************!*\
  !*** ./src/shared/dbTasks/NbaPlayerInfoDb.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NbaPlayerInfoDb: () => (/* binding */ NbaPlayerInfoDb)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! remult */ 726);


let NbaPlayerInfoDb = class NbaPlayerInfoDb {
  constructor() {
    this.playerId = 0;
    this.playerName = "";
    this.teamId = 0;
  }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], NbaPlayerInfoDb.prototype, "playerId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], NbaPlayerInfoDb.prototype, "playerName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], NbaPlayerInfoDb.prototype, "teamId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.createdAt()], NbaPlayerInfoDb.prototype, "createdAt", void 0);
NbaPlayerInfoDb = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_0__.Entity)("NbaPlayerInfoDb", {
  allowApiCrud: true
})], NbaPlayerInfoDb);

/***/ }),

/***/ 9517:
/*!*********************************************!*\
  !*** ./src/shared/dbTasks/PlayerInfoMlb.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlayerInfoMlb: () => (/* binding */ PlayerInfoMlb)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 2321);
/* harmony import */ var remult__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! remult */ 726);


let PlayerInfoMlb = class PlayerInfoMlb {
  constructor() {
    this.playerId = 0;
    this.playerName = "";
    this.teamName = '';
    this.teamId = 0;
  }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], PlayerInfoMlb.prototype, "playerId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], PlayerInfoMlb.prototype, "playerName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.string()], PlayerInfoMlb.prototype, "teamName", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.integer()], PlayerInfoMlb.prototype, "teamId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([remult__WEBPACK_IMPORTED_MODULE_0__.Fields.createdAt()], PlayerInfoMlb.prototype, "createdAt", void 0);
PlayerInfoMlb = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,remult__WEBPACK_IMPORTED_MODULE_0__.Entity)("playerInfoMlb", {
  allowApiCrud: true
})], PlayerInfoMlb);

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4913)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map