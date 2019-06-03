const mysql = require('mysql');
const Sql = require('./sql.js');
const fs = require('fs');

class User {

    constructor(uname, dbCreds) {

        this.name = uname;
        this.hash = null;
        this.dbCreds = dbCreds;
        this.type = null;
        this.id = -1;

    }

    async getProps() {

        const sql = new Sql(this.dbCreds);
        await sql.connect();

        const query = await sql.query('SELECT * FROM fmdb.tblUsers WHERE uName = ' + mysql.escape(this.name));
        this.hash = query.results[0].uHash;
        this.id = query.results[0].uID;

    }

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

    computeHash(pass) {
        return pass;
    }

}

module.exports = User;