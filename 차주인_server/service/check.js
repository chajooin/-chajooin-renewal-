require('dotenv').config();

const moment = require('moment');
const models = require('../models');
const { Op } = require("sequelize");
const { sequelize } = require("../models/index"); 
const { dummy } = require("./utils");

const { userReturn, projectReturn } = require('./returns.js');

module.exports.workCheck = async (idx, p_idx, adminCheck=false) => {
    const user = await models.USER_TB.scope('active', 'projects').findOne({
        where: {
            idx: idx
        }
    });

    if(!user) {
        return '잘못된 접근입니다.';
    }

    let userResult = await userReturn(user.get({ plain: true }));

    if(adminCheck && userResult?.level !== 10) {
        return '권한이 없습니다.';
    }

    if(userResult?.auth_work !== 2 || !userResult?.projects?.find(item => item.idx === p_idx) ) {
        return '권한이 없습니다.';
    }

    return true;
}

module.exports.downCheck = async (idx, p_idx) => {
    const user = await models.USER_TB.scope('active', 'projects').findOne({
        where: {
            idx: idx
        }
    });

    if(!user) {
        return '잘못된 접근입니다.';
    }

    let userResult = await userReturn(user.get({ plain: true }));

    if(!userResult?.projects?.find(item => item.idx === p_idx) ) {
        return '권한이 없습니다.';
    }

    return true;
}

module.exports.issueChatCountCheck = async (p_idx, n_idx, state) => {
    const rows = await models.PROJECT_TB.scope('active').findOne({
        where: {
            idx: p_idx
        }
    });
    
    if(!rows) {
        return;
    }

    const count = await models.PROJECT_CHAT_TB.count({
        where: {
            p_idx: p_idx,
            n_idx: n_idx
        }
    });

    
    let project = await projectReturn(rows.get({ plain: true }));
    let edit_data = project?.issue;
    
    if(edit_data) {
        
        let issue_copy = Object.entries(edit_data).map(([columnId, column], index) => {
            if(state !== column?.state) return column;
    
            return {
                ...column, 
                items: column.items.map((x, i) => {
                    if(x.idx !== n_idx) return x;
    
                    return {
                        ...x, 
                        cnt: count
                    }
                })
            };
        })
    
        let upDataList = {
            issue: JSON.stringify(issue_copy)
        };
    
        await models.PROJECT_TB.update(
            upDataList,
            {
                where: {
                    idx: p_idx,
                }
            }
        ); 
    
    }
}

