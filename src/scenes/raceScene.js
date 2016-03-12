"use strict";
var RaceScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var ctx = canv.context;

  var phil_hack_transition_in;

  var fees = [
    0,
    50,
    200,
    1000
  ];
  var winnings = [
    100,
    600,
    1100,
    420000
  ];

  var track_lengths = [
    5,
    10,
    20,
    30
  ];

  var DELTA = 0.0001;
  self.stats;
  self.moneydisp;

  self.clicker;
  self.hoverer;
  self.back_btn;
  self.race_btn;
  self.track;

  var bg_img = new Image();
  bg_img.src = "assets/environmental/racetrack3.png";

  var shadow_img = new Image();
  shadow_img.src = "assets/liz/shadow.png";

  var audiooo;
  var pre_race_sfx;
  self.ready = function()
  {
    phil_hack_transition_in = 100;

    audiooo = new Aud( "assets/sounds/Race.mp3", true );

    pre_race_sfx = new Aud( "assets/sounds/RacePre.mp3", true );
    pre_race_sfx.play();

    var opponents = [
      [ // RANK_50
        new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.33), randR(0.01, 0.40)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.33), randR(0.01, 0.40)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.33), randR(0.01, 0.40)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.01, 0.33), randR(0.01, 0.40))
      ],
      [ // RANK_100
        new Lizard(LIZARD_GENDER_MALE, randR(0.30, 0.60), randR(0.40, 0.60)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.30, 0.60), randR(0.40, 0.60)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.30, 0.60), randR(0.40, 0.60)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.30, 0.60), randR(0.40, 0.60))
      ],
      [ // RANK_150
        new Lizard(LIZARD_GENDER_MALE, randR(0.50, 0.80), randR(0.40, 0.70)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.50, 0.80), randR(0.40, 0.70)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.50, 0.80), randR(0.40, 0.70)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.50, 0.80), randR(0.40, 0.70))
      ],
      [ // RANK_MASTER
        new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.60, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.60, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.60, 1.0)),
        new Lizard(LIZARD_GENDER_MALE, randR(0.70, 1.0), randR(0.60, 1.0))
      ]
    ];

    var selectedLizard = game.player.lizards[game.racing_lizard_index];
    var rank = game.player.rank;
    // var rank = RANK_CHALLENGER;
    // rank = 6;
    var contestants = [];

    var fee = fees[rank];
    game.player.money -= fee;

    opponents[rank].forEach(function(lizard, index) {
      contestants.push(new LizRunner(lizard, index));
    });
    contestants.push(new LizRunner(selectedLizard, contestants.length));

    self.clicker = new Clicker({source: stage.dispCanv.canvas});
    self.hoverer = new Hoverer({source: stage.dispCanv.canvas});

    // Set up button to go back to Terrarium
    self.back_btn = new ButtonBox(0,0,0,0,function(){ game.setScene(3); });
    self.back_btn.wx = 0.8;
    self.back_btn.wy = 0.1;
    self.back_btn.ww = 0.2;
    self.back_btn.wh = 0.1;
    self.back_btn.hovering = false;
    self.back_btn.hover = function() {
      self.back_btn.hovering = true;
    };
    self.back_btn.unhover = function() {
      self.back_btn.hovering = false;
    };
    toScene(self.back_btn,canv);
    self.clicker.register(self.back_btn);
    self.hoverer.register(self.back_btn)

    // Set up button to start race
    self.race_btn = new ButtonBox(0,0,0,0, function() { 
      if (self.track.state === RACE_READY) {
        self.track.state = RACE_RUNNING;
        pre_race_sfx.stop();
        audiooo.play();
      }
    });
    self.race_btn.wx = 0.8;
    self.race_btn.wy = 0.8;
    self.race_btn.ww = 0.2;
    self.race_btn.wh = 0.1;
    self.race_btn.hovering = false;
    self.race_btn.hover = function() {
      self.race_btn.hovering = true;
    };
    self.race_btn.unhover = function() {
      self.race_btn.hovering = false;
    };
    toScene(self.race_btn, canv);
    self.clicker.register(self.race_btn);
    self.hoverer.register(self.race_btn);

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
    self.moneydisp.ww = 0.2;
    self.moneydisp.wh = 0.06;

    // Initialize the track
    self.track = new Track(contestants, rank);
    self.track.init();
  };

  self.tick = function()
  {
    // Flush clicker queue and call events
    self.clicker.flush();
    self.hoverer.flush();
    
    self.track.update();
    
    if(self.track.state === RACE_FINISH) {
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
    if(phil_hack_transition_in)
      phil_hack_transition_in--;
  };

  self.draw = function()
  {
    ctx.drawImage(bg_img, 0, 0, canv.width, canv.height);

    // Draw button to go back to Terrarium
    if (!self.back_btn.hovering) {
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(self.back_btn.x,self.back_btn.y,self.back_btn.w,self.back_btn.h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("BACK TO THA PEN",self.back_btn.x+10,self.back_btn.y+25);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillRect(self.back_btn.x,self.back_btn.y,self.back_btn.w,self.back_btn.h);
      ctx.fillStyle = "#000000";
      ctx.fillText("BACK TO THA PEN",self.back_btn.x+10,self.back_btn.y+25);
    }

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
      if (!self.race_btn.hovering) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(self.race_btn.x,self.race_btn.y,self.race_btn.w,self.race_btn.h);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("START RACE",self.race_btn.x+10,self.race_btn.y+25);
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillRect(self.race_btn.x,self.race_btn.y,self.race_btn.w,self.race_btn.h);
        ctx.fillStyle = "#000000";
        ctx.fillText("START RACE",self.race_btn.x+10,self.race_btn.y+25);
      }
    }

    if (self.track.state === RACE_DONE) {
      var winner = self.track.runners[self.track.winner];
      var playerLiz = game.player.lizards[game.racing_lizard_index];
      ctx.save();
      ctx.fillStyle = "#000";
      ctx.font = "bold 24px Arial";
      // TODO: Create a win text obj for world positioning.
      var msg;
      if (winner.ref === playerLiz) {
        msg = winner.ref.name + " won! You won $" + self.track.winnings + "!";
        //ctx.fillText(winner.ref.name + " won! You won $" + self.track.winnings + "!", 300, 50);
      } else {
        msg = winner.ref.name + " won! Sorry, better luck next time!";
        //ctx.fillText(winner.ref.name + "Sorry! You lost this race. Better luck next time!", 300, 50);
      }
      msg = msg.toUpperCase();
      ctx.textAlign = "center";

      var lines = textToLines(canv, "bold 24px Arial", canv.width * 0.6, msg);
      lines.forEach(function(line, index) {
        ctx.fillText(line, canv.width * 0.5, (canv.width * 0.1) + (index * 24));
      })
      ctx.restore();
    }

    ctx.fillStyle = "rgba(0,0,0,"+(phil_hack_transition_in/100)+")";
    ctx.fillRect(0,0,canv.width,canv.height);
  };

  self.cleanup = function()
  {
    audiooo.stop();
    audiooo = undefined;

    pre_race_sfx.stop();
    pre_race_sfx = undefined;

    // Cleanup clicker
    self.clicker.detach();
    self.clicker = undefined;
    self.hoverer.detach();
    self.hoverer = undefined;
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
      if (self.ref != game.player.lizards[game.racing_lizard_index])
      {
        trackToWorld(self, track);
        toScene(self, canv);
        ctx.save();
        ctx.translate(self.x + self.w/2, self.y + self.h/2);
        ctx.rotate((Math.PI / 180) * -20);
        ctx.translate(-self.w/2, -self.h/2);
        ctx.drawImage(game.frames[self.ref.color][self.frame], 0, 0, self.w, self.h);
        ctx.restore();
      }

      else if (self.ref === game.player.lizards[game.racing_lizard_index])
      {
        

        trackToWorld(self, track);
        toScene(self, canv);
        ctx.save();
        ctx.translate(self.x + self.w/2, self.y + self.h/2);
        ctx.rotate((Math.PI / 180) * -20);
        ctx.translate(-self.w/2, -self.h/2);
        ctx.drawImage(shadow_img, 0, 0, self.w, self.h);
        ctx.drawImage(game.frames[self.ref.color][self.frame], 0, 0, self.w, self.h);
        ctx.restore();




      }
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
    self.length = track_lengths[rank];

    self.runners = contestants;
    self.winner = null;
    self.winnings = winnings[rank];


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
      if (self.state === RACE_READY) {
        return;
      }

      for (let i = 0, l = self.runners.length; i < l; i++) {
        let liz = self.runners[i];
        if (liz.track_pos >= self.length - 1) {
          if (self.state === RACE_RUNNING) {
            self.state = RACE_FINISH;
            self.winner = i;
          }
        } else {
          tickRunner(liz);
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
