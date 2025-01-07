let mysql = require("mysql");

let conexion = mysql.createConnection({
  host: "localhost",
  database: "bdadsov",
  user: "root",
  password: ""
});

conexion.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos");

 
  });

  conexion.end();