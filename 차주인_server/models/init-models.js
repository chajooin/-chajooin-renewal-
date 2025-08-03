var DataTypes = require("sequelize").DataTypes;
var _ACCESS_COUNT_TB = require("./ACCESS_COUNT_TB");
var _ALARM_TB = require("./ALARM_TB");
var _BANNER_TB = require("./BANNER_TB");
var _BOARD_COMMENT_TB = require("./BOARD_COMMENT_TB");
var _BOARD_JEEIP_TB = require("./BOARD_JEEIP_TB");
var _BOARD_JOB_TB = require("./BOARD_JOB_TB");
var _BOARD_RECRUIT_TB = require("./BOARD_RECRUIT_TB");
var _BOARD_TB = require("./BOARD_TB");
var _BOARD_TRUCK_TB = require("./BOARD_TRUCK_TB");
var _CAR_TB = require("./CAR_TB");
var _CAR_TYPE_TB = require("./CAR_TYPE_TB");
var _CONFIG_TB = require("./CONFIG_TB");
var _CONSULTING_TB = require("./CONSULTING_TB");
var _CS_TB = require("./CS_TB");
var _DONG_TB = require("./DONG_TB");
var _FAQ_TB = require("./FAQ_TB");
var _FILE_TB = require("./FILE_TB");
var _LIKE_TB = require("./LIKE_TB");
var _MESSAGE_TB = require("./MESSAGE_TB");
var _NEWS_TB = require("./NEWS_TB");
var _OPTION_TB = require("./OPTION_TB");
var _PENALTY_TB = require("./PENALTY_TB");
var _POINT_CHARGE_TB = require("./POINT_CHARGE_TB");
var _POINT_EXCHANGE_TB = require("./POINT_EXCHANGE_TB");
var _POINT_GOODS_TB = require("./POINT_GOODS_TB");
var _POINT_TB = require("./POINT_TB");
var _POPUP_TB = require("./POPUP_TB");
var _REPORT_TB = require("./REPORT_TB");
var _TERM_TB = require("./TERM_TB");
var _USER_FILTER_TB = require("./USER_FILTER_TB");
var _USER_TB = require("./USER_TB");

function initModels(sequelize) {
  var ACCESS_COUNT_TB = _ACCESS_COUNT_TB(sequelize, DataTypes);
  var ALARM_TB = _ALARM_TB(sequelize, DataTypes);
  var BANNER_TB = _BANNER_TB(sequelize, DataTypes);
  var BOARD_COMMENT_TB = _BOARD_COMMENT_TB(sequelize, DataTypes);
  var BOARD_JEEIP_TB = _BOARD_JEEIP_TB(sequelize, DataTypes);
  var BOARD_JOB_TB = _BOARD_JOB_TB(sequelize, DataTypes);
  var BOARD_RECRUIT_TB = _BOARD_RECRUIT_TB(sequelize, DataTypes);
  var BOARD_TB = _BOARD_TB(sequelize, DataTypes);
  var BOARD_TRUCK_TB = _BOARD_TRUCK_TB(sequelize, DataTypes);
  var CAR_TB = _CAR_TB(sequelize, DataTypes);
  var CAR_TYPE_TB = _CAR_TYPE_TB(sequelize, DataTypes);
  var CONFIG_TB = _CONFIG_TB(sequelize, DataTypes);
  var CONSULTING_TB = _CONSULTING_TB(sequelize, DataTypes);
  var CS_TB = _CS_TB(sequelize, DataTypes);
  var DONG_TB = _DONG_TB(sequelize, DataTypes);
  var FAQ_TB = _FAQ_TB(sequelize, DataTypes);
  var FILE_TB = _FILE_TB(sequelize, DataTypes);
  var LIKE_TB = _LIKE_TB(sequelize, DataTypes);
  var MESSAGE_TB = _MESSAGE_TB(sequelize, DataTypes);
  var NEWS_TB = _NEWS_TB(sequelize, DataTypes);
  var OPTION_TB = _OPTION_TB(sequelize, DataTypes);
  var PENALTY_TB = _PENALTY_TB(sequelize, DataTypes);
  var POINT_CHARGE_TB = _POINT_CHARGE_TB(sequelize, DataTypes);
  var POINT_EXCHANGE_TB = _POINT_EXCHANGE_TB(sequelize, DataTypes);
  var POINT_GOODS_TB = _POINT_GOODS_TB(sequelize, DataTypes);
  var POINT_TB = _POINT_TB(sequelize, DataTypes);
  var POPUP_TB = _POPUP_TB(sequelize, DataTypes);
  var REPORT_TB = _REPORT_TB(sequelize, DataTypes);
  var TERM_TB = _TERM_TB(sequelize, DataTypes);
  var USER_FILTER_TB = _USER_FILTER_TB(sequelize, DataTypes);
  var USER_TB = _USER_TB(sequelize, DataTypes);


  return {
    ACCESS_COUNT_TB,
    ALARM_TB,
    BANNER_TB,
    BOARD_COMMENT_TB,
    BOARD_JEEIP_TB,
    BOARD_JOB_TB,
    BOARD_RECRUIT_TB,
    BOARD_TB,
    BOARD_TRUCK_TB,
    CAR_TB,
    CAR_TYPE_TB,
    CONFIG_TB,
    CONSULTING_TB,
    CS_TB,
    DONG_TB,
    FAQ_TB,
    FILE_TB,
    LIKE_TB,
    MESSAGE_TB,
    NEWS_TB,
    OPTION_TB,
    PENALTY_TB,
    POINT_CHARGE_TB,
    POINT_EXCHANGE_TB,
    POINT_GOODS_TB,
    POINT_TB,
    POPUP_TB,
    REPORT_TB,
    TERM_TB,
    USER_FILTER_TB,
    USER_TB,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
