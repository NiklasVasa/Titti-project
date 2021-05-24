const sensorData = require('../data/sensorData.json');
const fetch = require('node-fetch');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false
});
const sqlConnection = require('./sqlConnection.js');

//Loggar in från Server-sidan för att initiera client credential flow 
function signIn() {
    console.log('in signin');
    fetch('https://vasakronanone2one.me' + '/login', {
            agent
        })
        .then(function (response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
        }).then(function (data) {
            return data;
        }).then(function (data) {
            return data.access_token;
        }).then(function (token) {
            getData(token);
        });
}

//En kort funktion som kollar om vi faktiskt har fått ett auth-token, och isf så kärs fetchIt som hämtar datan från ProptechOS.
function getData(token) {
    if (token != null) {
        console.log('Successfully got access token! :-)')
        fetchIt(token);
    } else {
        console.log('No access token gotten :-(');
    }
}

//Här hämtas datan. Kollar hur många våningar byggnaden har genom json-filen och skickar sedan in det i generateSensorUrl
//för att skapa de URL-er som kopplas till de olika sensorerna. 
//Egentligen ska dagens datum, samt det sista datumet i databasen hämtas och skickas in i generateSensorUrl, så att 
//databasen successivt fylls på med nya mätvärden, det är nästa utmaning!
function fetchIt(token) {
    let startTime = null;
    let i = 0;
    let numberOfFloors = Object.keys(sensorData.skjutsgossen8.floors).length;
    let sensorIds = getSensorIds(numberOfFloors)[0],
        roomIds = getSensorIds(numberOfFloors)[1],
        litteras = getSensorIds(numberOfFloors)[2];

    let query = `
    SELECT TOP 1 observationTime 
    FROM [dbo].[${sensorIds[0]}]
    ORDER  BY observationTime DESC
    `

    //Här sker den inkrementella uppdateringen av SQL-databasen. Den körs var 10-minut, lika ofta som sensorerna uppdateras i ProptechOS.
    //Varje sensor får 3 sekunder på sig att hämta data, vilket förhoppningsvis inte kommer vara ett problem vid större datahämtning, alternativt kan den
    //ändras till ett större tal då. Det är siffran på rad 69.
    setInterval(function () {
        sqlConnection.getObsTime(query, function (result) {
            startTime = result.toISOString().split(' ').join().replace(':', '%3A').replace(':', '%3A').slice(0, -5);
            let sensorUrls = generateSensorUrl(numberOfFloors, startTime);
            setInterval(function () {
                if (i < sensorIds.length) {
                    callApi(sensorIds[i].toString(), roomIds[i].toString(), litteras[i].toString(), sensorUrls[i].toString(), token);
                    i += 1;
                } else {};
            }, 3000);
        });
    }, 600000);
};


//Funktion som tar in ett sensorId och returnerar sensorUrl som används för att kalla på Proptech. 
//Den skiljer sig lite från den som kallas från client-sidan, då denna har en startTime och endTime. Vilket gör det möjligt att 
//hämta data som samlats under en längre tidsperiod och inte bara punktvis. 
//I denna funktion så kommer datan sparas ner till databasen???
function generateSensorUrl(numberOfFloors, startTime) {
    let sensorIds = getSensorIds(numberOfFloors)[0];
    let endTime = new Date(Date.now()).toISOString().split(' ').join().replace(':', '%3A').replace(':', '%3A').slice(0, -5);
    let sensorUrls = [];
    for (let i = 0; i < sensorIds.length; i++) {
        let sensorUrl = `https://vk.proptechos.com/api/sensor/${sensorIds[i]}/observation/?startTime=${startTime}Z&endTime=${endTime}Z`;
        sensorUrls.push(sensorUrl);
    }
    return sensorUrls;
};

//Hämtar sensorIdn som behövs för att hämta datan från APIet.
function getSensorIds(numberOfFloors) {
    let sensorIds = [];
    let roomIds = [];
    let litteras = [];
    const floors = Object.values(sensorData.skjutsgossen8.floors); //array med alla våningar som objekt
    for (let i = 0; i < numberOfFloors; i++) {
        const floorArray = Object.values(floors[i]);
        const rooms = Object.values(floorArray[1]); //[0] är popularName, dvs 'Våning X', [1] rumsid
        rooms.forEach(room => {
            let sensorId = Object.values(room)[1];
            if (sensorId !== undefined) {
                roomIds.push(Object.keys(floorArray[1]));
                litteras.push(Object.values(room)[0]);
                sensorIds.push(sensorId);
            }
        });
    }
    //sensorIds är en array som innehåller alla idn i hela huset. 
    return [sensorIds, roomIds, litteras];
};

//Här görs själva requesten till APIet, alltså till ProptechOS. 
function callApi(sensorId, roomId, littera, sensorUrl, accessToken) {
    let options = {
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
        mode: 'cors',
        cache: 'default',
    };
    // Testing the API for one sensor and its latest data:
    return fetch(sensorUrl, options)
        // Step 1 is to fetch the response, convert into json format
        .then(function (response) {
            return response.json();
        })
        //Här skickas returvärdet in i en query som används av getTable-funktionen i sqlConnection-filen.
        .then(function (data) {
            console.log('Getting data for ' + sensorId);

            for (let i = 0; i < Object.keys(data).length; i++) {
                let query =
                    `INSERT INTO [dbo].[${sensorId}]
                ([SensorID]
                ,[RoomId]
                ,[OnFloor]
                ,[Littera]
                ,[observationTime]
                ,[Temp])
                VALUES
                ('${sensorId}'
                ,'roomId'
                ,'${littera.toString().slice(0,1)}'
                ,'${littera.toString()}'
                ,'${data[i].observationTime.toString()}'
                ,'${data[i].value.toString()}')`

                sqlConnection.insertVal(query);
            };
        }).catch();

}


module.exports = {
    signIn
};