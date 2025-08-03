'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const process = require('process');
const moment = require('moment');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const consts = require('../service/consts.json');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const pageing = (page) => {

    const { common } = require('../service/utils.js');
    let { limit } = common();

    if(page === 'all') return true;

    if(isNaN(page*limit)) {
        return {
            limit: 0,
            offset: 0
        }
    }

    return {
        limit: limit,
        offset: page * limit
    }
}

const active = () => {
    return {
        where: {
            delete_dt: {
                [Op.is]: null
            }
        }
    }
}

const activeTarget = () => {
    return {
        where: {
            delete_dt2: {
                [Op.is]: null
            }
        }
    }
}

// 게시판 테이블용 
const notTemp = () => {
    return {
        where: {
            status: {
                [Op.ne]: 99
            }
        }
    }
}

// 관리자용
const adminListAttributes = () => {
    return {
        exclude: [
            "u_idx", 
            "axis",
            "color", 
            "box_area", 
            "box_height", 
            "box_width", 
            "fuel", 
            "options", 
            "etc_options", 
            "desc", 
            "name",
            "photo_1",
            "photo_2",
            "photo_3",
            "photo_4",
            "photo_5",
            "photo_6",
            "photo_7",
            "photo_8",
            "photo_9",
            "photo_10",
            "update_dt",
            "delete_dt",


            "section", // 여기부터 지입차 테이블 항목들
            "dayoff",
            "offer",
            "jeeip_price",
            "insurance_price",
            "halbu_price",
            "age",
            "passenger",
            "file_path"
        ]
    }
}
const listAttributes = () => {
    return {
        exclude: [
            "u_idx", 
            "axis",
            "color", 
            "box_area", 
            "box_height", 
            "box_width", 
            "fuel", 
            "options", 
            "etc_options", 
            "desc", 
            "name",
            "car_num",
            "photo_1",
            "photo_2",
            "photo_3",
            "photo_4",
            "photo_5",
            "photo_6",
            "photo_7",
            "photo_8",
            "photo_9",
            "photo_10",
            // "ad",
            "start_dt",
            "end_dt",
            // "create_dt",
            "update_dt",
            "delete_dt",


            "section", // 여기부터 지입차 테이블 항목들
            "dayoff",
            "offer",
            "jeeip_price",
            "insurance_price",
            "halbu_price",
            "age",
            "passenger",
            "file_path",
        ]
    }
}
const infoData = () => {
    let select_type_1 = ` CONCAT(
        year, 
        '/', 
        month, 
        '식', 
        ' · ',
        transmission,
        ' · ',
        CONCAT(FORMAT(distance, 0), 'km'),
        ' · ',
        sido
    )`;
    let select_type_2 = ` CONCAT(item, ' · ', go_sido) `;
    return [
        [
            Sequelize.literal(`
                ( 
                    CASE
                        WHEN board = 1
                        THEN ( SELECT title FROM BOARD_TRUCK_TB as B where B.idx = board_idx )
                        WHEN board = 2
                        THEN ( SELECT title FROM BOARD_JEEIP_TB as B where B.idx = board_idx )
                        WHEN board = 3
                        THEN ( SELECT title FROM BOARD_RECRUIT_TB as B where B.idx = board_idx )
                        WHEN board = 4
                        THEN ( SELECT title FROM BOARD_JOB_TB as B where B.idx = board_idx )
                        WHEN board = 5
                        THEN ( SELECT title FROM BOARD_TB as B where B.idx = board_idx )
                        ELSE ( SELECT title FROM BOARD_TRUCK_TB as B where B.idx = board_idx )
                    END
                ) 
            `), 
            "board_title"
        ],
        [
            Sequelize.literal(`
                ( 
                    CASE
                        WHEN board = 1
                        THEN ( SELECT ${select_type_1} FROM BOARD_TRUCK_TB as B where B.idx = board_idx )
                        WHEN board = 2
                        THEN ( SELECT ${select_type_1}  FROM BOARD_JEEIP_TB as B where B.idx = board_idx )
                        WHEN board = 3
                        THEN ( SELECT ${select_type_2} FROM BOARD_RECRUIT_TB as B where B.idx = board_idx )
                        WHEN board = 4
                        THEN ( SELECT ${select_type_2} FROM BOARD_JOB_TB as B where B.idx = board_idx )
                        WHEN board = 5
                        THEN ( SELECT create_dt FROM BOARD_TB as B where B.idx = board_idx )
                        ELSE ( SELECT ${select_type_1} FROM BOARD_TRUCK_TB as B where B.idx = board_idx )
                    END
                ) 
            `), 
            "board_sub_data"
        ]
    ]
}



/** 관계 설정 */
// 회원 테이블
db.USER_TB.hasMany(db.PENALTY_TB, {
    foreignKey: 'u_idx',
    as: 'penaltys',
})


// 포인트 테이블
db.POINT_CHARGE_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})
db.POINT_EXCHANGE_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})
db.POINT_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})

// 게시판 테이블
db.BOARD_TRUCK_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})
db.BOARD_TRUCK_TB.hasMany(db.CONSULTING_TB, {
    foreignKey: 'board_idx',
    as: 'consulting',
})
db.BOARD_JEEIP_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})
db.BOARD_JEEIP_TB.hasMany(db.CONSULTING_TB, {
    foreignKey: 'board_idx',
    as: 'consulting',
})
db.BOARD_JOB_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})
db.BOARD_RECRUIT_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})
db.BOARD_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})
db.BOARD_TB.hasMany(db.FILE_TB, {
    foreignKey: 'target_idx',
    as: 'files',
});
db.BOARD_TB.hasMany(db.BOARD_COMMENT_TB, {
    foreignKey: 'b_idx',
    as: 'comment',
});

db.BOARD_COMMENT_TB.hasOne(db.USER_TB, {
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
})


// 상담 테이블
db.CONSULTING_TB.hasOne(db.USER_TB, { 
    foreignKey: 'idx',
    sourceKey: 'target_idx',
    as: 'targetUser'
});
db.CONSULTING_TB.hasOne(db.USER_TB, { 
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
});

// 문의 테이블
db.CS_TB.hasOne(db.USER_TB, { 
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
});
db.CS_TB.hasMany(db.FILE_TB, {
    foreignKey: 'target_idx',
    as: 'files',
})
db.CS_TB.hasMany(db.FILE_TB, {
    foreignKey: 'target_idx',
    as: 'answerfiles',
})

// 신고 테이블
db.REPORT_TB.hasMany(db.FILE_TB, {
    foreignKey: 'target_idx',
    as: 'files',
});
db.REPORT_TB.hasOne(db.USER_TB, { 
    foreignKey: 'idx',
    sourceKey: 'target_idx',
    as: 'targetUser'
});
db.REPORT_TB.hasOne(db.USER_TB, { 
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
});

// 쪽지 테이블
db.MESSAGE_TB.hasOne(db.USER_TB, { 
    foreignKey: 'idx',
    sourceKey: 'target_idx',
    as: 'targetUser'
});
db.MESSAGE_TB.hasOne(db.USER_TB, { 
    foreignKey: 'idx',
    sourceKey: 'u_idx',
    as: 'user'
});

/** 관계 설정 끝 */




/** 회원 테이블 */
db.USER_TB.addScope('active', () => {
    return {
        attributes: { exclude: 'password'},
        where: {
            delete_dt: {
                [Op.is]: null
            }
        }
    }
});
db.USER_TB.addScope('delete', () => {
    return {
        attributes: { exclude: 'password'},
        where: {
            delete_dt: {
                [Op.ne]: null
            }
        }
    }
});
db.USER_TB.addScope('pageing', pageing);

// 프론트페이지 로그인 가능 권한
db.USER_TB.addScope('front', () => {
    return {
        attributes: { exclude: 'password'},
        where: {
            level: {
                [Op.lte]: 3
            }
        }
    }
});

// 관리자페이지 로그인 가능 권한
db.USER_TB.addScope('admin', () => {
    return {
        where: {
            level: 10
        }
    }
});

// 페널티 확인
// db.USER_TB.addScope('myfavs', ({info=false}) => {
//     return {
//         include: {
//             model: db.FAV_TB.scope(
//                 info ? { method: ['user', true ] } : ''
//             ),
//             separate: true,
//             as: 'myfavs',
//             order: [
//                 ['idx', 'DESC']
//             ]
//         }
//     }
// });

db.USER_TB.addScope('penaltyCheck', {
    attributes: { 
        include: [
            [
                Sequelize.literal(`
                    ( 
                        SELECT count(idx) FROM CARMASTER.PENALTY_TB as B
                        WHERE B.u_idx = USER_TB.idx
                        AND B.end_dt >= NOW()
                    ) 
                `), 
                "penalty_check"
            ],
        ] 
    }
    // include: [{
    //     required: false,
    //     model: db.PENALTY_TB, 
    //     attributes: [],
    //     as: 'penaltys',
    //     where: {
    //         end_dt: {
    //             [Op.gte]: Sequelize.fn("NOW")
    //         }
    //     }
    // }]

});




/** 포인트 충전 테이블 */
db.POINT_CHARGE_TB.addScope('user', {
    include: {
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});


/** 포인트 정산 테이블 */
db.POINT_EXCHANGE_TB.addScope('user', {
    include: {
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});
db.POINT_EXCHANGE_TB.addScope('waiting', {
    where: {
        status: 1
    }
});

/** 포인트 내역 테이블 */
db.POINT_TB.addScope('active', active);
db.POINT_TB.addScope('user', {
    include: {
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});

/** 상담 테이블 */
db.CONSULTING_TB.addScope('user', () => {
    return {
        include: [
            {
                model: db.USER_TB.scope('front'),
                as: 'user',
            },
            {
                model: db.USER_TB.scope('front'),
                as: 'targetUser'
            }
        ]
    }
})
db.CONSULTING_TB.addScope('info', {
    attributes: { 
        include: infoData()
    }
});

/** 중고화물차 테이블 */
db.BOARD_TRUCK_TB.addScope('adminlist', {
    attributes: adminListAttributes()
});
db.BOARD_TRUCK_TB.addScope('list', {
    attributes: {
        include: [
            ['photo_3', 'thumb'],
        ],
        ...listAttributes()
    }
    
});
db.BOARD_TRUCK_TB.addScope('user', {
    include: {
        required: false,
        model: db.USER_TB.scope('front'),
        as: 'user'
       
    }
});
db.BOARD_TRUCK_TB.addScope('consulting', {
    include: {
        separate: true,
        model: db.CONSULTING_TB.scope('user'),
        as: 'consulting',
        where: {
            board: consts?.boardTruckKey
        },
        order: [
            ['idx', 'DESC']
        ]
    }
});

db.BOARD_TRUCK_TB.addScope('likeCnt', {
    attributes: { 
        include: [
            [
                Sequelize.literal(`
                    ( 
                        SELECT count(idx) FROM CARMASTER.LIKE_TB as B
                        WHERE B.board_idx = BOARD_TRUCK_TB.idx
                        AND B.board = '${consts?.boardTruckKey}'
                    ) 
                `), 
                "like_cnt"
            ],
        ] 
    }
});

db.BOARD_TRUCK_TB.addScope('active', active);
db.BOARD_TRUCK_TB.addScope('pageing', pageing);
db.BOARD_TRUCK_TB.addScope('notTemp', notTemp);


/** 지입차 테이블 */
db.BOARD_JEEIP_TB.addScope('adminlist', {
    attributes: adminListAttributes()
});
db.BOARD_JEEIP_TB.addScope('list', {
    attributes: {
        include: [
            ['photo_3', 'thumb'],
        ],
        ...listAttributes()
    }
});
db.BOARD_JEEIP_TB.addScope('user', {
    include: {
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});
db.BOARD_JEEIP_TB.addScope('consulting', {
    include: {
        separate: true,
        model: db.CONSULTING_TB.scope('user'),
        as: 'consulting',
        where: {
            board: consts?.boardJeeipKey
        },
        order: [
            ['idx', 'DESC']
        ]
    }
});
db.BOARD_JEEIP_TB.addScope('likeCnt', {
    attributes: { 
        include: [
            [
                Sequelize.literal(`
                    ( 
                        SELECT count(idx) FROM CARMASTER.LIKE_TB as B
                        WHERE B.board_idx = BOARD_JEEIP_TB.idx
                        AND B.board = '${consts?.boardJeeipKey}'
                    ) 
                `), 
                "like_cnt"
            ],
        ] 
    }
});
db.BOARD_JEEIP_TB.addScope('active', active);
db.BOARD_JEEIP_TB.addScope('pageing', pageing);
db.BOARD_JEEIP_TB.addScope('notTemp', notTemp);


/** 구직 테이블 */
db.BOARD_JOB_TB.addScope('adminlist', {
    attributes: adminListAttributes()
});
db.BOARD_JOB_TB.addScope('list', {
    attributes: listAttributes()
});
db.BOARD_JOB_TB.addScope('user', {
    include: {
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});
db.BOARD_JOB_TB.addScope('likeCnt', {
    attributes: { 
        include: [
            [
                Sequelize.literal(`
                    ( 
                        SELECT count(idx) FROM CARMASTER.LIKE_TB as B
                        WHERE B.board_idx = BOARD_JOB_TB.idx
                        AND B.board = '${consts?.boardJobKey}'
                    ) 
                `), 
                "like_cnt"
            ],
        ] 
    }
});
db.BOARD_JOB_TB.addScope('active', active);
db.BOARD_JOB_TB.addScope('pageing', pageing);
db.BOARD_JOB_TB.addScope('notTemp', notTemp);

/** 구인 테이블 */
db.BOARD_RECRUIT_TB.addScope('adminlist', {
    attributes: adminListAttributes()
});
db.BOARD_RECRUIT_TB.addScope('list', {
    attributes: listAttributes()
});
db.BOARD_RECRUIT_TB.addScope('user', {
    include: {
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});
db.BOARD_RECRUIT_TB.addScope('likeCnt', {
    attributes: { 
        include: [
            [
                Sequelize.literal(`
                    ( 
                        SELECT count(idx) FROM CARMASTER.LIKE_TB as B
                        WHERE B.board_idx = BOARD_RECRUIT_TB.idx
                        AND B.board = '${consts?.boardRecruitKey}'
                    ) 
                `), 
                "like_cnt"
            ],
        ] 
    }
});
db.BOARD_RECRUIT_TB.addScope('active', active);
db.BOARD_RECRUIT_TB.addScope('pageing', pageing);
db.BOARD_RECRUIT_TB.addScope('notTemp', notTemp);


/** 게시판 테이블 */
db.BOARD_TB.addScope('user', {
    include: {
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});
db.BOARD_TB.addScope('userFront', {
    include: {
        attributes: ['idx', 'name', 'profile'],
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});
db.BOARD_TB.addScope('list', {
    attributes: listAttributes()
});
db.BOARD_TB.addScope('commentCnt', {
    attributes: { 
        include: [
            [
                Sequelize.literal(`
                    ( 
                        SELECT count(idx) FROM BOARD_COMMENT_TB as B
                        WHERE B.b_idx = BOARD_TB.idx
                        AND B.delete_dt is null
                    ) 
                `), 
                "comment_cnt"
            ],
        ] 
    }
});
db.BOARD_TB.addScope('comment', () => {
    return {
        include: [
            {
                
                model: db.BOARD_COMMENT_TB.scope(['active', 'userFront']),
                separate: true,
                as: 'comment',
            }
        ]
    }
})
db.BOARD_TB.addScope('files', () => {
    return {
        include: [
            {
                attributes: [
                    'idx', 'file_path'
                ],
                model: db.FILE_TB,
                separate: true,
                as: 'files',
                where: {
                    type: consts.fileBoardKey,
                }
            }
        ]
    }
})
db.BOARD_TB.addScope('active', active);
db.BOARD_TB.addScope('pageing', pageing);


/** 댓글 테이블 */
db.BOARD_COMMENT_TB.addScope('user', {
    include: {
        model: db.USER_TB.scope('front'),
        as: 'user'
    }
});
db.BOARD_COMMENT_TB.addScope('userFront', {
    attributes: { 
        include: [
            [
                Sequelize.literal(`
                    ( 
                        SELECT name FROM USER_TB as B
                        WHERE B.idx = u_idx
                        AND B.delete_dt is null
                    ) 
                `), 
                "name"
            ],
        ] 
    },
});
db.BOARD_COMMENT_TB.addScope('active', active);
db.BOARD_COMMENT_TB.addScope('pageing', pageing);





/** 문의 테이블 */
db.CS_TB.addScope('active', active);
db.CS_TB.addScope('pageing', pageing);
db.CS_TB.addScope('waiting', () => {
    return {
        where: {
            status: 1
        }
    }
})
db.CS_TB.addScope('user', () => {
    return {
        include: {
            model: db.USER_TB.scope('front'),
            as: 'user'
        }
    }
})
db.CS_TB.addScope('files', () => {
    return {
        include: [
            {
                attributes: [
                    'idx', 'file_path'
                ],
                model: db.FILE_TB,
                separate: true,
                as: 'files',
                where: {
                    type: consts.fileCsKey,
                }
            },
            {
                attributes: [
                    'idx', 'file_path'
                ],
                model: db.FILE_TB,
                separate: true,
                as: 'answerfiles',
                where: {
                    type: consts.fileCsAdminKey,
                }
            }
        ]
    }
})

/** 신고 테이블 */
db.REPORT_TB.addScope('active', active);
db.REPORT_TB.addScope('waiting', () => {
    return {
        where: {
            status: 1
        }
    }
})
db.REPORT_TB.addScope('files', () => {
    return {
        include: [
            {
                attributes: [
                    'idx', 'file_path'
                ],
                model: db.FILE_TB,
                separate: true,
                as: 'files',
                where: {
                    type: consts.fileReportKey,
                }
            }
        ]
    }
})
db.REPORT_TB.addScope('user', () => {
    return {
        include: [
            {
                model: db.USER_TB.scope('front'),
                as: 'user',
            },
            {
                model: db.USER_TB.scope('front'),
                as: 'targetUser'
            }
        ]
    }
})


/** 관심 테이블 */
db.LIKE_TB.addScope('info', {
    attributes: { 
        include: infoData()
    }
});

/** 쪽지 테이블 */
db.MESSAGE_TB.addScope('active', active);
db.MESSAGE_TB.addScope('activeTarget', activeTarget);
db.MESSAGE_TB.addScope('user', () => {
    return {
        include: [
            {
                attributes: ['idx', 'name', 'profile'],
                model: db.USER_TB.scope('front'),
                as: 'user',
            },
            {
                attributes: ['idx', 'name', 'profile'],
                model: db.USER_TB.scope('front'),
                as: 'targetUser'
            }
        ]
    }
})

/** 알람 테이블 */
db.ALARM_TB.addScope('active', active);
db.ALARM_TB.addScope('info', {
    attributes: { 
        include: infoData()
    }
});

/** 공지사항 테이블 */
db.NEWS_TB.addScope('active', active);
db.NEWS_TB.addScope('pageing', pageing);

/** FAQ 테이블 */
db.FAQ_TB.addScope('active', active);
db.FAQ_TB.addScope('pageing', pageing);

/** 배너 테이블 */
db.BANNER_TB.addScope('active', active);
db.BANNER_TB.addScope('pageing', pageing);

/** 팝업 테이블 */
db.POPUP_TB.addScope('active', active);
db.POPUP_TB.addScope('pageing', pageing);



/** 지역 테이블 */
db.DONG_TB.addScope('sido', () => {
    return {
        attributes: [ ['sido' , 'title' ]],
        group: "sido"
    }
});
db.DONG_TB.addScope('sigungu', (sido) => {
    return {
        attributes: [ ['sigungu' , 'title' ]],
        where: {
            sido: sido
        },
        group: "sigungu"
    }
});
db.DONG_TB.addScope('dong', (sido, sigungu) => {
    return {
        attributes: [ ['dong' , 'title' ]],
        where: {
            sido: sido,
            sigungu: sigungu
        },
        group: "dong"
    }
});

module.exports = db;