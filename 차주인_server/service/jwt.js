const secret = process.env.JWT_KEY;
const models = require('../models');

module.exports = {
    sign: (payload) => { // access token 발급
        return jwtUtil.sign(payload, secret, { // secret으로 sign하여 발급하고 return
            algorithm: 'HS256', // 암호화 알고리즘
        });
    },
    adminSign: (payload) => { 
        return jwtUtil.sign(payload, secret, { 
            algorithm: 'HS256',
        });
    },
    verify: async (req, res, next) => { // access token 검증
        let decoded = null;
        const token = req.headers.authorization;

        if (!token || token === 'null' || token === 'undefined') {
            res.status(500).send('로그인이 필요합니다.');
        } else {
            try {
                decoded = jwtUtil.verify(token, secret);
                let idx = decoded?.idx;

                req.body.jwt = decoded?.idx;

                const user = await models.USER_TB.findOne({
                    raw: true,
                    where: {
                        idx: idx,
                        level: 10
                    }
                });
            
                if(!user) {
                    res.status(500).send('로그인이 필요합니다.');
                } else {
                    next();
        
                    models.USER_TB.update(
                        {
                            login_dt: req.body.nowDt
                        },const jwtUtil = require('jsonwebtoken');

                        {
                            where: {
                                idx: user.idx
                            }
                        }
                    )
                }

            } catch (err) {
                res.status(500).send('로그인이 필요합니다.');
            }
        }
       
    },
    refresh: () => { // refresh token 발급
        return jwtUtil.sign({}, secret, { // refresh token은 payload 없이 발급
            algorithm: 'HS256',
            expiresIn: '14d',
        });
    },
    createToken: (payload) => { // 3분짜리 1회성 토큰 생성
        return jwtUtil.sign(payload, secret, { 
            algorithm: 'HS256',
            expiresIn: '3m',
        });
    },
    decryptToken: (token) => { // 토큰값 복호화
        try {
            let decoded = jwtUtil.verify(token, secret);
            return decoded;
        } catch {
            return null;
        }
        
    },
    destroyToken: (token) => { // 토큰 삭제
        jwtUtil.destroy(token);
    },
    
};