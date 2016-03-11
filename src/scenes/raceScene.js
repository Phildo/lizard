var RaceScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var ctx = canv.context;

  var DELTA = 0.0001;
  self.stats;
  self.moneydisp;

  self.clicker;
  self.back_btn;
  self.race_btn;
  self.again_btn;
  self.track;

  var bg_img = new Image();
  bg_img.src = "assets/environmental/racetrack3.png";

  self.ready = function()
  {
    var selectedLizard = game.player.lizards[game.racing_lizard_index];
    var rank = game.player.rank;
    // var rank = RANK_CHALLENGER;
    // rank = 6;
    var contestants = [];

    var fee = rank * 50;
    game.player.money -= fee;

    opponents[rank].forEach(function(lizard, index) {
      contestants.push(new LizRunner(lizard, index));
    });
    contestants.push(new LizRunner(selectedLizard, contestants.length));

    // Set up button to go back to Terrarium
    self.clicker = new Clicker({source:stage.dispCanv.canvas});
    self.back_btn = new ButtonBox(600,10,10,10,function(){ game.setScene(2); });
    self.clicker.register(self.back_btn);

    // Set up button to start race
    self.race_btn = new ButtonBox(0,0,0,0, function() { 
      if (self.track.state === RACE_READY) {
        self.track.state = RACE_RUNNING;
      }
    });
    self.race_btn.wx = 0.5;
    self.race_btn.wy = 0.2;
    self.race_btn.ww = 0.1;
    self.race_btn.wh = 0.1;
    toScene(self.race_btn, canv);
    self.clicker.register(self.race_btn);

    // set up the race again button
    self.again_btn = new ButtonBox(0,0,0,0, function() { 
      if (self.track.state === RACE_DONE) {
        var fee = game.player.rank * 50;
        if (game.player.money < fee)
          return;
        self.cleanup();
        self.ready();
      }
    });

    self.again_btn.wx = 0.5;
    self.again_btn.wy = 0.2;
    self.again_btn.ww = 0.1;
    self.again_btn.wh = 0.1;
    toScene(self.again_btn, canv);
    self.clicker.register(self.again_btn);

    // Set up the stats
    self.stats = [];

    contestants.forEach(function(lizard, index) {
      var select = new LizSelect();
      select.i = index;
      select.wh = 0.16
      select.ww = 0.2;
      select.wx = 0;
      select.wy = 0.1+(select.wh*index);
      toScene(select, canv);
      select.y = Math.round(select.y);
      select.h = Math.round(select.h);
      self.stats.push(select);
    });
    self.stats[self.stats.length - 1].player = true;

    // Set up money display
    self.moneydisp = new MoneyDisp();
    self.moneydisp.wx = 0;
    self.moneydisp.wy = 0.02;
    self.moneydisp.ww = 0.1;
    self.moneydisp.wh = 0.06;

    // Initialize the track
    self.track = new Track(contestants, rank);
    self.track.init();
  };

  self.tick = function()
  {
    // Flush clicker queue and call events
    self.clicker.flush();

    if (self.track.state === RACE_RUNNING) {
      self.track.update();
    } 
    else if(self.track.state === RACE_FINISH) {
      var winner = self.track.runners[self.track.winner];
      var playerLiz = game.player.lizards[game.racing_lizard_index];
      playerLiz.total_races++;
      game.player.total_races++;

      if (winner.ref === playerLiz) {
        game.player.money += self.track.winnings;
        winner.ref.wins++;
        game.player.wins++;

        // Check for promotion
        
        var newRank = Math.floor(game.player.wins / 5);
        if (newRank > game.player.rank) {
          // PROMOTION!
          game.player.rank = Math.min(newRank, RANK_CHALLENGER);
        }
      }

      self.track.state = RACE_DONE;
    }
  };

  self.draw = function()
  {
    ctx.drawImage(bg_img, 0, 0, canv.width, canv.height);

    // Draw button to go back to Terrarium
    ctx.fillStyle = "#000000";
    self.back_btn.draw(canv);
    self.moneydisp.draw(ctx);
    self.track.draw(ctx);

    if (self.track.state === RACE_READY) {
      ctx.fillText("Start Race", self.race_btn.x, self.race_btn.y);
      self.race_btn.draw(canv);
      self.stats.forEach(function(select) {
        drawSelect(select);
      });
    }

    if (self.track.state === RACE_DONE) {
      var winner = self.track.runners[self.track.winner];
      var playerLiz = game.player.lizards[game.racing_lizard_index];
      ctx.fillStyle = "#000";
      // TODO: Create a win text obj for world positioning.
      if (winner.ref === playerLiz) {
        ctx.fillText(winner.ref.name + " won! You won $" + self.track.winnings + "!", 300, 50);
      } else {
        ctx.fillText("Sorry! You lost this race. Better luck next time!", 300, 50);
      }

      ctx.fillText("Race Again", self.again_btn.x, self.again_btn.y);
      self.again_btn.draw(canv);
    }
  };

  self.cleanup = function()
  {
    // Cleanup clicker
    self.clicker.detach();
    self.clicker = undefined;
  };

  var tickRunner = function(liz) {
    // if (liz.track_pos >= self.track.length - 1)
    //   return;

    liz.energy--;

    if (liz.energy < 0 || (liz.to_pos - liz.track_pos) < DELTA) {
      var end = liz.ref.base_endurance * 100;
      var s = liz.ref.speed * 10;
      liz.energy = randIntBelow(end);
      liz.to_pos = liz.track_pos + (s * liz.energy * 0.01);
    }

    liz.track_pos = lerp(liz.track_pos, liz.to_pos, 0.01);
  };

  var trackToWorld = function(liz, track) {
    var top = track.wy;
    var bot = top + track.wh;
    var laneH = (bot - top) / track.runners.length;
    var left = track.lanes[liz.lane].wx;
    var laneW = track.lanes[liz.lane].ww;

    liz.wy = top + laneH * liz.lane;
    liz.ww = laneW / (track.length);
    liz.wh = liz.ww * 0.5;
    liz.wx = left + laneW * (liz.track_pos / (track.length));
  };

  var RACE_READY     = ENUM; ENUM++;
  var RACE_RUNNING   = ENUM; ENUM++;
  var RACE_FINISH    = ENUM; ENUM++;
  var RACE_DONE      = ENUM; ENUM++;

  var LizRunner = function(liz, lane) {
    var self = this;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0;
    self.wy = 0;
    self.ww = 0;
    self.wh = 0;

    self.ref = liz;

    self.track_pos = 0;
    self.lane = lane;
    self.to_pos;
    self.energy = liz.base_endurance * 100;

    self.draw = function(ctx, track) {
      trackToWorld(self, track);
      toScene(self, canv);
      ctx.fillStyle = "red";
      // Eventually lizards should have a draw method
      ctx.fillRect(self.x, self.y, self.w, self.h);
    }
  }

  var Track = function(contestants, rank) {
    var self = this;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0.15;
    self.wy = 0.34 + (0.01  * rank);
    self.ww = 0.75;
    self.wh = 0.5;

    self.lanes = [
      {
        wx: 0.2,
        ww: 0.60
      },
      {
        wx: 0.185,
        ww: 0.625
      },
      {
        wx: 0.17,
        ww: 0.65
      },
      {
        wx: 0.155,
        ww: 0.675
      },
      {
        wx: 0.14,
        ww: 0.70
      }
    ];

    self.state = RACE_READY;
    self.length = 5 + (rank);

    self.runners = contestants;
    self.winner = null;
    self.winnings = 100 + (100 * rank);


    self.init = function() {
      self.runners.forEach(function(liz) {
        trackToWorld(liz, self);
        var s = liz.ref.speed * 10;
        liz.to_pos = liz.track_pos + (s * liz.energy * 0.01);
      });
    };

    self.draw = function(ctx) {
      toScene(self, canv);
      // ctx.fillStyle = "green";
      // ctx.fillRect(self.x, self.y, self.w, self.h);
      self.runners.forEach(function(liz) {
        liz.draw(ctx, self);
      });
    };

    self.update = function() {
      if (self.state !== RACE_RUNNING) {
        return;
      }

      for (var i = 0, l = self.runners.length; i < l; i++) {
        var liz = self.runners[i];
        tickRunner(liz);
        if (liz.track_pos >= self.length - 1) {
          self.state = RACE_FINISH;
          self.winner = i;
          return;
        }
      }
    };
  };

  var MoneyDisp = function()
  {
    var self = this;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0.;
    self.wy = 0.;
    self.ww = 0.;
    self.wh = 0.;

    self.draw = function(ctx) {
      toScene(self,canv);
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(self.x,self.y,self.w,self.h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("$"+game.player.money,self.x+10,self.y+20);
    }
  };

  var LizSelect = function()
  {
    var self = this;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0.;
    self.wy = 0.;
    self.ww = 0.;
    self.wh = 0.;

    self.i;
  }
  var drawSelect = function(select)
  {
    var runner = self.track.runners[select.i];
    var liz = runner.ref;

    if(select.player)
    {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillRect(select.x,select.y,select.w,select.h);
      ctx.fillStyle = "#000000";
      ctx.fillText(liz.name,select.x+10,select.y+20);

      ctx.fillStyle = "#000000";
      ctx.fillText("SPD:",select.x+10,select.y+40);
      for(var i = 0; i < 10; i++)
      {
        if(liz.speed >= i/10) ctx.fillStyle = "#000000";
        else                  ctx.fillStyle = "#666666";
        ctx.fillRect(select.x+52+10*i,select.y+32,8,8);
      }
      ctx.fillStyle = "#000000";
      ctx.fillText("END:",select.x+10,select.y+55);
      for(var i = 0; i < 10; i++)
      {
        if(liz.endurance >= i/10) ctx.fillStyle = "#000000";
        else                      ctx.fillStyle = "#666666";
        ctx.fillRect(select.x+52+10*i,select.y+46,8,8);
      }
    }
    else
    {
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(select.x,select.y,select.w,select.h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(liz.name,select.x+10,select.y+20);

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("SPD:",select.x+10,select.y+40);
      for(var i = 0; i < 10; i++)
      {
        if(liz.speed >= i/10) ctx.fillStyle = "#FFFFFF";
        else                  ctx.fillStyle = "#999999";
        ctx.fillRect(select.x+52+10*i,select.y+32,8,8);
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("END:",select.x+10,select.y+55);
      for(var i = 0; i < 10; i++)
      {
        if(liz.endurance >= i/10) ctx.fillStyle = "#FFFFFF";
        else                      ctx.fillStyle = "#999999";
        ctx.fillRect(select.x+52+10*i,select.y+46,8,8);
      }
    }
  }

  var opponents = [
    [ // RANK_BRONZE
      new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.30), randR(0.01, 0.30)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.30), randR(0.01, 0.30)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.30), randR(0.01, 0.30)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.30), randR(0.01, 0.30))
    ],
    [ // RANK_SILVER
      new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.40), randR(0.01, 0.40)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.40), randR(0.01, 0.40)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.40), randR(0.01, 0.40)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.40), randR(0.01, 0.40))
    ],
    [ // RANK_GOLD
      new Lizard(LIZARD_GENDER_MALE, randR(0.20, 0.50), randR(0.20, 0.50)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.20, 0.50), randR(0.20, 0.50)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.20, 0.50), randR(0.20, 0.50)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.20, 0.50), randR(0.20, 0.50))
    ],
    [ // RANK_PLATINUM
      new Lizard(LIZARD_GENDER_MALE, randR(0.40, 0.70), randR(0.40, 0.70)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.40, 0.70), randR(0.40, 0.70)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.40, 0.70), randR(0.40, 0.70)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.40, 0.70), randR(0.40, 0.70))
    ],
    [ // RANK_DIAMOND
      new Lizard(LIZARD_GENDER_MALE, randR(0.40, 0.80), randR(0.40, 0.80)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.40, 0.80), randR(0.40, 0.80)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.40, 0.80), randR(0.40, 0.80)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.40, 0.80), randR(0.40, 0.80))
    ],
    [ // RANK_MASTER
      new Lizard(LIZARD_GENDER_MALE, randR(0.60, 0.90), randR(0.60, 0.90)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.60, 0.90), randR(0.60, 0.90)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.60, 0.90), randR(0.60, 0.90)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.60, 0.90), randR(0.60, 0.90))
    ],
    [ // RANK_CHALLENGER
      new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.70, 1.0)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.70, 1.0)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.70, 1.0)),
      new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.70, 1.0))
    ]
  ];
};
