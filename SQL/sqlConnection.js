var sql = require("msnodesqlv8");

//connString är strängen som visar var databasen finns och ger all information för att man ska kunna koppla sig till den.
//msnodesql används för att kunna utnyttja windows-authentication till databasen

//connString is the connection string
let connString = "server=APHK-SRV104;Database=Skjutsgossen8TempDatabase;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";


//Här hämtas observationstiden. Alltså det datum som vi vill *BÖRJA* hämta data ifrån för att hålla databasen uppdaterad. 
//Det är det senaste inrapporterade värdet. 

//Gets the observation time, the date that you want to start collecting data from the database. 
function getObsTime(query, callback) {

  sql.query(connString, query, (err, rows) => {
    if (err) {
      console.log(err);
    }
    return callback(rows[0].observationTime);
  });

};


//Här stoppar vi in nya värden i databasen.

//Inputting values into the database
function insertVal(query) {
  sql.query(connString, query, (err, rows) => {
    if (err) {
      console.log(err);
    }
  })
};

module.exports = {
  insertVal,
  getObsTime
};
