var GamePlayScene = function(game, stage)
{
  var self = this;

  self.clicker;

  self.rock_btn;
  self.race_btn;

  var t;
  self.ready = function()
  {
    self.clicker = new Clicker({source:stage.dispCanv.canvas});

    self.rock_btn = new ButtonBox(10,10,10,10,function(){ game.setScene(3); });
    self.race_btn = new ButtonBox(30,10,10,10,function(){ game.setScene(4); });

    self.clicker.register(self.rock_btn);
    self.clicker.register(self.race_btn);

    t = new Terrarium();
  };

  self.tick = function()
  {
    self.clicker.flush();

  };

  self.draw = function()
  {
    var canv = stage.drawCanv;
    var canvas = canv.canvas;
    var context = canv.context;

    context.fillStyle = "#000000";
    context.fillText("Gameplay",20,50);

    self.rock_btn.draw(canv);
    self.race_btn.draw(canv);

    toScene(t,canv);
    t.draw(context);
  };

  self.cleanup = function()
  {
    self.clicker.detach();
    self.clicker = undefined;
  };


  var list = function()
  {
    var self = this;
  }

  var Terrarium = function()
  {
    var self = this;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0.5;
    self.wy = 0.5;
    self.ww = 0.2;
    self.wh = 0.2;

    self.draw = function(context)
    {
      context.fillStyle = "#FF0000";
      context.fillRect(self.x,self.y,self.w,self.h);
    }
  }

};

