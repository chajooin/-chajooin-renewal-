const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('POINT_GOODS_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "항목명"
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "적용 포인트"
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "리워드 비율(%)"
    },
    create_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "생성일"
    }
  }, {
    sequelize,
    tableName: 'POINT_GOODS_TB',
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
