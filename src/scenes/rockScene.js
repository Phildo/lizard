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
  var buy_btn;

  var rocks;
  var baits;

  var moneydisp;
  var rock_selects;
  var bait_selects;
  var liz_selects;

  var my_stats_title;
  var my_stats;
  var caught_stats_title;
  var caught_stats;

  var rockdisp;
  var baitdisp;

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
    0.4,
    0.8,
    1.0,
  ];

  var rock_liz_endure_min = [
    0.1,
    0.1,
    0.3,
    0.3,
  ];
  var rock_liz_endure_max = [
    0.5,
    0.5,
    0.8,
    1.0,
  ];

  var bait_liz_mul = [
    1,
    0.5,
    0.25,
    0.1,
  ];

  var time_til_lizard;
  var catchable_lizard;

  var rock_bg_img = new Image();
  rock_bg_img.src = "assets/environmental/rock2.png";
  var rock_tin_bg_img = new Image();
  rock_tin_bg_img.src = "assets/environmental/rocktinfoil2.png";
  var rock_cactus_bg_img = new Image();
  rock_cactus_bg_img.src = "assets/environmental/rockcactustinfoil2.png";

  var rock_poor_b8_img = new Image();
  rock_poor_b8_img.src = "assets/b8/flyb82.png";
    var rock_good_b8_img = new Image();
  rock_good_b8_img.src = "assets/b8/wormb8.png";
    var rock_gr8_b8_img = new Image();
  rock_gr8_b8_img.src = "assets/b8/grasshopperb82.png";

  self.ready = function()
  {
    clicker = new Clicker({source:stage.dispCanv.canvas});
    hoverer = new Hoverer({source:stage.dispCanv.canvas});

    back_btn = new ButtonBox(0,0,0,0,function(){ if(mode == MODE_CAUGHT) return; game.setScene(2); });
    back_btn.wx = 0.8;
    back_btn.wy = 0.1;
    back_btn.ww = 0.2;
    back_btn.wh = 0.1;
    toScene(back_btn,canv);

    rocks = [];
    var rock;

    rock = new Rock();
    rock.name = "SIMPLE ROCK";
    rock.description = "This is a simple rock. It attracts simple lizards. Nothing wrong with simple. Except they're slow. So if you care about racing yeah I guess there's something wrong with simple.";
    rock.tldr = "Attracts Slow Lizards";
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
    rock.description = "Tinfoil makes a simple rock hot. Hot Lizards like Hot Rocks. Hot Lizards go faaaaast. (I mean really there's probably no correlation between lizard speed and temperature, but the idea is this will make you catch faster lizards).";
    rock.tldr = "Attracts Fast Lizards";
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
    rock.description = "Who doesn't appreciate a good cactus. Top Tier Lizards appreciate the heck outa a good cactus. They'll appreciate it so much they might swing by for a look. Then you'll kidnap them. Steal them from their families. Monster.";
    rock.tldr = "Attracts Real Fast Lizards";
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
    bait.description = "No bait, no lizards. Ok a few lizards. But not many.";
    bait.tldr = "Lizards will come slowly.";
    bait.price = 0;
    bait.img = BIcon1;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "FLY";
    bait.description = "I think lizards like to eat flies. Buy this fly and maybe lizards will come more quickly. But I'm no lizard expert. I AM a fly expert though, and as a fly expert, I know one thing for sure: that is one enormous fly.";
    bait.tldr = "Lizards will come less slowly maybe.";
    bait.price = 100;
    bait.img = rock_poor_b8_img;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "WORM";
    bait.description = "If I wasn't sure whether lizards ate flies or not (and I wasn't), I'm doubly unsure about worms. But, in this case, it appears that worms attract lizards. I never claimed they ate the worm, though. But maybe they do?";
    bait.tldr = "Lizards will come more quickly, with greater endurance for some reason. Yeah I know this text is overflowing but there's nothing you can do.";
    bait.price = 200;
    bait.img = rock_good_b8_img;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    bait = new Bait();
    bait.name = "GRASSHOPPER";
    bait.description = "By now it's obvious that I don't understand the diet of lizards. But a grasshopper seems like it might plausably be more delicious than a fly or a worm. I hope my ignorance of lizard diets has at least distracted from the absurd price tags though.";
    bait.tldr = "Lizards come fast, and with profound endurance.";
    bait.price = 500;
    bait.img = rock_gr8_b8_img;
    bait.wx = 0.45;
    bait.wy = 0.45;
    bait.ww = 0.1;
    bait.wh = 0.1;
    toScene(bait,canv);
    baits.push(bait);

    moneydisp = new MoneyDisp();
    moneydisp.wx = 0;
    moneydisp.wy = 0.02;
    moneydisp.ww = 0.1;
    moneydisp.wh = 0.06;
    toScene(moneydisp,canv);

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
        var r = rocks[rock_selected_i];
        if(!r.unlocked || !r.owned) {
          game.error_msg = "YOU DO NOT OWN THIS ROCK ENHANCEMENT. YOU THINK YOU CAN JUST USE THIS? NO, YOU CANNOT.";
          setTimeout(function() {
            game.error_msg = "";
          }, 5000);
          return;
        }
        var b = baits[bait_selected_i];
        if(b.price > game.player.money) {
          game.error_msg = "YOU DO NOT HAVE ENOUGH MONEY FOR THIS BAIT. THIS IS NOT A CHARITY CASE.";
          setTimeout(function() {
            game.error_msg = "";
          }, 5000);
          return;
        }
        game.player.money -= b.price;
        var n = rock_liz_times[rock_selected_i]*bait_liz_mul[bait_selected_i];
        time_til_lizard = Math.floor(n/2+randIntBelow(n/2));
        mode = MODE_HUNTING;
      });
    ready_btn.wx = 0.8;
    ready_btn.wy = 0.8;
    ready_btn.ww = 0.2;
    ready_btn.wh = 0.1;
    toScene(ready_btn,canv);

    my_stats = new StatsDisp();
    my_stats.wx = liz_selects[0].ww+0.1;
    my_stats.wy = liz_selects[liz_selects.length-1].wy+liz_selects[liz_selects.length-1].wh-0.3;
    my_stats.ww = 1-my_stats.wx;
    my_stats.wh = 0.3;
    toScene(my_stats,canv);
    my_stats_title = new Title();
    my_stats_title.wx = my_stats.wx;
    my_stats_title.wy = my_stats.wy-0.05;
    my_stats_title.ww = 0.2;
    my_stats_title.wh = 0.05;
    toScene(my_stats_title,canv);

    caught_stats = new StatsDisp();
    caught_stats.wx = my_stats.wx;
    caught_stats.wy = my_stats.wy-my_stats.wh-0.1;
    caught_stats.ww = my_stats.ww;
    caught_stats.wh = my_stats.wh;
    toScene(caught_stats,canv);
    caught_stats_title = new Title();
    caught_stats_title.wx = caught_stats.wx;
    caught_stats_title.wy = caught_stats.wy-0.05;
    caught_stats_title.ww = 0.2;
    caught_stats_title.wh = 0.05;
    toScene(caught_stats_title,canv);

    keep_btn = new ButtonBox(0,0,0,0,
    function(){
      if(mode != MODE_CAUGHT || (game.player.lizards.length >= MAXIMUM_CAPACITY && liz_selected_i == -1)) return;
      var l = new Lizard();
      l.naturalName = catchable_lizard.naturalName;
      l.name = catchable_lizard.name;
      l.description = catchable_lizard.description;
      l.color = catchable_lizard.color;
      l.speed = catchable_lizard.speed;
      l.base_endurance = catchable_lizard.base_endurance;
      if(game.player.lizards.length < MAXIMUM_CAPACITY)
        game.player.lizards.push(l);
      else
        game.player.lizards[liz_selected_i] = l;
      catchable_lizard = undefined;
      liz_selected_i = -1;
      game.setScene(2);
    });
    keep_btn.wx = caught_stats_title.wx+caught_stats_title.ww+0.05;
    keep_btn.wy = caught_stats_title.wy;
    keep_btn.ww = caught_stats_title.ww;
    keep_btn.wh = caught_stats_title.wh;
    toScene(keep_btn,canv);

    release_btn = new ButtonBox(0,0,0,0,function(){
      if(mode != MODE_CAUGHT) return;
      clicker.unregister(catchable_lizard);
      catchable_lizard = undefined;
      mode = MODE_CHOOSING;
    });
    release_btn.wx = keep_btn.wx+keep_btn.ww+0.05;
    release_btn.wy = keep_btn.wy;
    release_btn.ww = keep_btn.ww;
    release_btn.wh = keep_btn.wh;
    toScene(release_btn,canv);

    rockdisp = new RockDisp();
    rockdisp.wx = rock_selects[0].ww+0.1;
    rockdisp.wy = rock_selects[0].wy;
    rockdisp.ww = 1-rockdisp.wx-0.3;
    rockdisp.wh = rock_selects[rock_selects.length-1].wy+rock_selects[0].wh-rockdisp.wy;
    toScene(rockdisp,canv);

    buy_btn = new ButtonBox(0,0,0,0,
      function(){
        if(mode != MODE_CHOOSING ||
          rocks[rock_selected_i].owned ||
          !rocks[rock_selected_i].unlocked ||
          rocks[rock_selected_i].price > game.player.money)
          return;

        rocks[2].unlocked = true;
        game.player.money -= rocks[rock_selected_i].price;
        rocks[rock_selected_i].owned = true;
        if(rock_selected_i == 1)      game.player.owns_tinfoil = true;
        else if(rock_selected_i == 2) game.player.owns_cactus  = true;
      });
    buy_btn.wx = rockdisp.wx+rockdisp.ww-0.1;
    buy_btn.wy = rockdisp.wy-0.05;
    buy_btn.ww = 0.1;
    buy_btn.wh = 0.05;
    toScene(buy_btn,canv);

    baitdisp = new BaitDisp();
    baitdisp.wx = bait_selects[0].ww+0.1;
    baitdisp.wy = bait_selects[0].wy;
    baitdisp.ww = 1-baitdisp.wx-0.3;
    baitdisp.wh = bait_selects[bait_selects.length-1].wy+bait_selects[0].wh-baitdisp.wy;
    toScene(baitdisp,canv);

    clicker.register(buy_btn);
    clicker.register(ready_btn);
    clicker.register(keep_btn);
    clicker.register(release_btn);
    clicker.register(back_btn);

    back_btn.hovering = false;
    back_btn.hover = function() {
      back_btn.hovering = true;
    };
    back_btn.unhover = function() {
      back_btn.hovering = false;
    };
    ready_btn.hovering = false;
    ready_btn.hover = function() {
      ready_btn.hovering = true;
    };
    ready_btn.unhover = function() {
      ready_btn.hovering = false;
    };


    hoverer.register(back_btn);
    hoverer.register(ready_btn);

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
      if(time_til_lizard <= -100)
      {
        clicker.unregister(catchable_lizard);
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
          catchable_lizard.color = randIntBelow(6);
          catchable_lizard.speed = randR(rock_liz_speed_min[rock_selected_i],rock_liz_speed_max[rock_selected_i]);
          catchable_lizard.base_endurance = randR(rock_liz_endure_min[bait_selected_i],rock_liz_endure_max[bait_selected_i]);
          catchable_lizard.ww = 0.07;
          catchable_lizard.wh = 0.07;
          var t = Math.random()*Math.PI*2;
          catchable_lizard.wx = (r.wx+r.ww/2)+Math.cos(t)*r.ww - catchable_lizard.ww/2;
          catchable_lizard.wy = (r.wy+r.wh/2)+Math.sin(t)*r.wh - catchable_lizard.wh/2;
          t = (t+Math.PI) % (Math.PI*2);
          catchable_lizard.to_wx = (r.wx+r.ww/2)+Math.cos(t)*r.ww - catchable_lizard.ww/2;
          catchable_lizard.to_wy = (r.wy+r.wh/2)+Math.sin(t)*r.wh - catchable_lizard.wh/2;
          catchable_lizard.theta = Math.atan2(catchable_lizard.to_wy-catchable_lizard.wy,catchable_lizard.to_wx-catchable_lizard.wx);
          while(catchable_lizard.theta < 0)         catchable_lizard.theta += Math.PI*2;
          while(catchable_lizard.theta > Math.PI*2) catchable_lizard.theta -= Math.PI*2;
          clicker.register(catchable_lizard);
        }

        tickCatchableLizard();
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

      // Draw back button (repeat down below because in 2 spots)
      if (!back_btn.hovering) {
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(back_btn.x,back_btn.y,back_btn.w,back_btn.h);
        context.fillStyle = "#FFFFFF";
        context.fillText("BACK TO THA PEN",back_btn.x+10,back_btn.y+25);
      } else {
        context.fillStyle = "rgba(255,255,255,0.8)";
        context.fillRect(back_btn.x,back_btn.y,back_btn.w,back_btn.h);
        context.fillStyle = "#000000";
        context.fillText("BACK TO THA PEN",back_btn.x+10,back_btn.y+25);
      }

      context.fillStyle = "rgba(0,0,0,0.8)";
      context.fillRect(moneydisp.x,moneydisp.y,moneydisp.w,moneydisp.h);
      context.fillStyle = "#FFFFFF";
      context.fillText("$"+game.player.money,moneydisp.x+10,moneydisp.y+20);

      

      for(var i = 0; i < rock_selects.length; i++)
        drawSelect(rock_selects[i]);
      for(var i = 0; i < bait_selects.length; i++)
        drawSelect(bait_selects[i]);

      if(
        !rocks[rock_selected_i].owned &&
        rocks[rock_selected_i].unlocked &&
        rocks[rock_selected_i].price <= game.player.money
      )
      {
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(buy_btn.x,buy_btn.y,buy_btn.w,buy_btn.h);
        context.fillStyle = "#FFFFFF";
        context.fillText("BUY",buy_btn.x+10,buy_btn.y+20);
      }

      // Draw ready button
      if (!ready_btn.hovering) {
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(ready_btn.x,ready_btn.y,ready_btn.w,ready_btn.h);
        context.fillStyle = "#FFFFFF";
        context.fillText("CATCH A LIZARD",ready_btn.x+10,ready_btn.y+25);
      } else {
        context.fillStyle = "rgba(255,255,255,0.8)";
        context.fillRect(ready_btn.x,ready_btn.y,ready_btn.w,ready_btn.h);
        context.fillStyle = "#000000";
        context.fillText("CATCH A LIZARD",ready_btn.x+10,ready_btn.y+25);
      }
    }
    else if(mode == MODE_HUNTING)
    {
      context.drawImage(rocks[rock_selected_i].img,0,0,canv.width,canv.height);
      context.drawImage(baits[bait_selected_i].img,baits[bait_selected_i].x,baits[bait_selected_i].y,baits[bait_selected_i].w,baits[bait_selected_i].h);

      context.fillStyle = "rgba(0,0,0,0.8)";
      context.fillRect(back_btn.x,back_btn.y,back_btn.w,back_btn.h);
      context.fillStyle = "#FFFFFF";
      context.fillText("BACK TO THA PEN",back_btn.x+10,back_btn.y+25);

      if(catchable_lizard)
      {
        drawCatchableLizard();
        context.fillStyle = "#000000";
        context.save();
        context.font = "bold 24px Arial";
        context.fillText("OMG THERE HE GOES GET EM",canv.width/2-50,canv.height/2-50);
        context.restore();
        context.font = "12px Arial";
      }
      else
      {
        context.fillStyle = "#000000";
        context.save();
        context.font = "bold 24px Arial";
        context.fillText("Shhhhh wait for the lizard...",canv.width/2-50,canv.height/2-50);
        context.restore();
        context.font = "12px Arial";
      }
    }
    else if(mode == MODE_CAUGHT)
    {
      context.drawImage(rocks[rock_selected_i].img,0,0,canv.width,canv.height);
      context.drawImage(baits[bait_selected_i].img,baits[bait_selected_i].x,baits[bait_selected_i].y,baits[bait_selected_i].w,baits[bait_selected_i].h);

      for(var i = 0; i < liz_selects.length; i++)
        drawSelect(liz_selects[i]);

      if(liz_selected_i != -1)
      {
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(my_stats_title.x,my_stats_title.y,my_stats_title.w,my_stats_title.h);
        context.fillStyle = "#FFFFFF";
        context.fillText("MY LIZARD",my_stats_title.x+10,my_stats_title.y+20);
        drawStatsDisp(my_stats,game.player.lizards[liz_selected_i]);
      }
      else
      {
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(my_stats_title.x,my_stats_title.y,my_stats_title.w,my_stats_title.h);
        context.fillStyle = "#FFFFFF";
        context.fillText("MY LIZARD",my_stats_title.x+10,my_stats_title.y+20);
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(my_stats.x,my_stats.y,my_stats.w,my_stats.h);
        context.fillStyle = "#999999";
        context.fillText("(NO LIZARD SELECTED)",my_stats.x+10,my_stats.y+20);

      }
      if(catchable_lizard) //should always be true?
      {
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(caught_stats_title.x,caught_stats_title.y,caught_stats_title.w,caught_stats_title.h);
        context.fillStyle = "#FFFFFF";
        context.fillText("CAUGHT LIZARD",caught_stats_title.x+10,caught_stats_title.y+20);
        drawStatsDisp(caught_stats,catchable_lizard);

        if(game.player.lizards.length < MAXIMUM_CAPACITY || liz_selected_i != -1)
        {
          context.fillStyle = "rgba(0,0,0,0.8)";
          context.fillRect(keep_btn.x,keep_btn.y,keep_btn.w,keep_btn.h);
          context.fillStyle = "#FFFFFF";
          if(game.player.lizards.length < MAXIMUM_CAPACITY)
            context.fillText("KEEP",keep_btn.x+10,keep_btn.y+20);
          else
            context.fillText("SWAP",keep_btn.x+10,keep_btn.y+20);
        }

        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(release_btn.x,release_btn.y,release_btn.w,release_btn.h);
        context.fillStyle = "#FFFFFF";
        context.fillText("RELEASE",release_btn.x+10,release_btn.y+25);
      }
    }
    // Draw error message
    if (game.error_msg !== "") {
      console.log(game.error_msg);
      var lines = textToLines(canv, "bold 48px Arial", canv.width * 0.75, game.error_msg);
      context.save();
      context.fillStyle = "#ffffff";
      context.font = "bold 48px Arial";
      context.textAlign = "center";
      var text_pos = {
        ww: 0,
        wh: 0,
        wx: 0.5,
        wy: 0.1,
        x: 0,
        y: 0,
        h: 0,
        w: 0
      };
      toScene(text_pos, canv);
      for (var i = 0, l = lines.length; i < l; i++) {
        context.fillText(lines[i], text_pos.x, text_pos.y + (i * 48)); 
      }
      context.restore();     
    }
    
  };

  self.cleanup = function()
  {
    clicker.detach();
    clicker = undefined;
    hoverer.detach();
    hoverer = undefined;
    game.error_msg = "";
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
            if(liz.base_endurance >= i/10) context.fillStyle = "#000000";
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
        if(select.type == SELECT_BAIT)
        {
          var b = baits[select.i];
          context.fillStyle = "#000000";
          context.fillText("$"+b.price,select.x+10,select.y+35);
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
            if(liz.base_endurance >= i/10) context.fillStyle = "#FFFFFF";
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
        if(select.type == SELECT_BAIT)
        {
          var b = baits[select.i];
          context.fillStyle = "#FFFFFF";
          context.fillText("$"+b.price,select.x+10,select.y+35);
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
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillRect(stats.x,stats.y,stats.w,stats.h);

    context.drawImage(game.frames[liz.color][0],stats.x+10,stats.y+10,stats.h-20,stats.h-20);
    context.fillStyle = "#FFFFFF";
    context.fillText(liz.name,stats.x+stats.h,stats.y+20);
    context.fillText("SPEED:",stats.x+stats.h,stats.y+40);
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
      if(liz.base_endurance >= i/10) context.fillStyle = "#FFFFFF";
      else                      context.fillStyle = "#999999";
      context.fillRect(stats.x+stats.h+52+10*i,stats.y+46,8,8);
    }

    context.fillStyle = "#999999";
    var lines = textToLines(canv, "12px Arial", stats.w-stats.h-10, liz.description)
    for(var i = 0; i < lines.length; i++)
      context.fillText(lines[i],stats.x+stats.h,stats.y+stats.h/2+5+15*i);
  }





  var Rock = function()
  {
    var self = this;
    self.name = "rock";
    self.description = "a rock";
    self.tldr = "a rock";
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
    self.description = "some bait";
    self.tldr = "some bait";
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

    self.naturalName = randName();
    self.name = self.naturalName.toUpperCase();
    self.description = randDescription().replace("NAME",self.naturalName).replace("NAME",self.naturalName).replace("NAME",self.naturalName).replace("NAME",self.naturalName).replace("NAME",self.naturalName).replace("NAME",self.naturalName).replace("NAME",self.naturalName);

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
    self.theta = Math.random()*2*Math.PI;

    self.framefloat = 0;
    self.frame = 0;

    self.click = function()
    {
      mode = MODE_CAUGHT;
    }
  }
  var tickCatchableLizard = function()
  {
    catchable_lizard.wx = lerp(catchable_lizard.wx,catchable_lizard.to_wx,0.01);
    catchable_lizard.wy = lerp(catchable_lizard.wy,catchable_lizard.to_wy,0.01);

    var newx = lerp(catchable_lizard.wx,catchable_lizard.to_wx,0.01);
    var newy = lerp(catchable_lizard.wy,catchable_lizard.to_wy,0.01);
    catchable_lizard.framefloat += (Math.abs(newx-catchable_lizard.wx)+Math.abs(newy-catchable_lizard.wy))*40;
    while(catchable_lizard.framefloat > game.frames[catchable_lizard.color].length) catchable_lizard.framefloat -= game.frames[catchable_lizard.color].length;
    catchable_lizard.frame = Math.floor(catchable_lizard.framefloat)
    catchable_lizard.wx = newx;
    catchable_lizard.wy = newy;
  }
  var drawCatchableLizard = function()
  {
    toScene(catchable_lizard,canv);
    context.save();
    context.translate(catchable_lizard.x+catchable_lizard.w/2,catchable_lizard.y+catchable_lizard.h/2);
    if(
      catchable_lizard.theta > Math.PI/2 &&
      catchable_lizard.theta < 3*Math.PI/2
    )
    {
      context.rotate(catchable_lizard.theta+(Math.PI/6)+(Math.PI));
      context.scale(-1,1);
    }
    else
      context.rotate(catchable_lizard.theta-(Math.PI/6));
    context.translate(-catchable_lizard.w/2,-catchable_lizard.h/2);
    context.drawImage(game.frames[catchable_lizard.color][catchable_lizard.frame],0,0,catchable_lizard.w,catchable_lizard.h);
    context.restore();

    //context.strokeStyle = "#FF00FF";
    //context.strokeRect(catchable_lizard.x,catchable_lizard.y,catchable_lizard.w,catchable_lizard.h);
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

  var RockDisp = function()
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
  var drawRockDisp = function()
  {
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillRect(rockdisp.x,rockdisp.y,rockdisp.w,rockdisp.h);
    context.fillStyle = "#FFFFFF";

    context.fillText(rocks[rock_selected_i].name,rockdisp.x+10,rockdisp.y+20);

    context.fillStyle = "#999999";
    var lines = textToLines(canv, "12px Arial", rockdisp.w-20, rocks[rock_selected_i].description)
    for(var i = 0; i < lines.length; i++)
      context.fillText(lines[i],rockdisp.x+10,rockdisp.y+40+15*i);

    context.fillStyle = "#FFFFFF";
    context.fillText(rocks[rock_selected_i].tldr,rockdisp.x+10,rockdisp.y+rockdisp.h-10);
  }

  var BaitDisp = function()
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
  var drawBaitDisp = function()
  {
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillRect(baitdisp.x,baitdisp.y,baitdisp.w,baitdisp.h);
    context.fillStyle = "#FFFFFF";

    context.fillText(baits[bait_selected_i].name,baitdisp.x+10,baitdisp.y+20);

    context.fillStyle = "#999999";
    var lines = textToLines(canv, "12px Arial", baitdisp.w-20, baits[bait_selected_i].description)
    for(var i = 0; i < lines.length; i++)
      context.fillText(lines[i],baitdisp.x+10,baitdisp.y+40+15*i);

    context.fillStyle = "#FFFFFF";
    context.fillText(baits[bait_selected_i].tldr,baitdisp.x+10,baitdisp.y+baitdisp.h-10);
  }

  var Title = function()
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

};

