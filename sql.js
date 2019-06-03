const mysql = require('mysql');

class Sql {

    constructor(sqlCreds) {

        this.sqlCreds = sqlCreds;
        this.con = mysql.createConnection(this.sqlCreds);

    }

    connect() {

        return new Promise((resolve, reject) => {

            this.con.connect(err => {

                if (err)
                    reject(err);
                else
                    resolve();

            });

        });

    }

    query(q) {

        return new Promise((resolve, reject) => {

            this.con.query(q, (err, results, fields) => {

                if (err)
                    reject(err);

                else
                    resolve({ results, fields });

            });

        });

    }

    close() {

        this.con.destroy();

    }

}

module.exports = Sql;