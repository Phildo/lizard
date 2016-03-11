var ENUM;

var Player = function()
{
  var self = this;

  self.money = 0;
  self.lizards = [];
}

ENUM = 0;
var LIZARD_GENDER_NA     = ENUM; ENUM++;
var LIZARD_GENDER_MALE   = ENUM; ENUM++;
var LIZARD_GENDER_FEMALE = ENUM; ENUM++;

var RANK_BRONZE       = ENUM; ENUM++;
var RANK_SILVER       = ENUM; ENUM++;
var RANK_GOLD         = ENUM; ENUM++;
var RANK_PLATINUM     = ENUM; ENUM++;
var RANK_DIAMOND      = ENUM; ENUM++;
var RANK_MASTER       = ENUM; ENUM++;
var RANK_CHALLENGER   = ENUM; ENUM++;

var Lizard = function(name, gender, speed, endurance)
{
  var self = this;

  self.name = name || "liz";
  self.gender = gender || LIZARD_GENDER_NA;
  self.speed = speed || 0.3;
  self.base_endurance = endurance || Math.random();
  self.wins = 0;
  self.rank = RANK_BRONZE;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.wx = 0;
  self.wy = 0;
  self.ww = 0;
  self.wh = 0;
}

