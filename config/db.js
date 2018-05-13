var db = {
    connection  : function(){
      var knex = require('knex')({  
          client: 'mysql',
          connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
          },
          //debug: true
      });
      return require('bookshelf')(knex); 
    }
}
module.exports = db;