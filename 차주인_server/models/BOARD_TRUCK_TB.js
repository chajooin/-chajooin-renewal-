const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BOARD_TRUCK_TB', {
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
      comment: "등록 상태(1=진행중 2=판매완료 99=임시저장)"
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
    maker: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "제조사"
    },
    car: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "차종"
    },
    year: {
      type: DataTypes.STRING(4),
      allowNull: true,
      comment: "차량연식 연도"
    },
    month: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: "차량연식 월"
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "주행거리 km"
    },
    usage: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "차량용도"
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "차량형식"
    },
    sub_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "차량형식 세부"
    },
    ton: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "차량톤수"
    },
    axis: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "가변축(전축 \/ 후축)"
    },
    color: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "차량색상"
    },
    box_area: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "적재함 넓이"
    },
    box_height: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "적재함 높이"
    },
    box_width: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "적재함 길이"
    },
    box_palette: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "적재함 파렛수"
    },
    transmission: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "변속기"
    },
    fuel: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "연료"
    },
    sido: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "등록지역 시\/도"
    },
    sigungu: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "등록지역 시\/군\/구"
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "차량판매가(만원단위)"
    },
    license_sell: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "넘버 판매 여부(1=판매 0=판매안함)"
    },
    license_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "넘버종류"
    },
    license_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "넘버 가격(만원단위)"
    },
    options: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "일반 옵션 리스트(쉼표로 구분)"
    },
    etc_options: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "기타 옵션(쉼표로 구분)"
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "차량 상세 설명"
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "차량 소유자 이름"
    },
    car_num: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "차량 등록번호"
    },
    car_auth_type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "소유자인증 타입(1=본인인증 2=서류인증)"
    },
    car_auth_state: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "서류인증 상태(1=접수 2=승인 99=반려)"
    },
    car_auth_msg: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "서류인증 반려사유"
    },
    photo_1: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(전면)"
    },
    photo_2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(후면)"
    },
    photo_3: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(좌측면)"
    },
    photo_4: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(우측면)"
    },
    photo_5: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(적재함)"
    },
    photo_6: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(하부)"
    },
    photo_7: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(내부)"
    },
    photo_8: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(계기판)"
    },
    photo_9: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(사업자등록증)"
    },
    photo_10: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "사진(자동차등록증)"
    },
    ad: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "광고노출(0=미노출 1=노출)"
    },
    start_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "광고 시작일시"
    },
    end_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "광고 종료일시"
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
    tableName: 'BOARD_TRUCK_TB',
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
