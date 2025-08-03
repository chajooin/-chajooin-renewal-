const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('REPORT_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "처리상태(1=미처리 99=처리완료)"
    },
    u_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "신고자 고유번호"
    },
    target_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "신고대상 고유번호"
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "신고 사유"
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "신고 내용"
    },
    process: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "처리 내용"
    },
    board: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "게시판 종류 키값(1=화물차 2=지입차 3=구인 4=구직 5=게시판)"
    },
    board_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "게시물 고유번호"
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
    tableName: 'REPORT_TB',
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
