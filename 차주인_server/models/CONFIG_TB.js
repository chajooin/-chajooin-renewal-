const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CONFIG_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    con_company: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "상호명"
    },
    con_addr: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "푸터 주소"
    },
    con_ceo: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "푸터 대표자"
    },
    con_buisness_num: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "푸터 사업자번호"
    },
    con_communication_num: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "통신판매업번호"
    },
    con_hp: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "푸터 전화번호"
    },
    con_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "푸터 대표메일"
    },
    con_fag_cate: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "faq 카테고리 ||로 구분 "
    },
    con_guide_cate: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "이용가이드 카테고리 ||로구분"
    },
    con_contract_file: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "중고거래 화물표준계약서(중고화물차)"
    },
    con_contract_file2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "중고거래 화물표준계약서(지입차)"
    }
  }, {
    sequelize,
    tableName: 'CONFIG_TB',
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
