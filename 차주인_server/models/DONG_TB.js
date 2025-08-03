const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DONG_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sido: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "시\/도"
    },
    sigungu: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "시\/군\/구"
    },
    dong: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "동"
    }
  }, {
    sequelize,
    tableName: 'DONG_TB',
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
        name: "dong",
        using: "BTREE",
        fields: [
          { name: "dong" },
        ]
      },
      {
        name: "sido",
        using: "BTREE",
        fields: [
          { name: "sido" },
        ]
      },
    ]
  });
};
