const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USER_FILTER_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    u_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "유저 고유번호"
    },
    usage: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "중고화물차 차량용도"
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "중고화물차 차량형식"
    },
    sub_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "중고화물차 차량형식 세부"
    },
    min_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "중고화물차 연식 최소"
    },
    max_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "중고화물차 연식 최대"
    },
    min_distance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "중고화물차 주행거리 최소"
    },
    max_distance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "중고화물차 주행거리 최대"
    },
    min_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "중고화물차 차량가격 최소"
    },
    max_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "중고화물차 차량가격 최대"
    },
    truck_license_type: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "중고화물차 넘버승계 종류(쉼표로구분)"
    },
    item: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "지입차 운송품목(쉼표로구분)"
    },
    go_sido: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "지입차 출근지 시\/도"
    },
    min_pay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "지입차 월급여 최소"
    },
    max_pay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "지입차 월급여 최대"
    },
    unloading: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "지입차 상하차방법(쉼표로구분)"
    },
    jeeip_license_type: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "지입차 넘버종류(쉼표로구분)"
    },
    create_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "생성일"
    },
    update_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "수정일"
    },
    delete_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "회원탈퇴일, 플래그"
    }
  }, {
    sequelize,
    tableName: 'USER_FILTER_TB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx" },
        ]
      },
    ]
  });
};
