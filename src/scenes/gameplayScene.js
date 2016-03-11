var GamePlayScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var context = canv.context;

  var clicker;
  var hoverer;

  var rock_btn;
  var race_btn;

  var terrarium;
  var selects;
  var tlizards;
  var stats;

  var selected_i;

  var MAXIMUM_CAPACITY = 5;

  var bg_img = new Image();
  bg_img.src = "assets/penforlizard.png";

  self.ready = function()
  {
    clicker = new Clicker({source:stage.dispCanv.canvas});
    hoverer = new Hoverer({source:stage.dispCanv.canvas});

    rock_btn = new ButtonBox(0,0,0,0,function(){ game.setScene(3); });
    rock_btn.wx = 0.8;
    rock_btn.wy = 0.1;
    rock_btn.ww = 0.1;
    rock_btn.wh = 0.1;
    toScene(rock_btn,canv);

    race_btn = new ButtonBox(0,0,0,0,function(){ if(selected_i == -1) return; game.racing_lizard_index = selected_i; game.setScene(4); });
    race_btn.wx = 0.8;
    race_btn.wy = 0.3;
    race_btn.ww = 0.1;
    race_btn.wh = 0.1;
    toScene(race_btn,canv);

    terrarium = new Terrarium();
    terrarium.wx = 0.25;
    terrarium.wy = 0.2;
    terrarium.ww = 0.45;
    terrarium.wh = 0.5;
    toScene(terrarium,canv);

    selects = [];
    var select;
    for(var i = 0; i < MAXIMUM_CAPACITY; i++)
    {
      select = new LizSelect();
      select.i = i;
      select.wx = 0;
      select.wy = 0.1+(0.1*i);
      select.ww = 0.2;
      select.wh = 0.1;
      toScene(select,canv);
      clicker.register(select);
      hoverer.register(select);
      selects[i] = select;
    }

    tlizards = [];
    var tlizard;
    for(var i = 0; i < MAXIMUM_CAPACITY; i++)
    {
      tlizard = new TerrariLizard();
      tlizard.i = i;
      tlizard.ww = 0.05;
      tlizard.wh = 0.05;
      tlizard.wx = randR(terrarium.wx,terrarium.wx+terrarium.ww-tlizard.ww);
      tlizard.wy = randR(terrarium.wy,terrarium.wy+terrarium.wh-tlizard.wh);
      tlizard.to_wx = tlizard.wx;
      tlizard.to_wy = tlizard.wy;
      tlizard.agitation = randIntBelow(500);
      toScene(tlizard,canv);
      clicker.register(tlizard);
      tlizards[i] = tlizard;
    }

    stats = new StatsDisp();
    stats.wx = 0.2;
    stats.wy = 0.6;
    stats.ww = 0.6;
    stats.wh = 0.2;
    toScene(stats,canv);

    clicker.register(rock_btn);
    clicker.register(race_btn);

    selected_i = -1;
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();

    for(var i = 0; i < tlizards.length; i++)
      tickTerrariLizard(tlizards[i]);
  };

  self.draw = function()
  {
    context.drawImage(bg_img, 0, 0, canv.width, canv.height);

    context.fillStyle = "#000000";
    context.fillText("To Rock",rock_btn.x,rock_btn.y);
    rock_btn.draw(canv);

    if(selected_i != -1)
    {
      context.fillStyle = "#000000";
      context.fillText("To Race",race_btn.x,race_btn.y);
      race_btn.draw(canv);
    }

    //drawTerrarium(context);
    context.fillStyle = "#000000";
    context.fillText("My Lizards",10,20);
    for(var i = 0; i < selects.length; i++)
      drawSelect(selects[i]);

    for(var i = 0; i < game.player.lizards.length; i++)
      drawTerrariLizard(tlizards[i]);

    if(selected_i != -1)
      drawStatsDisp();
  };

  self.cleanup = function()
  {
    clicker.detach();
    clicker = undefined;
    hoverer.detach();
    hoverer = undefined;
  };

  var LizSelect = function()
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

    self.i;

    self.click = function()
    {
      if(game.player.lizards.length > self.i)
      {
        if(selected_i == self.i) selected_i = -1;
        else                     selected_i = self.i;
      }
    }

    self.hovering = false;
    self.hover = function()
    {
      self.hovering = true;
    }
    self.unhover = function()
    {
      self.hovering = false;
    }
  }
  var drawSelect = function(select)
  {
    if(game.player.lizards.length > select.i)
    {
      if(selected_i == select.i)
      {
        if(select.hovering) context.fillStyle = "#AAAAAA"; // selected + hovering
        else                context.fillStyle = "#888888"; // selected +!hovering
      }
      else
      {
        if(select.hovering) context.fillStyle = "#666666"; //!selected + hovering
        else                context.fillStyle = "#444444"; //!selected +!hovering
      }
      context.fillRect(select.x,select.y,select.w,select.h);
      context.fillStyle = "#000000";
      context.fillText(game.player.lizards[select.i].name,select.x+10,select.y+select.h/2);
    }
    else
    {
      context.fillStyle = "#222222";
      context.fillRect(select.x,select.y,select.w,select.h);
      context.fillStyle = "#000000";
      context.fillText("No Lizard",select.x+10,select.y+select.h/2);
    }
  }

  var Terrarium = function()
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
  }
  var drawTerrarium = function()
  {
    context.fillStyle = "#FF0000";
    context.fillRect(terrarium.x,terrarium.y,terrarium.w,terrarium.h);
  }

  var TerrariLizard = function()
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

    self.to_wx;
    self.to_wy;

    self.i;

    self.agitation = 0;

    self.click = function()
    {
      if(game.player.lizards.length > self.i)
      {
        if(selected_i == self.i) selected_i = -1;
        else                     selected_i = self.i;
      }
    }
  }
  var tickTerrariLizard = function(tliz)
  {
    tliz.agitation++;

    if(tliz.agitation >= 500)
    {
      tliz.agitation = randIntBelow(100);
      tliz.to_wx = randR(terrarium.wx,terrarium.wx+terrarium.ww-tliz.ww);
      tliz.to_wy = randR(terrarium.wy,terrarium.wy+terrarium.wh-tliz.wh);
    }

    tliz.wx = lerp(tliz.wx,tliz.to_wx,0.01);
    tliz.wy = lerp(tliz.wy,tliz.to_wy,0.01);
    toScene(tliz,canv);
  }
  var drawTerrariLizard = function(tliz)
  {
    if(selected_i == tliz.i) context.fillStyle = "#FFFFFF";
    else                     context.fillStyle = "#FFFF00";
    context.fillRect(tliz.x,tliz.y,tliz.w,tliz.h);
  }

  var StatsDisp = function()
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
  }
  var drawStatsDisp = function()
  {
    var liz = game.player.lizards[selected_i];

    context.fillStyle = "rgba(255,255,255,0.5)";
    context.fillRect(stats.x,stats.y,stats.w,stats.h);
    context.strokeStyle = "#000000";
    context.strokeRect(stats.x,stats.y,stats.w,stats.h);

    context.fillStyle = "#FFFF00";
    context.fillRect(stats.x+10,stats.y+10,stats.h-20,stats.h-20);
    context.fillStyle = "#000000";
    context.fillText(liz.name,stats.x+stats.h,stats.y+20);
    context.fillText("Speed",stats.x+stats.h,stats.y+30);
  }

};

