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
  var selected_i;

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

    race_btn = new ButtonBox(0,0,0,0,function(){ game.setScene(4); });
    race_btn.wx = 0.8;
    race_btn.wy = 0.3;
    race_btn.ww = 0.1;
    race_btn.wh = 0.1;
    toScene(race_btn,canv);

    terrarium = new Terrarium();
    terrarium.wx = 0.3;
    terrarium.wy = 0.3;
    terrarium.ww = 0.4;
    terrarium.wh = 0.4;
    toScene(terrarium,canv);

    selects = [];
    var select;
    for(var i = 0; i < 5; i++)
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

    clicker.register(rock_btn);
    clicker.register(race_btn);

    selected_i = -1;

    //stub hack
    game.player.lizards = [];
    for(var i = 0; i <= 3; i++)
      game.player.lizards[i] = new Lizard();
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();
  };

  self.draw = function()
  {
    context.fillStyle = "#000000";
    context.fillText("Gameplay",20,50);

    context.fillStyle = "#000000";
    context.fillText("To Rock",rock_btn.x,rock_btn.y);
    rock_btn.draw(canv);
    context.fillStyle = "#000000";
    context.fillText("To Race",race_btn.x,race_btn.y);
    race_btn.draw(canv);

    drawTerrarium(context);
    context.fillStyle = "#000000";
    context.fillText("My Lizards",10,20);
    for(var i = 0; i < selects.length; i++)
      drawSelect(selects[i]);
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
      if(game.player.lizards.length-1 > self.i)
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
    if(game.player.lizards.length-1 > select.i)
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

};

