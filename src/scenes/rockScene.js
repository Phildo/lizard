var RockScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var context = canv.context;

  var ENUM;

  ENUM = 0;
  var MODE_CHOOSING = ENUM; ENUM++;
  var MODE_HUNTING  = ENUM; ENUM++;
  var MODE_CAUGHT   = ENUM; ENUM++;
  var mode;

  ENUM = 0;
  var SELECT_ROCK = ENUM; ENUM++;
  var SELECT_BAIT = ENUM; ENUM++;
  var SELECT_LIZ  = ENUM; ENUM++;

  var clicker;
  var hoverer;

  var back_btn;

  var rocks;
  var baits;

  var rock_selects;
  var bait_selects;
  var liz_selects;
  var stats;

  var ready_btn;

  var rock_selected_i;
  var bait_selected_i;
  var liz_selected_i;

  var MAXIMUM_CAPACITY = 5;

  self.ready = function()
  {
    clicker = new Clicker({source:stage.dispCanv.canvas});
    hoverer = new Hoverer({source:stage.dispCanv.canvas});

    back_btn = new ButtonBox(0,0,0,0,function(){ if(mode == MODE_CAUGHT) return; game.setScene(2); });
    back_btn.wx = 0.8;
    back_btn.wy = 0.1;
    back_btn.ww = 0.1;
    back_btn.wh = 0.1;
    toScene(back_btn,canv);

    rocks = [];
    var rock;

    rock = new Rock();
    rock.name = "Bad Rock";
    rock.img = RIcon1;
    rock.wx = 0.3;
    rock.wy = 0.3;
    rock.ww = 0.4;
    rock.wh = 0.4;
    toScene(rock,canv);
    rocks.push(rock);

    rock = new Rock();
    rock.name = "OK Rock";
    rock.img = RIcon2;
    rock.wx = 0.3;
    rock.wy = 0.3;
    rock.ww = 0.4;
    rock.wh = 0.4;
    toScene(rock,canv);
    rocks.push(rock);

    rock = new Rock();
    rock.name = "Good Rock";
    rock.img = RIcon3;
    rock.wx = 0.3;
    rock.wy = 0.3;
    rock.ww = 0.4;
    rock.wh = 0.4;
    toScene(rock,canv);
    rocks.push(rock);

    baits = [];
    var bait;

    bait = new Bait();
    bait.name = "No Bait";
    bait.img = BIcon1;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "Bad Bait";
    bait.img = BIcon2;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "OK Bait";
    bait.img = BIcon3;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "Good Bait";
    bait.img = BIcon4;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    rock_selects = [];
    var select;
    for(var i = 0; i < rocks.length; i++)
    {
      select = new Select();
      select.i = i;
      select.type = SELECT_ROCK;
      select.wx = 0;
      select.wy = 0.1+(0.1*i);
      select.ww = 0.2;
      select.wh = 0.1;
      toScene(select,canv);
      clicker.register(select);
      hoverer.register(select);
      rock_selects[i] = select;
    }

    bait_selects = [];
    var select;
    for(var i = 0; i < baits.length; i++)
    {
      select = new Select();
      select.i = i;
      select.type = SELECT_BAIT;
      select.wx = 0;
      select.wy = 0.1+(0.1*i)+(0.1*rock_selects.length)+0.1;
      select.ww = 0.2;
      select.wh = 0.1;
      toScene(select,canv);
      clicker.register(select);
      hoverer.register(select);
      bait_selects[i] = select;
    }

    liz_selects = [];
    var select;
    for(var i = 0; i < MAXIMUM_CAPACITY; i++)
    {
      select = new Select();
      select.i = i;
      select.type = SELECT_LIZ;
      select.wx = 0;
      select.wy = 0.1+(0.1*i);
      select.ww = 0.2;
      select.wh = 0.1;
      toScene(select,canv);
      clicker.register(select);
      hoverer.register(select);
      liz_selects[i] = select;
    }

    ready_btn = new ButtonBox(0,0,0,0,function(){ if(mode != MODE_CHOOSING) return; if(rock_selected_i == -1) { console.log("select rock!"); return; } if(bait_selected_i == -1) { console.log("select bait!"); return; } });
    ready_btn.wx = 0.8;
    ready_btn.wy = 0.8;
    ready_btn.ww = 0.1;
    ready_btn.wh = 0.1;
    toScene(ready_btn,canv);

    stats = new StatsDisp();
    stats.wx = 0.2;
    stats.wy = 0.6;
    stats.ww = 0.6;
    stats.wh = 0.2;
    toScene(stats,canv);

    clicker.register(ready_btn);
    clicker.register(back_btn);

    rock_selected_i = -1;
    bait_selected_i = -1;
    liz_selected_i  = -1;

    mode = MODE_CHOOSING;
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();
  };

  self.draw = function()
  {
    if(mode == MODE_CHOOSING)
    {
      context.fillStyle = "#000000";
      context.fillText("Back",back_btn.x,back_btn.y-10);
      back_btn.draw(canv);

      context.fillStyle = "#000000";
      context.fillText("Rocks",rock_selects[0].x,rock_selects[0].y-10);
      for(var i = 0; i < rock_selects.length; i++)
        drawSelect(rock_selects[i]);
      context.fillStyle = "#000000";
      context.fillText("Bait",bait_selects[0].x,bait_selects[0].y-10);
      for(var i = 0; i < bait_selects.length; i++)
        drawSelect(bait_selects[i]);

      context.fillStyle = "#000000";
      context.fillText("Ready",ready_btn.x,ready_btn.y-10);
      ready_btn.draw(canv);

      if(rock_selected_i != -1)
        context.drawImage(rocks[rock_selected_i].img,rocks[rock_selected_i].x,rocks[rock_selected_i].y,rocks[rock_selected_i].w,rocks[rock_selected_i].h);
      if(bait_selected_i != -1)
        context.drawImage(baits[bait_selected_i].img,baits[bait_selected_i].x,baits[bait_selected_i].y,baits[bait_selected_i].w,baits[bait_selected_i].h);
    }
    else if(mode == MODE_HUNTING)
    {
      context.fillStyle = "#000000";
      context.fillText("Back",back_btn.x,back_btn.y-10);
      back_btn.draw(canv);
    }
    else if(mode == MODE_CAUGHT)
    {
      context.fillStyle = "#000000";
      context.fillText("My Lizards",10,20);
      for(var i = 0; i < liz_selects.length; i++)
        drawSelect(liz_selects[i]);
      if(liz_selected_i != -1)
        drawStatsDisp();
    }
  };

  self.cleanup = function()
  {
    clicker.detach();
    clicker = undefined;
    hoverer.detach();
    hoverer = undefined;
  };

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
      //selective listening
      if(mode == MODE_CHOOSING)
      {
        if(self.type != SELECT_ROCK && self.type != SELECT_BAIT)
          return;
      }
      else if(mode == MODE_HUNTING)
        return;
      else if(mode == MODE_CAUGHT)
      {
        if(self.type != SELECT_LIZ) return;
      }

      var selected_i;
      switch(self.type)
      {
        case SELECT_ROCK: selected_i = rock_selected_i; break;
        case SELECT_BAIT: selected_i = bait_selected_i; break;
        case SELECT_LIZ:  selected_i = liz_selected_i;  break;
      }

      if(self.type == SELECT_LIZ && game.player.lizards.length <= self.i) return;
      {
        if(selected_i == self.i) selected_i = -1;
        else                     selected_i = self.i;

        switch(self.type)
        {
          case SELECT_ROCK: rock_selected_i = selected_i; break;
          case SELECT_BAIT: bait_selected_i = selected_i; break;
          case SELECT_LIZ:  liz_selected_i  = selected_i; break;
        }
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
    var title;

    switch(select.type)
    {
      case SELECT_ROCK: selected_i = rock_selected_i;  title = rocks[select.i].name; break;
      case SELECT_BAIT: selected_i = bait_selected_i;  title = baits[select.i].name; break;
      case SELECT_LIZ:  selected_i = liz_selected_i;   title = game.player.lizards[select.i].name; break;
    }

    if(select.type == SELECT_LIZ && game.player.lizards.length <= select.i)
    {
      context.fillStyle = "#222222";
      context.fillRect(select.x,select.y,select.w,select.h);
      context.fillStyle = "#000000";
      context.fillText("No Lizard",select.x+10,select.y+select.h/2);
    }
    else
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
      context.fillText(title,select.x+10,select.y+select.h/2);
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

  var Rock = function()
  {
    var self = this;
    self.name = "rock";
    self.img;

    self.wx;
    self.wy;
    self.ww;
    self.wh;

    self.x;
    self.y;
    self.w;
    self.h;
  }

  var Bait = function()
  {
    var self = this;
    self.name = "bait";
    self.img;

    self.wx;
    self.wy;
    self.ww;
    self.wh;

    self.x;
    self.y;
    self.w;
    self.h;
  }

  var RIcon1 = GenIcon();
  RIcon1.context.fillStyle = "#FA8B2D";
  RIcon1.context.fillRect(0,0,RIcon1.width,RIcon1.height);

  var RIcon2 = GenIcon();
  RIcon2.context.fillStyle = "#2A7BAD";
  RIcon2.context.fillRect(0,0,RIcon2.width,RIcon2.height);

  var RIcon3 = GenIcon();
  RIcon3.context.fillStyle = "#1A1B9D";
  RIcon3.context.fillRect(0,0,RIcon3.width,RIcon3.height);

  var BIcon1 = GenIcon();
  BIcon1.context.fillStyle = "#FA6BDD";
  BIcon1.context.fillRect(0,0,BIcon1.width,BIcon1.height);

  var BIcon2 = GenIcon();
  BIcon2.context.fillStyle = "#4ADB1D";
  BIcon2.context.fillRect(0,0,BIcon2.width,BIcon2.height);

  var BIcon3 = GenIcon();
  BIcon3.context.fillStyle = "#3A4B1D";
  BIcon3.context.fillRect(0,0,BIcon3.width,BIcon3.height);

  var BIcon4 = GenIcon();
  BIcon4.context.fillStyle = "#8A8B8D";
  BIcon4.context.fillRect(0,0,BIcon4.width,BIcon4.height);
};

