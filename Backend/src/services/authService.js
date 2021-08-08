/*
Name: Chua Chin Kang Anthony
Class: DIT 2A/01
Admission No: P2026626
*/

config = require('../config/config');
const pool = require('../config/database')
const logger = require('../config/logger');

module.exports.authenticate = (email, callback) => {
    let sql = `SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
    FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`
        pool.getConnection((err, connection) => {
            if (err) {
                if (err) throw err;

            } else {
                try {
                    connection.query(sql,[email], (err, rows) => {
                        if (err) {
                            if (err) return callback(err, null);

                        } else {
                            if (rows.length == 1) {
                                logger.info(rows);
                                return callback(null, rows);

                            } else {

                                return callback('Login has failed', null);
                            }
                        }
                        connection.release();

                    });
                } catch (error) {
                    return callback(error, null);;
                }
            }
        }); //End of getConnection

    } //End of authenticate