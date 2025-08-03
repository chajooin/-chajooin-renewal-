const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FILE_TB', {
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
      comment: "종류(1=문의 첨부이미지 2=문의 답변 첨부이미지 3=신고 첨부 이미지 4=게시판 이미지)"
    },
    target_idx: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "대상 고유번호"
    },
    file_path: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "파일 경로"
    },
    create_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "생성일"
    }
  }, {
    sequelize,
    tableName: 'FILE_TB',
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
