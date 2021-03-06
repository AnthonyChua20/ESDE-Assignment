/*
Name: Chua Chin Kang Anthony
Class: DIT 2A/01
Admission No: P2026626
*/

const config = require('../config/config');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');


// const verifyFn = {
// verifyTokenUserID: function (req, res, next) {
//     let token = req.headers['authorization'];
//     res.type('json');
//     if (!token || !token.includes("Bearer ")) {
//         logger.info("Unauthorized Access Attempt Was Made, No Token")
//         res.status(403);
//         res.send(`{"Message":"Not Authorized"}`);
//     } else {
//         token = token.split('Bearer ')[1];
//         jwt.verify(token,config.JWTKey,function(err,decoded){
//             if(err){
//                 logger.info("Unauthorized Access Attempt Was Made, Invalid Token")
//                 res.status(403);
//                 res.send(`{"Message":"Not Authorized"}`);
//             }else{
//                 req.body.userId = decoded.id;
//                 req.role = decoded.role
//                 next();
//             }
//         });
//     }
// },
// }
const verifyFn = {

    verifyTokenUserID: function (req, res, next) {
        //  logger.info("verifyTokenUserID middleware called");
        let token = req.headers['authorization'];
        res.type('json');
        if (!token || !token.includes("Bearer ")) {
            logger.info("Unauthorized Access Attempt Was Made, No Token")
            res.status(403);
            res.send(`{"Message":"Not Authorized"}`);
        } else {
            token = token.split('Bearer ')[1];
            jwt.verify(token, config.JWTKey, function (err, decoded) {
                if (err) {
                    logger.info("Unauthorized Access Attempt Was Made, Invalid Token")
                    res.status(403);
                    res.send(`{"Message":"Not Authorized"}`);
                } else {
                    req.body.userId = decoded.id;
                    req.role = decoded.role;
                    next();
                }
            });
        }
    },

}

module.exports = verifyFn;

