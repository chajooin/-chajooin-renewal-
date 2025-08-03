const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ALARM_TB', {
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
      comment: "회원 고유번호"
    },
    c_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "예약상담신청 고유번호(예약상담신청 알림일시만 값있음)"
    },
    board: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "게시판 종류 키값(1=화물차 2=지입차 3=구인 4=구직 5=게시판)\t"
    },
    board_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "게시물 고유번호"
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "알림 키워드"
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
      comment: "삭제일, 플래그"
    }
  }, {
    sequelize,
    tableName: 'ALARM_TB',
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
      {
        name: "u_idx",
        using: "BTREE",
        fields: [
          { name: "u_idx" },
        ]
      },
    ]
  });
};
