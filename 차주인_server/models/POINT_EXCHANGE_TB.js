const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('POINT_EXCHANGE_TB', {
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
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "환전상태(1=요청 2=완료 99=실패)"
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "환전 포인트"
    },
    bank: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "은행명"
    },
    bank_num: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "계좌번호"
    },
    bank_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "예금주"
    },
    msg: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      comment: "환전실패사유"
    },
    create_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "생성일"
    },
    update_dt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'POINT_EXCHANGE_TB',
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
