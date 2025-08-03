const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('POINT_CHARGE_TB', {
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
    point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "충전 포인트"
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "결제금액"
    },
    tid: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "PG결제 고유번호"
    },
    create_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "생성일"
    }
  }, {
    sequelize,
    tableName: 'POINT_CHARGE_TB',
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
