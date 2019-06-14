const mysql = require('mysql');
const Sql = require('./sql.js');
const fs = require('fs');

class User {

    /**
     * Constructs a new User object.
     * @param {string} uname Username
     * @param {Object} dbCreds Object containing the SQL credentials
     */
    constructor(uname, dbCreds) {

        this.name = uname;
        this.hash = null;
        this.dbCreds = dbCreds;
        this.type = null;
        this.id = -1;
        this.gotProps = false;

    }

    /**
     * Gets the properties of the user and stores them
     * in the current User object.
     */
    async getProps() {

        const sql = new Sql(this.dbCreds);
        await sql.connect();

        const query = await sql.query('SELECT * FROM fmdb.tblUsers WHERE uName = ' + mysql.escape(this.name));

        if (query.results.length != 1) {
            return;
        }

        this.hash = query.results[0].uHash;
        this.id = query.results[0].uID;
        this.getProps = true;

    }

    /**
     * Authenticates the user and returns an
     * object with the auth status.
     */
    async authenticate(creds) {

        const auth = { logged: false, status: 'error', error: '', token: null };

        if (!this.getProps) {
            auth.error = 'You have to run getProps() first.';
            return auth;
        }

        if (creds.uname != this.name) {
            auth.error = 'Wrong user object.';
            return auth;
        }

        const sql = new Sql(this.dbCreds);
        await sql.connect();

        const query = await sql.query('SELECT * FROM fmdb.tblUsers WHERE uName = ' + mysql.escape(this.name));

        if (query.results.length != 1) {
            auth.error = 'No such user.';
            return auth;
        }

        const tHash = this.computeHash(creds.pword);
        if (tHash = this.hash) {
            auth.logged = true;
            auth.status = 'success';
            auth.token = 'Generic token';
        } else {
            auth.error = 'Wrong password.';
        }

        return auth;

    }

    /**
     * Saves the user to the database.
     */
    async save() {

        const sql = new Sql(this.dbCreds);
        await sql.connect();

        let query = await sql.query('SELECT uID FROM fmdb.tblUsers WHERE uName = ' + mysql.escape(this.name));
        if (query.results.length > 0 && query.results.uID == this.id) {
            throw new Error("This user already exists.");
        } else if (query.results.length == 1 && query.results.uName == this.name) {

            const eHash = mysql.escape(this.hash);

            sql.query(`UPDATE fmdb.tblUsers SET uHash = ${eHash} WHERE uID = ${String(this.id)};`)
                .catch(err => { throw err; });

        } else {

            const eName = mysql.escape(this.name);
            const eHash = mysql.escape(this.hash);
            await sql.query(`INSERT INTO fmdb.tblUsers (uName, uHash) VALUES (${eName}, ${eHash});`)
                .catch(err => { throw err; });

        }

        sql.close();

    }

    /**
     * Computes and returns the hash for the
     * given password.
     * @param {string} pass String to hash
     * @returns {string} Returns a hex string
     */
    computeHash(pass) {
        return pass;
    }

}

module.exports = User;