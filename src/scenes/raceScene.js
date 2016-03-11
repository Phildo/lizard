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
  self.track;

  self.ready = function()
  {
    // Nasty temp code to initialize some fake components
    // TODO: Make a better way to do this
    var lizards = [
      new LizRunner(new Lizard()),
      new LizRunner(new Lizard()),
      new LizRunner(new Lizard()),
      new LizRunner(new Lizard())
    ];
    lizards.forEach(function(liz, index) {
      liz.ref.speed = randIntBelow(6) + 1;
      liz.ref.name = liz.name + index;
      var gen = Math.floor(Math.random() * 2);
      if (gen === 0) {
        liz.ref.gender = LIZARD_GENDER_MALE;
      } else {
        liz.ref.gender = LIZARD_GENDER_FEMALE;
      }
      liz.lane = index;
    });

    // Add the player's selected lizard to the list of contestants
    var playerLiz = game.player.lizards[game.racing_lizard_index];
    var pLiz = new LizRunner(playerLiz);
    pLiz.lane = lizards.length;
    lizards.push(pLiz);

    // Set up button to go back to Terrarium
    self.clicker = new Clicker({source:stage.dispCanv.canvas});
    self.back_btn = new ButtonBox(10,10,10,10,function(){ game.setScene(2); });
    self.clicker.register(self.back_btn);

    // Set up button to start race
    self.race_btn = new ButtonBox(0,0,0,0, function() { self.track.state = RACE_RUNNING; });
    self.race_btn.wx = 0.5;
    self.race_btn.wy = 0.2;
    self.race_btn.ww = 0.1;
    self.race_btn.wh = 0.1;
    toScene(self.race_btn, canv);
    self.clicker.register(self.race_btn);

    // Initialize the track
    self.track = new Track(lizards);
    self.track.init();
  };

  self.tick = function()
  {
    // Flush clicker queue and call events
    self.clicker.flush();

    if(self.track.state === RACE_RUNNING) {
      self.track.update();
    } else if(self.track.state === RACE_FINISH) {
      var winner = self.track.runners[self.track.winner];
      var playerLiz = game.player.lizards[game.racing_lizard_index];
      if (winner.ref === playerLiz) {
        game.player.money += 100;
        winner.ref.wins++;
      }

      self.track.state = RACE_DONE;
    }
  };

  self.draw = function()
  {
    // Draw button to go back to Terrarium
    ctx.fillStyle = "#000000";
    ctx.fillText("Race Scene",20,50);
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
        ctx.fillText(winner.ref.name + " won! You now have $" + game.player.money + "!", 300, 50);
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
    game.racing_lizard_index = -1;
  };

  var tickRunner = function(liz) {
    liz.energy--;

    if (liz.energy < 0 || (liz.to_pos - liz.track_pos) < DELTA) {
      liz.energy = randIntBelow(liz.ref.base_endurance);
      liz.to_pos = liz.track_pos + (liz.ref.speed * liz.energy * 0.01);
    }

    liz.track_pos = lerp(liz.track_pos, liz.to_pos, 0.01);
    console.log(liz.track_pos);
  };

  var trackToWorld = function(liz, track) {
    var top = track.wy;
    var bot = top + track.wh;
    var laneH = (bot - top) / track.runners.length;
    var left = track.wx;
    var laneW = track.ww;

    liz.wy = top + laneH * liz.lane;
    liz.wx = left + laneW * (liz.track_pos / track.length);
    liz.wh = laneH * 0.9;
    liz.ww = laneW / track.length;
  };

  var RACE_READY     = ENUM; ENUM++;
  var RACE_RUNNING   = ENUM; ENUM++;
  var RACE_FINISH    = ENUM; ENUM++;
  var RACE_DONE      = ENUM; ENUM++;

  var LizRunner = function(liz) {
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
    self.lane;
    self.to_pos;
    self.energy = liz.base_endurance;

    self.draw = function(ctx, track) {
      trackToWorld(self, track);
      toScene(self, canv);
      ctx.fillStyle = "red";
      // Eventually lizards should have a draw method
      ctx.fillRect(self.x, self.y, self.w, self.h);
    }
  }

  var Track = function(contestants) {
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
    self.length = 20;

    self.runners = contestants;
    self.winner = null;


    self.init = function() {
      self.runners.forEach(function(liz) {
        trackToWorld(liz, self);
        liz.to_pos = liz.track_pos + (liz.ref.speed * liz.energy * 0.01);
      });
    };

    self.draw = function(ctx) {
      toScene(self, canv);
      ctx.fillStyle = "green";
      ctx.fillRect(self.x, self.y, self.w, self.h);

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
        if (liz.track_pos >= self.length) {
          self.state = RACE_FINISH;
          self.winner = i;
          return;
        }
      }
    };
  };



};