var GamePlayScene = function(game, stage)
{
  var self = this;

  self.clicker;

  self.rock_btn;
  self.race_btn;

  self.ready = function()
  {
    self.clicker = new Clicker({source:stage.dispCanv.canvas});

    self.rock_btn = new ButtonBox(10,10,10,10,function(){ game.setScene(3); });
    self.race_btn = new ButtonBox(30,10,10,10,function(){ game.setScene(4); });

    self.clicker.register(self.rock_btn);
    self.clicker.register(self.race_btn);
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
  };

  self.cleanup = function()
  {
    self.clicker.detach();
    self.clicker = undefined;
  };

};

