const pool = require("../db");



const createUser = async (firstName, lastName, email, password) => {
    const result = await pool.query(
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, password]
    );
    return result.rows[0];
};


const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0];
}

const updateUser = async (id, {firstName, lastName, email}) => {
    const result = await pool.query(
        `UPDATE users 
        SET firstname = $1, lastname = $2, email = $3
        WHERE id = $4
        RETURNING *`,
        [firstName, lastName, email, id]
    );
    return result.rows[0];
}

module.exports = { createUser, findUserByEmail, updateUser}