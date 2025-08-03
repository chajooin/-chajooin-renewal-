const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CS_TB', {
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
      comment: "상태(1=미처리 99=처리완료)"
    },
    u_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "회원 고유번호"
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "문의내용"
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "문의답변"
    },
    answer_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "처리완료일"
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
    tableName: 'CS_TB',
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
