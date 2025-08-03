const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TERM_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "종류(1=이용약관 2=개인정보 3=마케팅 4=회원탈퇴)"
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
      comment: "삭제일"
    }
  }, {
    sequelize,
    tableName: 'TERM_TB',
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
