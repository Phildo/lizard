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

var Lizard = function()
{
  var self = this;

  self.name = "liz";
  self.gender = LIZARD_GENDER_NA;
  self.speed = 1;
}

