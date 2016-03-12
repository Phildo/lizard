var RANK_ENUM = 0;
var RANK_50           = RANK_ENUM; RANK_ENUM++;
var RANK_100          = RANK_ENUM; RANK_ENUM++;
var RANK_150          = RANK_ENUM; RANK_ENUM++;
var RANK_MASTER       = RANK_ENUM; RANK_ENUM++;

var Player = function()
{
  var self = this;

  self.money = 0;//10000;
  self.lizards = [];

  self.rank;
  self.wins = 0;
  self.total_races = 0;

  self.owns_tinfoil = false;
  self.owns_cactus = false;
}

var ENUM = 0;
var LIZARD_GENDER_NA     = ENUM; ENUM++;
var LIZARD_GENDER_MALE   = ENUM; ENUM++;
var LIZARD_GENDER_FEMALE = ENUM; ENUM++;

var Lizard = function(gender, speed, endurance)
{
  var self = this;

  self.name = randName();
  self.gender = gender || LIZARD_GENDER_NA;
  self.speed = speed || 0.3;
  self.endurance = randR(0.1,1);
  self.base_endurance = endurance || Math.random();
  self.wins = 0;
  self.total_races = 0;

  self.color = randIntBelow(6);

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.wx = 0;
  self.wy = 0;
  self.ww = 0;
  self.wh = 0;
}

