"use strict";
var SacrificeScene = function(game, stage)
{
  var self = this;
  var canv = stage.drawCanv;
  var canvas = canv.canvas;
  var context = canv.context;

  var phil_hack_transition_in;

  var clicker;
  var hoverer;

  var pen_btn;

  var sacrifice_btns;

  var terrarium;
  var selects;
  var tlizards;
  var stats;
  var moneydisp;

  var selected_i;

  var MAXIMUM_CAPACITY = 5;

  var bg_img = new Image();
  bg_img.src = "assets/environmental/penforlizard.png";

    var shadow_img = new Image();
  shadow_img.src = "assets/liz/shadow.png";

  var hit_ui;

  var help_text = {
    msg: "SELECT A LIZARD TO OFFER AS TRIBUTE.",
    x:0,y:0,w:0,h:0,
    wx:0, wy: 1, ww:0, wh: 0,
    draw: function(canv) {
      toScene(this, canv);
      this.x += 5;
      this.y -= 15;
      let ctx = canv.context;
      ctx.save();
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(this.msg, this.x, this.y);
      ctx.restore();
    }
  };

  var audiooo;
  var lizard_select_sfx;
  self.ready = function()
  {
    phil_hack_transition_in = 100;

    audiooo = new Aud("assets/sounds/Sacrifice.mp3", true);
    audiooo.play();

    lizard_select_sfx = new Aud("assets/sounds/Sounds/Collect Item.wav", false);

    hit_ui = false;
    clicker = new Clicker({source:stage.dispCanv.canvas});
    hoverer = new Hoverer({source:stage.dispCanv.canvas});

    pen_btn = new ButtonBox(0,0,0,0,function(){ game.setScene(3); });//does this go back to pen?
    pen_btn.wx = 0.8;
    pen_btn.wy = 0.1;
    pen_btn.ww = 0.2;
    pen_btn.wh = 0.1;
    pen_btn.hovering = false;
    pen_btn.hover = function() {
      pen_btn.hovering = true;
    }
    pen_btn.unhover = function() {
      pen_btn.hovering = false;
    }
    toScene(pen_btn,canv);
    clicker.register(pen_btn);
    hoverer.register(pen_btn);

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
      tlizard.ww = 0.1;
      tlizard.wh = 0.1;
      tlizard.wx = randR(terrarium.wx,terrarium.wx+terrarium.ww-tlizard.ww);
      tlizard.wy = randR(terrarium.wy,terrarium.wy+terrarium.wh-tlizard.wh);
      tlizard.to_wx = tlizard.wx;
      tlizard.to_wy = tlizard.wy;
      tlizard.agitation = randIntBelow(500);
      toScene(tlizard,canv);
      tlizards[i] = tlizard;
    }

    stats = new StatsDisp();
    stats.wx = selects[0].ww+0.1;
    stats.wy = selects[selects.length-1].wy+selects[selects.length-1].wh-0.3;
    stats.ww = 1-stats.wx;
    stats.wh = 0.3;
    toScene(stats,canv);

    var sacrificeLiz = function(victim_i, receiver_i)
    {
      var vic = game.player.lizards[victim_i];
      var rec = game.player.lizards[receiver_i];

      var s = vic.speed     - Math.random() - (rec.cannibal*0.1);
      if(s > 0)    rec.speed += s/2;
      if(s < -0.9) rec.speed += s+0.9;

      var e = vic.endurance - Math.random()- (rec.cannibal*0.1);
      if(s > 0)    rec.endurance += s/2;
      if(s < -0.9) rec.endurance += s+0.9;

      rec.cannibal++;
    }

    // Set Up Sacrifice buttons
    sacrifice_btns = [];
    for (let i = 0; i < 4; i ++) {
      let btn = new ButtonBox(0,0,0,0, function() {
        if(selected_i == -1)
          return;
        hit_ui = true;

        let receiver_i;
        if (selected_i <= i) {
          receiver_i = i + 1;
        } else {
          receiver_i = i;
        }

        if (receiver_i >= game.player.lizards.length) {
          game.error_msg = "YOU DON'T OWN A LIZARD IN THAT SLOT."
          setTimeout(function() {
            game.error_msg = "";
          }, 3000);
          return;
        }

        sacrificeLiz(selected_i, receiver_i);

        // Remove sacrificed lizard from list
        game.player.lizards = game.player.lizards.filter(function(liz, index) {
          return index !== selected_i;
        });
        game.setScene(3);
      });
      btn.ww = 0.175;
      btn.wh = 0.1;
      btn.wx = 0.825 - (btn.ww * (3 - i));
      btn.wy = stats.wy - btn.wh;
      toScene(btn, canv);

      btn.hovering = false;
      btn.hover = function() {
        btn.hovering = true;
      };
      btn.unhover = function() {
        btn.hovering = false;
      }

      sacrifice_btns.push({
        btn: btn,
        msg: "OFFER TO "
      });
      clicker.register(btn);
      hoverer.register(btn);
    }

    moneydisp = new MoneyDisp();
    moneydisp.wx = 0;
    moneydisp.wy = 0.02;
    moneydisp.ww = 0.2;
    moneydisp.wh = 0.06;
    toScene(moneydisp,canv);


    selected_i = -1;

    for(var i = 0; i < tlizards.length; i++)
      clicker.register(tlizards[i]);
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();
    hit_ui = false;

    for(var i = 0; i < tlizards.length; i++)
      tickTerrariLizard(tlizards[i]);

    if(phil_hack_transition_in)
      phil_hack_transition_in--;
  };

  self.draw = function()
  {
    context.drawImage(bg_img, 0, 0, canv.width, canv.height);

    // Draw pen button
    if (!pen_btn.hovering) {
      context.fillStyle = "rgba(0,0,0,0.8)";
      context.fillRect(pen_btn.x,pen_btn.y,pen_btn.w,pen_btn.h);
      context.fillStyle = "#FFFFFF";
      context.fillText("BACK TO THA PEN",pen_btn.x+10,pen_btn.y+25);
    } else {
      context.fillStyle = "rgba(255,255,255,0.8)";
      context.fillRect(pen_btn.x,pen_btn.y,pen_btn.w,pen_btn.h);
      context.fillStyle = "#000000";
      context.fillText("BACK TO THA PEN",pen_btn.x+10,pen_btn.y+25);
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
    {
      drawStatsDisp();
      sacrifice_btns.forEach(function(item, index) {
        let receiver_i;
        if (selected_i <= index) {
          receiver_i = index + 1;
        } else {
          receiver_i = index;
        }
        let msg;
        if (receiver_i >= game.player.lizards.length) {
          msg = "NO LIZARD";
        } else {
          msg = item.msg + (receiver_i + 1);
        }
        var btn = item.btn;
        if (btn.hovering) {
          context.fillStyle = "rgba(255,255,255,0.8)";
          context.fillRect(btn.x,btn.y,btn.w,btn.h);
          context.fillStyle = "#000000";
          context.fillText(msg,btn.x+10,btn.y+25);
        } else {
          context.fillStyle = "rgba(0,0,0,0.8)";
          context.fillRect(btn.x,btn.y,btn.w,btn.h);
          context.fillStyle = "#FFFFFF";
          context.fillText(msg,btn.x+10,btn.y+25); 
        }
      });
    }

    // Draw error message
    if (game.error_msg !== "") {
      console.log(game.error_msg);
      var lines = textToLines(canv, "bold 48px Arial", canv.width * 0.60, game.error_msg);
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

    help_text.draw(canv);

    context.fillStyle = "rgba(0,0,0,"+(phil_hack_transition_in/100)+")";
    context.fillRect(0,0,canv.width,canv.height);
  };

  self.cleanup = function()
  {
    audiooo.stop();
    audiooo = undefined;

    lizard_select_sfx.stop();
    lizard_select_sfx = undefined;

    clicker.detach();
    clicker = undefined;
    hoverer.detach();
    hoverer = undefined;
    game.error_msg = "";
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
        else                     {
          lizard_select_sfx.play();
          selected_i = self.i;
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
    if(game.player.lizards.length > select.i)
    {
      var liz = game.player.lizards[select.i];

      if(selected_i == select.i)
      {
        if(select.hovering) context.fillStyle = "rgba(255,255,255,0.9)";
        else                context.fillStyle = "rgba(255,255,255,0.8)";
        context.fillRect(select.x,select.y,select.w,select.h);
        context.fillStyle = "#000000";
        context.fillText((select.i + 1) + ": " + liz.name,select.x+10,select.y+20);

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
      else
      {
        if(select.hovering) context.fillStyle = "rgba(0,0,0,0.9)";
        else                context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(select.x,select.y,select.w,select.h);
        context.fillStyle = "#FFFFFF";
        context.fillText((select.i + 1) + ": " + liz.name,select.x+10,select.y+20);

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
      if (select.i === game.exhausted) {
        context.save();
        context.fillStyle = "red";
        context.font = "bold 24px Arial";
        context.translate(select.x + 2, select.y + 25);
        context.rotate((Math.PI / 180) * 15);
        context.fillText("EXHAUSTED!", 0, 0);
        context.restore();
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
    self.theta = Math.random()*2*Math.PI;

    self.i;

    self.agitation = 0;

    self.framefloat = 0;
    self.frame = 0;

    self.click = function()
    {
      if(hit_ui) return;
      if(game.player.lizards.length > self.i)
      {
        if(selected_i == self.i) selected_i = -1;
        else                     {
              lizard_select_sfx.play();
          selected_i = self.i;
        }
      }
    }
  }
  var tickTerrariLizard = function(tliz)
  {
    if(tliz.i >= game.player.lizards.length) return;
    tliz.agitation++;

    var liz = game.player.lizards[tliz.i];

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
    while(tliz.framefloat > game.frames[liz.color].length) tliz.framefloat -= game.frames[liz.color].length;
    tliz.frame = Math.floor(tliz.framefloat)
    tliz.wx = newx;
    tliz.wy = newy;
    toScene(tliz,canv);
  }
  var drawTerrariLizard = function(tliz)
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

    if (tliz.i == selected_i)
    {
              context.drawImage(shadow_img, 0, 0, tliz.w, tliz.h);
    }

    context.drawImage(game.frames[game.player.lizards[tliz.i].color][tliz.frame],0,0,tliz.w,tliz.h);
    context.restore();

    //context.strokeStyle = "#FF00FF";
    //context.strokeRect(tliz.x,tliz.y,tliz.w,tliz.h);
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
    {
      context.fillText(lines[i],stats.x+stats.h,stats.y+stats.h/2+5+15*i);
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

