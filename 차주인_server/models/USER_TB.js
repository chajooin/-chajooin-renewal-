const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USER_TB', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "인덱스"
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "계정유형(kakao,naver)"
    },
    id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "고유 ID"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "이메일(SNS 로그인계정)"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "비밀번호(일반회원 사용안함)"
    },
    level: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "유저등급 (1=\b일반회원 10=관리자)"
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "이름"
    },
    hp: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "연락처"
    },
    sex: {
      type: DataTypes.STRING(2),
      allowNull: true,
      defaultValue: "남",
      comment: "성별"
    },
    profile: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "프로필사진 경로"
    },
    kakao_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "카카오 아이디"
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "보유 포인트"
    },
    agree_marketing: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
      comment: "마케팅 수신동의 (0=거부 1=승인)"
    },
    penalty: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "패널티리스트 |로 구분"
    },
    certification: {
      type: DataTypes.STRING(4),
      allowNull: true,
      comment: "인증번호 확인"
    },
    certification_hp: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "변경할 휴대폰번호"
    },
    car_owner: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "차량소유자인증-소유자"
    },
    car_reg_no: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "차량소유자인증-차량번호"
    },
    login_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "마지막 로그인"
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
      comment: "회원탈퇴일, 플래그"
    },
    delete_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "회원탈퇴 사유"
    }
  }, {
    sequelize,
    tableName: 'USER_TB',
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
