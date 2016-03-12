var TitleScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var context = canv.context;

  var clicker;
  var hoverer;

  var begin_btn;

  self.ready = function()
  {
    clicker = new Clicker({source:stage.dispCanv.canvas});
    hoverer = new Hoverer({source:stage.dispCanv.canvas});

    begin_btn = new ButtonBox(50,canv.height/2,canv.width-100,100,function(){game.setScene(3);});
    clicker.register(begin_btn);
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();
  };

  var bg_img = new Image();
  bg_img.src = "assets/environmental/penforlizard2.png";
  self.draw = function()
  {
    context.drawImage(bg_img, 0, 0, canv.width, canv.height);

    begin_btn.draw(canv);
    context.font = "50px Arial";
    context.fillText("BEGIN",begin_btn.x,begin_btn.y+begin_btn.h);
    context.font = "12px Arial";
  };

  self.cleanup = function()
  {
    clicker.detach();
    clicker = undefined;
    hoverer.detach();
    hoverer = undefined;
  };
};

