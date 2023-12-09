const pool = require("../database")

/* *****************************
*   Login to account
* *************************** */
async function loginAccount(account_email, account_password){
  try {
    const sql = "SELECT account_firstname, account_lastname, account_email, account_type FROM account WHERE account_email=$1 AND account_password=$2"
    return await pool.query(sql, [account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Check Password
* *************************** */
async function checkExistingPassword(account_password){
  try {
    const sql = "SELECT account_type FROM account WHERE account_email=$1 AND account_password=$2"
    const exists =  await pool.query(sql, [account_password])
    return exists.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
*   Update account by Id
* *************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   New Password by Id
* *************************** */
async function newPassword(account_id, account_password){
  try {
    const sql = "UPDATE account SET account_password = $2 WHERE account_id = $1 RETURNING *"
    return await pool.query(sql, [account_id, account_password])
  } catch (error) {
    return error.message
  }
}

module.exports = { loginAccount, checkExistingPassword, registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, newPassword}