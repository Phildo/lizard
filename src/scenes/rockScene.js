var RockScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var context = canv.context;

  var ENUM;
  ENUM = 0;
  var MODE_HUNTING = ENUM; ENUM++;
  var MODE_CAUGHT  = ENUM; ENUM++;

  var clicker;
  var hoverer;

  var back_btn;

  var rock_selects;
  var bait_selects;
  var liz_selects;
  var stats;

  var rock_selected_i;
  var bait_selected_i;
  var liz_selected_i;

  var MAXIMUM_CAPACITY = 5;

  self.ready = function()
  {
    clicker = new Clicker({source:stage.dispCanv.canvas});
    hoverer = new Hoverer({source:stage.dispCanv.canvas});

    back_btn = new ButtonBox(0,0,0,0,function(){ game.setScene(3); });
    back_btn.wx = 0.8;
    back_btn.wy = 0.1;
    back_btn.ww = 0.1;
    back_btn.wh = 0.1;
    toScene(back_btn,canv);

    liz_selects = [];
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
      liz_selects[i] = select;
    }

    stats = new StatsDisp();
    stats.wx = 0.2;
    stats.wy = 0.6;
    stats.ww = 0.6;
    stats.wh = 0.2;
    toScene(stats,canv);

    clicker.register(back_btn);

    rock_selected_i = -1;
    bait_selected_i = -1;
    liz_selected_i  = -1;
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();
  };

  self.draw = function()
  {
    context.fillStyle = "#000000";
    context.fillText("Back",back_btn.x,back_btn.y);
    back_btn.draw(canv);

    drawTerrarium(context);
    context.fillStyle = "#000000";
    context.fillText("My Lizards",10,20);
    for(var i = 0; i < liz_selects.length; i++)
      drawSelect(liz_selects[i]);

    if(liz_selected_i != -1)
      drawStatsDisp();
  };

  self.cleanup = function()
  {
    clicker.detach();
    clicker = undefined;
    hoverer.detach();
    hoverer = undefined;
  };

  ENUM = 0;
  var SELECT_ROCK = ENUM; ENUM++;
  var SELECT_BAIT = ENUM; ENUM++;
  var SELECT_LIZ  = ENUM; ENUM++;
  var Select = function()
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

    self.type; //hack to allow quick reuse
    self.i;

    self.click = function()
    {
      var selected_i;
      switch(self.type)
      {
        case SELECT_ROCK: selected_i = rock_selected_i; break;
        case SELECT_BAIT: selected_i = bait_selected_i; break;
        case SELECT_LIZ:  selected_i = liz_selected_i;  break;
      }

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
    var selected_i;
    switch(self.type)
    {
      case SELECT_ROCK: selected_i = rock_selected_i; break;
      case SELECT_BAIT: selected_i = bait_selected_i; break;
      case SELECT_LIZ:  selected_i = liz_selected_i;  break;
    }

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
    var liz = game.player.lizards[liz_selected_i];

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

