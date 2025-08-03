const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BOARD_COMMENT_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    u_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "작성자 고유번호"
    },
    b_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "게시물 고유번호"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "댓글"
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
    tableName: 'BOARD_COMMENT_TB',
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
        name: "b_idx",
        using: "BTREE",
        fields: [
          { name: "b_idx" },
        ]
      },
    ]
  });
};
