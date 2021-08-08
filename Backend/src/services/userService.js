/*
Name: Chua Chin Kang Anthony
Class: DIT 2A/01
Admission No: P2026626
*/

const config = require('../config/config');
const pool = require('../config/database');
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const { mailtrapUserName, mailtrapPassword } = require('../config/config');
const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: mailtrapUserName, //generated by Mailtrap
      pass: mailtrapPassword //generated by Mailtrap
    }
});
module.exports.createUser = (fullname, email, password, callback) => {
        logger.info('\n\nChecking the input parameter variable content.');
        logger.info(fullname, email, password);
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    callback(null, err);
                } else {
                    connection.query(`INSERT INTO user ( fullname, email, user_password, 
                        role_id) VALUES (?,?,?,2) `, [fullname, email, password], (err, rows) => {
                        if (err) {
                            callback(null, err);
                        } else {
                            callback(rows, null);
                        }
                        connection.release();
                    });
                }
            });


    } // End of createUser

module.exports.updateUser = (recordId, newRoleId) => {

        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {
                    connection.query(`UPDATE user SET role_id =? WHERE user_id=?`,[newRoleId,recordId], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of updateUser


module.exports.getUserData = (pageNumber, search) => {
        logger.info('\n\ngetUserData method is called.');
        const page = pageNumber;
        if (search == null) { search = ''; };
        const limit = 4; //Due to lack of test files, I have set a 3 instead of larger number such as 10 records per page
        const offset = (page - 1) * limit;

        //If the user did not provide any search text, the search variable
        //should be null. The following logger.info should output undefined.
        //logger.info(search);
        //-------------- Code which does not use stored procedure -----------
        //Query for fetching data with page number, search text and offset value
        if ((search == '') || (search == null)) {
            logger.info('\n\nPrepare query without search text');
            userDataQuery = `SELECT user_id, fullname, email, role_name 
        FROM user INNER JOIN role ON user.role_id = role.role_id LIMIT ${limit} OFFSET ${offset};
        SET @total_records =(SELECT count(user_id) FROM user    );SELECT @total_records total_records; `;
        } else {
            userDataQuery = `SELECT user_id, fullname, email, role_name 
        FROM user INNER JOIN role ON user.role_id = role.role_id AND fullname LIKE '%${search}%'  LIMIT ${limit} OFFSET ${offset};
    SET @total_records =(SELECT count(user_id) FROM user WHERE fullname LIKE '%${search}%' );SELECT @total_records total_records;`;
        }

        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {

                    connection.query(userDataQuery, [search, offset, limit], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            logger.info('\n\nAccessing total number of rows : ', results[2][0].total_records);
                            resolve(results);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of getUserData

module.exports.getOneUserData = function(recordId) {
        logger.info('\n\ngetOneUserData method is called.');
        logger.info('\n\nPrepare query to fetch one user record');
        userDataQuery = `SELECT user_id, fullname, email, user.role_id, role_name 
        FROM user INNER JOIN role ON user.role_id = role.role_id WHERE user_id=` + recordId;

        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {
                    connection.query(userDataQuery, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of getOneUserData
    module.exports.getOneUserDataByEmail = function(search) {
        logger.info('\n\ngetOneUserDataByEmail method is called.');
        logger.info('\n\nPrepare query to fetch one user record');
        userDataQuery = `SELECT user_id, fullname, email, user.role_id, role_name 
        FROM user INNER JOIN role ON user.role_id = role.role_id WHERE email='` + search +`'`;

        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {
                    connection.query(userDataQuery, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of getOneUserDataByEmail

module.exports.getOneDesignData = function(recordId) {
        logger.info('\n\ngetOneDesignData method is called.');
        logger.info('\n\nPrepare query to fetch one design record');
        userDataQuery = `SELECT file_id,cloudinary_file_id,cloudinary_url,design_title,design_description 
        FROM file WHERE file_id=` + recordId;

        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {
                    connection.query(userDataQuery, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of getOneDesignData

module.exports.updateDesign = (recordId, title, description) => {

        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {
                    connection.query(`UPDATE file SET design_title =? , design_description=? WHERE file_id=?`,[title,description,recordId] ,(err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of Design



module.exports.createOneEmailInvitation =  (userData,recipientName, recipientEmail) => {
    
    return new Promise((resolve, reject) => {
        logger.info('\n\nuserService createOneEmailInvitation is running');
        logger.info('\n\nInspect whether the userData variable has content:')
        logger.info(userData);
       
    
  // send mail with defined transport object
  try{
  let info =  transporter.sendMail({
    from: `${userData.fullname}<${userData.email}>`, // sender address
    to: recipientEmail, // list of receivers
    subject: "Hello from Bee competition system admin", // Subject line
    text: `Hi ${recipientName} You have been invited by your friend, ${userData.fullname} to participate in a competition at http://localhost:3001`, // plain text body
    html: `Hi ${recipientName} You have been invited by your friend, ${userData.fullname} to participate in a competition at http://localhost:3001`, // html body
  });
  resolve({status:'success',description:'Email sent'});
}catch(error){
  reject({status:'fail', description: error});
}
 }); //End of new Promise object creation
} //End of createOneEmailInvitation
