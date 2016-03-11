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

  var my_stats;
  var caught_stats;

  var ready_btn;
  var keep_btn;
  var release_btn;

  var rock_selected_i;
  var bait_selected_i;
  var liz_selected_i;

  var MAXIMUM_CAPACITY = 5;

  var rock_liz_times = [
    500,
    1000,
    2000,
  ];

  var rock_liz_speed_min = [
    0.1,
    0.3,
    0.5,
  ];
  var rock_liz_speed_max = [
    0.5,
    0.8,
    1.0,
  ];

  var bait_liz_mul = [
    1,
    0.75,
    0.5,
    0.2,
  ];

  var time_til_lizard;
  var catchable_lizard;

  var rock_bg_img = new Image();
  rock_bg_img.src = "assets/environmental/rock.png";
  var rock_tin_bg_img = new Image();
  rock_tin_bg_img.src = "assets/environmental/rocktinfoil.png";
  var rock_cactus_bg_img = new Image();
  rock_cactus_bg_img.src = "assets/environmental/rockcactustinfoil.png";

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
    rock.name = "SIMPLE ROCK";
    rock.price = 0;
    rock.unlocked = true;
    rock.owned = true;
    rock.img = rock_bg_img;
    rock.wx = 0.2;
    rock.wy = 0.5;
    rock.ww = 0.6;
    rock.wh = 0.4;
    toScene(rock,canv);
    rocks.push(rock);

    rock = new Rock();
    rock.name = "TINFOIL";
    rock.price = 500;
    rock.unlocked = true;
    rock.owned = game.player.owns_tinfoil;
    rock.img = rock_tin_bg_img;
    rock.wx = 0.2;
    rock.wy = 0.5;
    rock.ww = 0.6;
    rock.wh = 0.4;
    toScene(rock,canv);
    rocks.push(rock);

    rock = new Rock();
    rock.name = "CACTUS";
    rock.price = 10000;
    rock.unlocked = game.player.owns_tinfoil;
    rock.owned = game.player.owns_cactus;
    rock.img = rock_cactus_bg_img;
    rock.wx = 0.2;
    rock.wy = 0.5;
    rock.ww = 0.6;
    rock.wh = 0.4;
    toScene(rock,canv);
    rocks.push(rock);

    baits = [];
    var bait;

    bait = new Bait();
    bait.name = "NO BAIT";
    bait.price = 100;
    bait.img = BIcon1;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "BAD BAIT";
    bait.price = 200;
    bait.img = BIcon2;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "OK BAIT";
    bait.price = 300;
    bait.img = BIcon3;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "GOOD BAIT";
    bait.price = 500;
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
      select.wh = 0.1;
      select.ww = 0.2;
      select.wx = 0;
      select.wy = 0.1+(select.wh*i);
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
      select.wh = 0.1;
      select.ww = 0.2;
      select.wx = 0;
      select.wy = (rock_selects[0].wh*(rock_selects.length+1))+0.1+(select.wh*i);
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
      select.wh = 0.16;
      select.ww = 0.2;
      select.wx = 0;
      select.wy = 0.1+(select.wh*i);
      toScene(select,canv);
      clicker.register(select);
      hoverer.register(select);
      liz_selects[i] = select;
    }

    ready_btn = new ButtonBox(0,0,0,0,
      function(){
        if(mode != MODE_CHOOSING) return;
        var n = rock_liz_times[rock_selected_i]*bait_liz_mul[bait_selected_i];
        time_til_lizard = Math.floor(n/2+randIntBelow(n/2));
        mode = MODE_HUNTING;
      });
    ready_btn.wx = 0.8;
    ready_btn.wy = 0.8;
    ready_btn.ww = 0.1;
    ready_btn.wh = 0.1;
    toScene(ready_btn,canv);

    keep_btn = new ButtonBox(0,0,0,0,
    function(){
      if(mode != MODE_CAUGHT || (game.player.lizards.length >= MAXIMUM_CAPACITY && liz_selected_i == -1)) return;
      var l = new Lizard();
      l.name = catchable_lizard.name;
      l.speed = catchable_lizard.speed;
      if(game.player.lizards.length < MAXIMUM_CAPACITY)
        game.player.lizards.push(l);
      else
        game.player.lizards[liz_selected_i] = l;
      catchable_lizard = undefined;
      game.setScene(2);
    });
    keep_btn.wx = 0.8;
    keep_btn.wy = 0.6;
    keep_btn.ww = 0.1;
    keep_btn.wh = 0.1;
    toScene(keep_btn,canv);

    release_btn = new ButtonBox(0,0,0,0,function(){ if(mode != MODE_CAUGHT) return; catchable_lizard = undefined; mode = MODE_CHOOSING; });
    release_btn.wx = 0.8;
    release_btn.wy = 0.8;
    release_btn.ww = 0.1;
    release_btn.wh = 0.1;
    toScene(release_btn,canv);

    my_stats = new StatsDisp();
    my_stats.wx = 0.2;
    my_stats.wy = 0.6;
    my_stats.ww = 0.6;
    my_stats.wh = 0.2;
    toScene(my_stats,canv);

    caught_stats = new StatsDisp();
    caught_stats.wx = 0.2;
    caught_stats.wy = 0.2;
    caught_stats.ww = 0.6;
    caught_stats.wh = 0.2;
    toScene(caught_stats,canv);

    clicker.register(ready_btn);
    clicker.register(keep_btn);
    clicker.register(release_btn);
    clicker.register(back_btn);

    rock_selected_i = 0;
    bait_selected_i = 0;
    liz_selected_i  = -1;

    mode = MODE_CHOOSING;
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();

    if(mode == MODE_HUNTING)
    {
      time_til_lizard--;
      if(time_til_lizard <= -200)
      {
        catchable_lizard = undefined;
        var n = rock_liz_times[rock_selected_i]*bait_liz_mul[bait_selected_i];
        time_til_lizard = Math.floor(n/2+randIntBelow(n/2));
      }
      else if(time_til_lizard <= 0)
      {
        if(!catchable_lizard)
        {
          var r = rocks[rock_selected_i];
          catchable_lizard = new RockLizard();
          catchable_lizard.speed = randR(rock_liz_speed_min[rock_selected_i],rock_liz_speed_max[rock_selected_i]);
          catchable_lizard.ww = 0.05;
          catchable_lizard.wh = 0.05;
          var t = Math.random()*Math.PI*2;
          catchable_lizard.wx = (r.wx+r.ww/2)+Math.cos(t)*r.ww - catchable_lizard.ww/2;
          catchable_lizard.wy = (r.wy+r.wh/2)+Math.sin(t)*r.wh - catchable_lizard.wh/2;
          t = (t+Math.PI) % (Math.PI*2);
          catchable_lizard.to_wx = (r.wx+r.ww/2)+Math.cos(t)*r.ww - catchable_lizard.ww/2;
          catchable_lizard.to_wy = (r.wy+r.wh/2)+Math.sin(t)*r.wh - catchable_lizard.wh/2;
          clicker.register(catchable_lizard);
        }

        catchable_lizard.wx = lerp(catchable_lizard.wx,catchable_lizard.to_wx,0.01);
        catchable_lizard.wy = lerp(catchable_lizard.wy,catchable_lizard.to_wy,0.01);
      }
    }
  };

  self.draw = function()
  {
    if(mode == MODE_CHOOSING)
    {
      context.drawImage(rocks[rock_selected_i].img,0,0,canv.width,canv.height);
      //context.drawImage(rocks[rock_selected_i].img,rocks[rock_selected_i].x,rocks[rock_selected_i].y,rocks[rock_selected_i].w,rocks[rock_selected_i].h);
      context.drawImage(baits[bait_selected_i].img,baits[bait_selected_i].x,baits[bait_selected_i].y,baits[bait_selected_i].w,baits[bait_selected_i].h);

      context.fillStyle = "#000000";
      context.fillText("Back",back_btn.x,back_btn.y-10);
      back_btn.draw(canv);

      for(var i = 0; i < rock_selects.length; i++)
        drawSelect(rock_selects[i]);
      for(var i = 0; i < bait_selects.length; i++)
        drawSelect(bait_selects[i]);

      context.fillStyle = "#000000";
      context.fillText("Ready",ready_btn.x,ready_btn.y-10);
      ready_btn.draw(canv);
    }
    else if(mode == MODE_HUNTING)
    {
      context.drawImage(rocks[rock_selected_i].img,0,0,canv.width,canv.height);
      context.drawImage(baits[bait_selected_i].img,baits[bait_selected_i].x,baits[bait_selected_i].y,baits[bait_selected_i].w,baits[bait_selected_i].h);

      context.fillStyle = "#000000";
      context.fillText("Back",back_btn.x,back_btn.y-10);
      back_btn.draw(canv);

      if(catchable_lizard)
      {
        toScene(catchable_lizard,canv);
        context.fillStyle = "#FFFF00";
        context.fillRect(catchable_lizard.x,catchable_lizard.y,catchable_lizard.w,catchable_lizard.h);
      }
    }
    else if(mode == MODE_CAUGHT)
    {
      context.drawImage(rocks[rock_selected_i].img,0,0,canv.width,canv.height);
      context.drawImage(baits[bait_selected_i].img,baits[bait_selected_i].x,baits[bait_selected_i].y,baits[bait_selected_i].w,baits[bait_selected_i].h);

      context.fillStyle = "#000000";
      context.fillText("My Lizards",10,20);
      for(var i = 0; i < liz_selects.length; i++)
        drawSelect(liz_selects[i]);

      if(liz_selected_i != -1)
        drawStatsDisp(my_stats,game.player.lizards[liz_selected_i]);
      if(catchable_lizard) //should always be true?
      {
        drawStatsDisp(caught_stats,catchable_lizard);

        context.fillStyle = "#000000";
        context.fillText("Keep",keep_btn.x,keep_btn.y-10);
        keep_btn.draw(canv);

        context.fillStyle = "#000000";
        context.fillText("Release",release_btn.x,release_btn.y-10);
        release_btn.draw(canv);
      }
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
          case SELECT_ROCK: rock_selected_i = selected_i; if(rock_selected_i == -1) rock_selected_i = 0; break;
          case SELECT_BAIT: bait_selected_i = selected_i; if(bait_selected_i == -1) bait_selected_i = 0; break;
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
      case SELECT_LIZ:  selected_i = liz_selected_i; if(game.player.lizards.length > select.i) title = game.player.lizards[select.i].name; break;
    }

    if(select.type == SELECT_LIZ && game.player.lizards.length <= select.i)
    {
      context.fillStyle = "rgba(0,0,0,0.8)";
      context.fillRect(select.x,select.y,select.w,select.h);
      context.fillStyle = "#555555";
      context.fillText("NO LIZARD",select.x+10,select.y+20);
    }
    else
    {
      if(selected_i == select.i)
      {
        if(select.hovering) context.fillStyle = "rgba(255,255,255,0.9)";
        else                context.fillStyle = "rgba(255,255,255,0.8)";
        context.fillRect(select.x,select.y,select.w,select.h);
        context.fillStyle = "#000000";
        context.fillText(title,select.x+10,select.y+20);

        if(select.type == SELECT_LIZ)
        {
          var liz = game.player.lizards[select.i];

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
        if(select.type == SELECT_ROCK)
        {
          var r = rocks[select.i];
          if(!r.unlocked)
          {
            context.fillStyle = "#666666";
            context.fillText("<LOCKED>",select.x+10,select.y+35);
          }
          else if(!r.owned)
          {
            context.fillStyle = "#000000";
            context.fillText("$"+r.price,select.x+10,select.y+35);
          }
        }
      }
      else
      {
        if(select.hovering) context.fillStyle = "rgba(0,0,0,0.9)";
        else                context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(select.x,select.y,select.w,select.h);
        context.fillStyle = "#FFFFFF";
        context.fillText(title,select.x+10,select.y+20);

        if(select.type == SELECT_LIZ)
        {
          var liz = game.player.lizards[select.i];

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
        if(select.type == SELECT_ROCK)
        {
          var r = rocks[select.i];
          if(!r.unlocked)
          {
            context.fillStyle = "#999999";
            context.fillText("<LOCKED>",select.x+10,select.y+35);
          }
          else if(!r.owned)
          {
            context.fillStyle = "#FFFFFF";
            context.fillText("$"+r.price,select.x+10,select.y+35);
          }
        }
      }
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
  var drawStatsDisp = function(stats,liz)
  {
    context.fillStyle = "rgba(255,255,255,0.5)";
    context.fillRect(stats.x,stats.y,stats.w,stats.h);
    context.strokeStyle = "#000000";
    context.strokeRect(stats.x,stats.y,stats.w,stats.h);

    context.fillStyle = "#FFFF00";
    context.fillRect(stats.x+10,stats.y+10,stats.h-20,stats.h-20);
    context.fillStyle = "#000000";
    context.fillText(liz.name,stats.x+stats.h,stats.y+20);
    context.fillText("Speed",stats.x+stats.h,stats.y+30);
    context.fillStyle = "#FF0000";
    context.fillRect(stats.x+stats.h+10,stats.y+stats.h-25,liz.speed*(stats.w-stats.h-20),10);
  }

  var Rock = function()
  {
    var self = this;
    self.name = "rock";
    self.img;

    self.price = 0;
    self.unlocked = false;
    self.owned = false;

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

  var RockLizard = function()
  {
    var self = this;

    self.name = randName();

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

    self.click = function()
    {
      mode = MODE_CAUGHT;
    }
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
  //BIcon1.context.fillStyle = "#FA6BDD";
  //BIcon1.context.fillRect(0,0,BIcon1.width,BIcon1.height);

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

