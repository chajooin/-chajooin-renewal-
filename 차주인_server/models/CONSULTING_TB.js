const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CONSULTING_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "구분(1=예약상담 2=전화상담)"
    },
    u_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "신청자 고유번호"
    },
    target_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "글작성자 고유번호"
    },
    board: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "게시판 종류 키값(1=화물차 2=지입차 3=구인 4=구직 5=게시판)\t"
    },
    board_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "글 고유번호"
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "이름"
    },
    hp: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "연락처"
    },
    sido: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "시\/도"
    },
    sigungu: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "시\/군\/구"
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "내용"
    },
    read_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "수신자 읽음 날짜"
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
    tableName: 'CONSULTING_TB',
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
