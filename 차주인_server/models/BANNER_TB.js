const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BANNER_TB', {
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
      comment: "구분 (1=메인배너 2=하단파트너배너)"
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "링크"
    },
    pc_path: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "PC 이미지경로"
    },
    m_path: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "mobile 이미지경로"
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
    tableName: 'BANNER_TB',
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
