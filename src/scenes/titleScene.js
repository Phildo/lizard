var TitleScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var context = canv.context;

  var clicker;
  var hoverer;

  var begin_btn;

  var lazards;
  var thelizard;
  var terrarium;

  self.ready = function()
  {
    clicker = new Clicker({source:stage.dispCanv.canvas});
    hoverer = new Hoverer({source:stage.dispCanv.canvas});

    begin_btn = new ButtonBox(100,canv.height/2,canv.width-200,140,function(){game.setScene(3);});
    clicker.register(begin_btn);

    terrarium = {};
    terrarium.wx = 0.1;
    terrarium.wy = 0.1;
    terrarium.ww = 0.8;
    terrarium.wh = 0.8;
    toScene(terrarium,canv);

    var tlizard;
    lazards = [];
    for(var i = 0; i < 20; i++)
    {
      tlizard = new TitleLizard();
      tlizard.i = i;
      tlizard.ww = 0.1;
      tlizard.wh = 0.1;
      tlizard.wx = randR(terrarium.wx,terrarium.wx+terrarium.ww-tlizard.ww);
      tlizard.wy = randR(terrarium.wy,terrarium.wy+terrarium.wh-tlizard.wh);
      tlizard.to_wx = tlizard.wx;
      tlizard.to_wy = tlizard.wy;
      tlizard.agitation = randIntBelow(500);
      toScene(tlizard,canv);
      lazards[i] = tlizard;
    }

    tlizard = new TitleLizard();
    tlizard.i = i;
    tlizard.ww = 0.6;
    tlizard.wh = 0.4;
    tlizard.wx = 0.2;
    tlizard.wy = 0.2;
    tlizard.to_wx = 0.2;
    tlizard.to_wy = 0.2;
    tlizard.agitation = 0;
    toScene(tlizard,canv);
    tlizard.theta = 0;
    thelizard = tlizard;
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();

    for(var i = 0; i < lazards.length; i++)
      tickTitleLizard(lazards[i]);
    thelizard.agitation = 0;
    thelizard.framefloat += 0.15;
    tickTitleLizard(thelizard);
  };

  var bg_img = new Image();
  bg_img.src = "assets/environmental/rockcactustinfoil2.png";
  self.draw = function()
  {
    context.drawImage(bg_img, 0, 0, canv.width, canv.height);

    for(var i = 0; i < lazards.length; i++)
      drawTitleLizard(lazards[i]);
    drawTitleLizard(thelizard);

    //begin_btn.draw(canv);
    context.font = "180px Arial";
    context.fillStyle = "#000000";
    context.textAlign = "center";
    context.fillText("BEGIN",begin_btn.x+begin_btn.w/2,begin_btn.y+begin_btn.h);
    context.font = "12px Arial";
    context.textAlign = "left";
  };

  self.cleanup = function()
  {
    clicker.detach();
    clicker = undefined;
    hoverer.detach();
    hoverer = undefined;
  };


  var TitleLizard = function()
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

    self.color = randIntBelow(6);

    self.to_wx;
    self.to_wy;
    self.theta = Math.random()*2*Math.PI;

    self.i;

    self.agitation = 0;

    self.framefloat = 0;
    self.frame = 0;
  }
  var tickTitleLizard = function(tliz)
  {
    tliz.agitation++;

    if(tliz.agitation >= 500)
    {
      tliz.agitation = randIntBelow(100);
      tliz.to_wx = randR(terrarium.wx,terrarium.wx+terrarium.ww-tliz.ww);
      tliz.to_wy = randR(terrarium.wy,terrarium.wy+terrarium.wh-tliz.wh);

      tliz.theta = Math.atan2(tliz.to_wy-tliz.wy,tliz.to_wx-tliz.wx);
      while(tliz.theta < 0)         tliz.theta += Math.PI*2;
      while(tliz.theta > Math.PI*2) tliz.theta -= Math.PI*2;
    }

    var newx = lerp(tliz.wx,tliz.to_wx,0.01);
    var newy = lerp(tliz.wy,tliz.to_wy,0.01);
    tliz.framefloat += (Math.abs(newx-tliz.wx)+Math.abs(newy-tliz.wy))*40;
    while(tliz.framefloat > game.frames[tliz.color].length) tliz.framefloat -= game.frames[tliz.color].length;
    tliz.frame = Math.floor(tliz.framefloat)
    tliz.wx = newx;
    tliz.wy = newy;
    toScene(tliz,canv);
  }
  var drawTitleLizard = function(tliz)
  {
    context.save();
    context.translate(tliz.x+tliz.w/2,tliz.y+tliz.h/2);
    if(
      tliz.theta > Math.PI/2 &&
      tliz.theta < 3*Math.PI/2
    )
    {
      context.rotate(tliz.theta+(Math.PI/6)+(Math.PI));
      context.scale(-1,1);
    }
    else
    {
      context.rotate(tliz.theta-(Math.PI/6));
    }
    context.translate(-tliz.w/2,-tliz.h/2);

    context.drawImage(game.frames[tliz.color][tliz.frame],0,0,tliz.w,tliz.h);
    context.restore();
  }



};

