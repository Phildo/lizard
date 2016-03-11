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
  var moneydisp;

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
      select.wh = 0.16;
      select.ww = 0.2;
      select.wx = 0;
      select.wy = 0.1+(select.wh*i);
      toScene(select,canv);
      select.y = Math.round(select.y);
      select.h = Math.round(select.h);
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
    stats.wx = selects[0].ww+0.1;
    stats.wy = selects[selects.length-1].wy+selects[selects.length-1].wh-0.3;
    stats.ww = 1-stats.wx;
    stats.wh = 0.3;
    toScene(stats,canv);

    moneydisp = new MoneyDisp();
    moneydisp.wx = 0;
    moneydisp.wy = 0.02;
    moneydisp.ww = 0.1;
    moneydisp.wh = 0.06;
    toScene(moneydisp,canv);

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

    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillRect(moneydisp.x,moneydisp.y,moneydisp.w,moneydisp.h);
    context.fillStyle = "#FFFFFF";
    context.fillText("$"+game.player.money,moneydisp.x+10,moneydisp.y+20);
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
      var liz = game.player.lizards[select.i];

      if(selected_i == select.i)
      {
        if(select.hovering) context.fillStyle = "rgba(255,255,255,0.9)";
        else                context.fillStyle = "rgba(255,255,255,0.8)";
        context.fillRect(select.x,select.y,select.w,select.h);
        context.fillStyle = "#000000";
        context.fillText(liz.name,select.x+10,select.y+20);

        context.fillStyle = "#000000";
        context.fillText("SPD:",select.x+10,select.y+40);
        for(var i = 0; i < 10; i++)
        {
          if(liz.speed >= i/10) context.fillStyle = "#000000";
          else                  context.fillStyle = "#666666";
          context.fillRect(select.x+52+10*i,select.y+32,8,8);
        }
        context.fillStyle = "#000000";
        context.fillText("END:",select.x+10,select.y+55);
        for(var i = 0; i < 10; i++)
        {
          if(liz.endurance >= i/10) context.fillStyle = "#000000";
          else                      context.fillStyle = "#666666";
          context.fillRect(select.x+52+10*i,select.y+46,8,8);
        }
      }
      else
      {
        if(select.hovering) context.fillStyle = "rgba(0,0,0,0.9)";
        else                context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(select.x,select.y,select.w,select.h);
        context.fillStyle = "#FFFFFF";
        context.fillText(liz.name,select.x+10,select.y+20);

        context.fillStyle = "#FFFFFF";
        context.fillText("SPD:",select.x+10,select.y+40);
        for(var i = 0; i < 10; i++)
        {
          if(liz.speed >= i/10) context.fillStyle = "#FFFFFF";
          else                  context.fillStyle = "#999999";
          context.fillRect(select.x+52+10*i,select.y+32,8,8);
        }
        context.fillStyle = "#FFFFFF";
        context.fillText("END:",select.x+10,select.y+55);
        for(var i = 0; i < 10; i++)
        {
          if(liz.endurance >= i/10) context.fillStyle = "#FFFFFF";
          else                      context.fillStyle = "#999999";
          context.fillRect(select.x+52+10*i,select.y+46,8,8);
        }
      }
    }
    else
    {
      context.fillStyle = "rgba(0,0,0,0.8)";
      context.fillRect(select.x,select.y,select.w,select.h);
      context.fillStyle = "#555555";
      context.fillText("NO LIZARD",select.x+10,select.y+20);
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

    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillRect(stats.x,stats.y,stats.w,stats.h);

    context.fillStyle = "#FFFF00";
    context.fillRect(stats.x+10,stats.y+10,stats.h-20,stats.h-20);
    context.fillStyle = "#FFFFFF";
    context.fillText(liz.name,stats.x+stats.h,stats.y+20);
    context.fillText("SPEED",stats.x+stats.h,stats.y+40);
    for(var i = 0; i < 10; i++)
    {
      if(liz.speed >= i/10) context.fillStyle = "#FFFFFF";
      else                  context.fillStyle = "#999999";
      context.fillRect(stats.x+stats.h+52+10*i,stats.y+32,8,8);
    }
    context.fillStyle = "#FFFFFF";
    context.fillText("ENDUR:",stats.x+stats.h,stats.y+55);
    for(var i = 0; i < 10; i++)
    {
      if(liz.endurance >= i/10) context.fillStyle = "#FFFFFF";
      else                      context.fillStyle = "#999999";
      context.fillRect(stats.x+stats.h+52+10*i,stats.y+46,8,8);
    }
  }

  var MoneyDisp = function()
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
};

