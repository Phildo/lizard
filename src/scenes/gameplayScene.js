var GamePlayScene = function(game, stage)
{
  var self = this;

  self.ready = function()
  {
  };

  self.tick = function()
  {
  };

  self.draw = function()
  {
    var canvas = stage.drawCanv.canvas;
    var context = stage.drawCanv.context;

    context.fillStyle = "#000000";
    context.fillText("Gameplay",20,50);
  };

  self.cleanup = function()
  {
  };

};

