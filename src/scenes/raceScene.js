var RaceScene = function(game, stage)
{
  var self = this;

  self.clicker;

  self.back_btn;

  self.ready = function()
  {
    self.clicker = new Clicker({source:stage.dispCanv.canvas});

    self.back_btn = new ButtonBox(10,10,10,10,function(){ game.setScene(2); });
    self.clicker.register(self.back_btn);
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
    context.fillText("Race Scene",20,50);

    self.back_btn.draw(canv);
  };

  self.cleanup = function()
  {
    self.clicker.detach();
    self.clicker = undefined;
  };

};

