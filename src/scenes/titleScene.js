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

    begin_btn = new ButtonBox(20,canv.height-40,100,20,function(){game.setScene(3);});
    clicker.register(begin_btn);
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();
  };

  var bg_img = new Image();
  bg_img.src = "assets/environmental/rockcactustinfoil2.png";
  var tongue = false;
  var til = 0;
  self.draw = function()
  {
    context.drawImage(bg_img, 0, 0, canv.width, canv.height);

    context.font = "Bold 50px Arial";
    context.fillStyle = "#FFFFFF";
    context.fillText("LIZARDS:",220,20+50);
    context.fillText("MAXIMUM CAPACITY",220,20+50+50);
    //canv.outlineText("LIZARDS:",220,20+50,"#000000","#FFFFFF");
    //canv.outlineText("MAXIMUM CAPACITY",220,20+50+50,"#000000","#FFFFFF");

    //begin_btn.draw(canv);
    context.font = "Bold 30px Arial";
    context.fillStyle = "#FFFFFF";
    context.fillText("BEGIN",begin_btn.x,begin_btn.y+begin_btn.h);
    context.font = "12px Arial";
    context.textAlign = "left";

    til--;
    if(til <= 0)
    {
      tongue = !tongue;
      if(tongue) til = randIntBelow(100);
      else       til = randIntBelow(20);
    }

    var w = 100;
    var h = 40;
    if(tongue) context.drawImage(game.frames[0][1],canv.width/2-w/2,canv.height/2-h/2,w,h);
    else       context.drawImage(game.frames[0][3],canv.width/2-w/2,canv.height/2-h/2,w,h);
  };

  self.cleanup = function()
  {
    clicker.detach();
    clicker = undefined;
    hoverer.detach();
    hoverer = undefined;
  };

};

