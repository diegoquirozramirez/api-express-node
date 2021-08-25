const mysql = require('mysql');
const util = require('util');

let connection;

class ClienteConnection {
  static async getInstanceMySql() {
    connection = mysql.createConnection({
      host: "localhost",//process.env.CONVERTI_CLOUD_HOST,
      database: "cliente", //process.env.CONVERTI_DATABASE_NAME,
      user: "root", //process.env.CONVERTI_CLOUD_USER,
      password: "123456", //process.env.CONVERTI_CLOUD_PASSWORD,
    });
    connection.connect();
  }

  static async executeQueryMySql(statement, values) {
    try {
        await this.getInstanceMySql();
        const db = util.promisify(connection.query).bind(connection);
        const query = this.dataBinding(statement, values);
        const result = await db(query);
        await this.finishInstanceMySql();
        return result || [];
    } catch (error) {
        console.error(error);
        await this.finishInstanceMySql();
    }
  }

  static async finishInstanceMySql(){
    await connection.end();
  }

  static dataBinding(statement, values){
    for (const obj of Object.keys(values)) {
        if (!values[obj]){
            throw new Error('Missing Properties Of Value, please check it!');
        }
        const typeData = typeof values[obj];
        let dataBinding;
        if(typeData === 'string' || typeData === 'date') {
            dataBinding = `'${values[obj]}'`;
        }
        if(typeData === 'number' || typeData === 'boolean') {
            dataBinding = values[obj];
        }
        statement = statement.replace(`:${obj}`, dataBinding);
    }
    return statement;
  }
}

module.exports = ClienteConnection;

