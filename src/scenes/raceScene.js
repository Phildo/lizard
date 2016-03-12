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
  self.track;

  var bg_img = new Image();
  bg_img.src = "assets/environmental/racetrack3.png";

  self.ready = function()
  {
    var opponents = [
      [ // RANK_50
        new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.40), randR(0.01, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.40), randR(0.01, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.40), randR(0.01, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.40), randR(0.01, 1.0))
      ],
      [ // RANK_100
        new Lizard(LIZARD_GENDER_MALE, randR(0.30, 0.60), randR(0.40, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.30, 0.60), randR(0.40, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.30, 0.60), randR(0.40, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.30, 0.60), randR(0.40, 1.0))
      ],
      [ // RANK_150
        new Lizard(LIZARD_GENDER_MALE, randR(0.50, 0.80), randR(0.60, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.50, 0.80), randR(0.60, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.50, 0.80), randR(0.60, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.50, 0.80), randR(0.60, 1.0))
      ],
      [ // RANK_MASTER
        new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.70, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.70, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.70, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.70, 1.0))
      ]
    ];

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
    self.back_btn = new ButtonBox(0,0,0,0,function(){ game.setScene(2); });
    self.back_btn.wx = 0.8;
    self.back_btn.wy = 0.1;
    self.back_btn.ww = 0.2;
    self.back_btn.wh = 0.1;
    toScene(self.back_btn,canv);
    self.clicker.register(self.back_btn);

    // Set up button to start race
    self.race_btn = new ButtonBox(0,0,0,0, function() { 
      if (self.track.state === RACE_READY) {
        self.track.state = RACE_RUNNING;
      }
    });
    self.race_btn.wx = 0.8;
    self.race_btn.wy = 0.8;
    self.race_btn.ww = 0.2;
    self.race_btn.wh = 0.1;
    toScene(self.race_btn, canv);
    self.clicker.register(self.race_btn);

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
      }

      self.track.state = RACE_DONE;
    }
  };

  self.draw = function()
  {
    ctx.drawImage(bg_img, 0, 0, canv.width, canv.height);

    // Draw button to go back to Terrarium

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(self.back_btn.x,self.back_btn.y,self.back_btn.w,self.back_btn.h);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("BACK TO THA PEN",self.back_btn.x+10,self.back_btn.y+25);

    // Draw money display
    self.moneydisp.draw(ctx);

    // Draw the track
    self.track.draw(ctx);

    // Draw the stats on left
    self.stats.forEach(function(select) {
      drawSelect(select);
    });

    if (self.track.state === RACE_READY) {
      // Draw the start race button
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(self.race_btn.x,self.race_btn.y,self.race_btn.w,self.race_btn.h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("START RACE",self.race_btn.x+10,self.race_btn.y+25);
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
    }
  };

  self.cleanup = function()
  {
    // Cleanup clicker
    self.clicker.detach();
    self.clicker = undefined;
    if (self.track.state !== RACE_READY) {
      game.exhausted = game.racing_lizard_index;
    }
  };

  var tickRunner = function(liz) {
    // if (liz.track_pos >= self.track.length - 1)
    //   return;

    liz.energy -= 0.5;

    if (liz.energy < 0 || (liz.to_pos - liz.track_pos) < DELTA) {
      var end = liz.ref.base_endurance * 100;
      var s = liz.ref.speed * 10;
      liz.energy = randIntBelow(end);
      liz.to_pos = liz.track_pos + (s * liz.energy * 0.01);
    }

    var newPos = lerp(liz.track_pos, liz.to_pos, 0.01);
    liz.frameFloat += ((newPos - liz.track_pos) * 20);
    if (liz.frameFloat > game.frames[liz.ref.color].length) {
      liz.frameFloat = liz.frameFloat % game.frames[liz.ref.color].length;
    }

    liz.frame = Math.floor(liz.frameFloat);
    liz.track_pos = newPos;
  };

  var trackToWorld = function(liz, track) {
    var top = track.wy;
    var bot = top + track.wh;
    var laneH = (bot - top) / track.runners.length;
    var left = track.lanes[liz.lane].wx;
    var laneW = track.lanes[liz.lane].ww;

    liz.wy = top + laneH * liz.lane;
    liz.ww = laneW / (track.length);
    liz.wh = liz.ww / 1.56875;
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

    self.frame = 0;
    self.frameFloat = 0;

    self.draw = function(ctx, track) {
      trackToWorld(self, track);
      toScene(self, canv);
      ctx.save();
      ctx.translate(self.x + self.w/2, self.y + self.h/2);
      ctx.rotate((Math.PI / 180) * -20);
      ctx.translate(-self.w/2, -self.h/2);
      ctx.drawImage(game.frames[self.ref.color][self.frame], 0, 0, self.w, self.h);
      ctx.restore();
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
    
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(select.x,select.y,select.w,select.h);
    ctx.fillStyle = "#FFFFFF";
    if (select.player) {
      ctx.fillText("YOU: " + liz.name,select.x+10,select.y+20);
    } else {
      ctx.fillText((select.i + 1) + ": " + liz.name,select.x+10,select.y+20);
    }

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
      if(liz.base_endurance >= i/10)  ctx.fillStyle = "#FFFFFF";
      else                                ctx.fillStyle = "#999999";
      ctx.fillRect(select.x+52+10*i,select.y+46,8,8);

      if((runner.energy * 0.01) >= i/10) {
        ctx.fillStyle = "red";
        ctx.fillRect(select.x+52+10*i,select.y+46,8,8);
      }
    }
    
  }
};
