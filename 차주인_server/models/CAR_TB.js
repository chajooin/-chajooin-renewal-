const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CAR_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "노출 순서"
    },
    maker: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "제조사"
    },
    car: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "차종(쉼표로 구분)"
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
    tableName: 'CAR_TB',
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
