var Game = function(init)
{
  var default_init =
  {
    width:640,
    height:320,
    container:"stage_container"
  }

  var self = this;
  doMapInitDefaults(init,init,default_init);

  //Shared Game State
  self.player = new Player();

  //stub hack
  for(var i = 0; i < 3; i++) {
    self.player.lizards[i] = new Lizard(Math.floor(randR(1, 3)), randR(0.01, 0.30), randR(0.01, 0.30));
  }

  self.racing_lizard_index = -1;

  var stage = new Stage({width:init.width,height:init.height,container:init.container});
  var scenes = [
    /* 0 */ new NullScene(self, stage),
    /* 1 */ new LoadingScene(self, stage),
    /* 2 */ new GamePlayScene(self, stage),
    /* 3 */ new RockScene(self, stage),
    /* 4 */ new RaceScene(self, stage),
  ];
  var cur_scene = 0;
  var old_cur_scene = -1;

  self.begin = function()
  {
    self.nextScene();
    tick();
  };

  var tick = function()
  {
    requestAnimFrame(tick,stage.dispCanv.canvas);
    stage.clear();
    scenes[cur_scene].tick();
    if(old_cur_scene == cur_scene) //still in same scene- draw
    {
      scenes[cur_scene].draw();
      stage.draw(); //blits from offscreen canvas to on screen one
    }
    old_cur_scene = cur_scene;
  };

  self.setScene = function(scene)
  {
    scenes[cur_scene].cleanup();
    cur_scene = scene;
    scenes[cur_scene].ready();
  }

  self.nextScene = function()
  {
    self.setScene(cur_scene+1);
  };
};

