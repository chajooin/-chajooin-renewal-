const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LIKE_TB', {
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
    }
  }, {
    sequelize,
    tableName: 'LIKE_TB',
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
