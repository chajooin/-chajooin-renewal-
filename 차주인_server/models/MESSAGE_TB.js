const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MESSAGE_TB', {
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
      comment: "발신자 고유번호"
    },
    target_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "수신자 고유번호"
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "내용"
    },
    create_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "생성일"
    },
    delete_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "발신자 삭제일"
    },
    delete_dt2: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "수신자 삭제일"
    }
  }, {
    sequelize,
    tableName: 'MESSAGE_TB',
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
