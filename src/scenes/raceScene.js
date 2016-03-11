var RaceScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var ctx = canv.context;

  self.clicker;
  self.back_btn;
  self.track;

  self.ready = function()
  {
    var lizards = [
      new Lizard(),
      new Lizard(),
      new Lizard(),
      new Lizard()
    ];

    var speed = 1;
    lizards.forEach(function(liz, index) {
      liz.speed = speed;
      speed++;
      liz.name = liz.name + speed;
      var gen = Math.floor(Math.random() * 2);
      if (gen === 0) {
        liz.gender = LIZARD_GENDER_MALE;
      } else {
        liz.gender = LIZARD_GENDER_FEMALE;
      }
      liz.trackPos = 0;
      liz.lane = index;
    });
    // Set up button to go back to Terrarium
    self.clicker = new Clicker({source:stage.dispCanv.canvas});
    self.back_btn = new ButtonBox(10,10,10,10,function(){ game.setScene(2); });
    self.clicker.register(self.back_btn);

    self.track = new Track(lizards);
    self.track.init();
  };

  self.tick = function()
  {
    // Flush clicker queue and call events
    self.clicker.flush();

    if (self.track.state === RACE_READY) {
      if (self.track.timeout === null) {
        self.track.timeout = setTimeout(function() {
          self.track.state = RACE_RUNNING;
        }, 1000); 
      }
    } else if(self.track.state === RACE_RUNNING) {
      self.track.update();
    } else if(self.track.state === RACE_FINISH) {

    }
  };

  self.draw = function()
  {
    // Draw button to go back to Terrarium
    ctx.fillStyle = "#000000";
    ctx.fillText("Race Scene",20,50);
    self.back_btn.draw(canv);

    self.track.draw(ctx);

    if (self.track.state === RACE_FINISH) {
      ctx.fillStyle = "#000";
      ctx.fillText(self.track.runners[self.track.winner].name + " won!", 300, 50);
    }
  };

  self.cleanup = function()
  {
    // Cleanup clicker
    self.clicker.detach();
    self.clicker = undefined;
  };

  var RACE_READY     = ENUM; ENUM++;
  var RACE_RUNNING   = ENUM; ENUM++;
  var RACE_FINISH    = ENUM; ENUM++;

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
    self.length = 25;

    self.timeout = null;

    self.runners = contestants;
    self.winner = null;


    self.init = function() {
      self.runners.forEach(function(liz) {
        trackToWorld(liz, self);
      });
    };

    self.draw = function(ctx) {
      toScene(self, canv);
      ctx.fillStyle = "green";
      ctx.fillRect(self.x, self.y, self.w, self.h);

      self.runners.forEach(function(liz) {
        trackToWorld(liz, self);
        toScene(liz, canv);
        ctx.fillStyle = "red";
        // Eventually lizards should have a draw method
        ctx.fillRect(liz.x, liz.y, liz.w, liz.h);
      });
    };

    self.update = function() {
      if (self.state !== RACE_RUNNING) {
        return;
      }

      self.runners.forEach(function(liz, index) {
        liz.trackPos += (liz.speed * 0.01);
        if (liz.trackPos >= self.length) {
          self.state = RACE_FINISH;
          self.winner = index;
        }
      });
    };

    var trackToWorld = function(liz, track) {
      var top = track.wy;
      var bot = top + track.wh;
      var laneH = (bot - top) / track.runners.length;
      var left = track.wx;
      var laneW = track.ww;

      liz.wy = top + laneH * liz.lane;
      liz.wx = left + laneW * (liz.trackPos / track.length);
      console.log(liz.wx);
      liz.wh = laneH * 0.9;
      liz.ww = laneW / track.length;
    };

  };



};

// curr state, next state, calculateState, checkFinish