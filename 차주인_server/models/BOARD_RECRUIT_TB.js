const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BOARD_RECRUIT_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    u_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "작성자 고유번호"
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "등록 상태(1=진행중 2=모집마감 99=임시저장)"
    },
    view: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "조회수"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "제목"
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "업체명"
    },
    go_sido: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "출근지 시\/도"
    },
    go_sigungu: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "출근지 시\/군\/구"
    },
    item: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "운송 품목"
    },
    section: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "운행구간"
    },
    unloading: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "상하차 형태(쉼표로 구분)"
    },
    work: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "근무시간"
    },
    dayoff: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "휴무"
    },
    pay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "월급여(만원단위)"
    },
    deadline_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "접수마감 타입(1=채용시 마감 2=상시모집 3=기간설정)"
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "접수마감일(YYYY-MM-DD)"
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "차량형태"
    },
    ton: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "차량톤수"
    },
    certificate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "적합 면허"
    },
    cargo_option: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "화물운송종사자격 여부(1=필요 0=필요없음)"
    },
    danger_option: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "위험물운송자격 여부(1=필요 0=필요없음)"
    },
    health_option: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "보건증 여부(1=필요 0=필요없음)"
    },
    machinery_option: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "건설기계조종사면허 여부(1=필요 0=필요없음)"
    },
    worktype: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "근무 형태"
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "성별"
    },
    education: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "학력"
    },
    career: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "경력"
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "상세 내용"
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
    tableName: 'BOARD_RECRUIT_TB',
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
