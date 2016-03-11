var RaceScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var ctx = canv.context;

  var DELTA = 0.0001;

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
    var contestants = [];

    var fee = rank * 50;
    game.player.money -= fee;

    opponents[rank].forEach(function(lizard, index) {
      contestants.push(new LizRunner(lizard, index));
    });
    contestants.push(new LizRunner(selectedLizard, contestants.length));

    // Set up button to go back to Terrarium
    self.clicker = new Clicker({source:stage.dispCanv.canvas});
    self.back_btn = new ButtonBox(10,10,10,10,function(){ game.setScene(2); });
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

    if (self.track.state === RACE_READY) {
      ctx.fillText("Start Race", self.race_btn.x, self.race_btn.y);
      self.race_btn.draw(canv);
    }

    self.track.draw(ctx);

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
    var left = track.wx;
    var laneW = track.ww;

    liz.wy = top + laneH * liz.lane;
    liz.wh = laneH * 0.9;
    liz.ww = laneW / (track.length);
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

    self.wx = 0.1;
    self.wy = 0.5;
    self.ww = 0.8;
    self.wh = 0.3;

    self.state = RACE_READY;
    self.length = 5 + (rank * 5);

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
