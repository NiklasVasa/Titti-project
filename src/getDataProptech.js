import {
    sensorData
} from "./sensorData.js";


main();

/* skapade nån main här men vi får se hur vi gör med den */
function main() {
    const totalFloors = getNumberOfFloors();
    let meanTemps = [];
    for (let floorNumber = 0; floorNumber < totalFloors; floorNumber++) {
        let sensorIds = getSensorIds(floorNumber);
        getAllData(floorNumber, sensorIds);
        let tempValues = getTempValues(floorNumber, sensorIds);
        meanTemps.push(mean(tempValues));
    }
    for (let floor = 0; floor < totalFloors; floor++) {
        sessionStorage.setItem(('meanTemp' + floor), meanTemps[floor]);
    }
    sessionStorage.setItem('totMeanTemp', mean(meanTemps));

}

//Funktion som kollar igenom sensorData-filen och returnerar en lista med alla sensorId på vald våning
//OBS: typ samma som getSensorRooms() i app.ts, hade varit snyggt att framöver skriva ihop dem till 
//en gemensam allmän funktion där man istället stoppar in vilken info man faktiskt vill få ut

function getNumberOfFloors() {
    const numberOfFloors = Object.values(sensorData.floors).length;
    sessionStorage.setItem('totalFloors', numberOfFloors);
    return numberOfFloors
}

function getSensorIds(floorNumber) {
    let sensorIds = [];
    const floors = Object.values(sensorData.floors); //array med alla våningar som objekt

    const floorArray = Object.values(floors[floorNumber]);
    const rooms = Object.values(floorArray[1]); //[0] är popularName, dvs 'Våning X', [1] rumsid
    rooms.forEach(room => {
        let sensorId = Object.values(room)[1];
        if (sensorId !== undefined) {
            sensorIds.push(sensorId);
        }

    });
    return sensorIds;
}

//Funktion som tar in ett sensorId och returnerar sensorUrl som används för att kalla på Proptech
function generateSensorUrl(sensorId) {
    return `https://vk.proptechos.com/api/sensor/${sensorId}/observation/latest`;
}

//Funktion som utifrån en array med sensorIds fixar token och kallar på getWebData för samtliga
function getAllData(floorNumber, sensorIds) {
    sensorIds.forEach(sensorId => {
        let sensorUrl = generateSensorUrl(sensorId);
        if (myMSALObj.getAccount()) {
            getTokenPopup(tokenRequest)
                .then(response => {
                    getWebData(response, sensorUrl, sensorId, floorNumber);
                }).catch(error => {
                    console.log(error);
                });
        }
    });
}

//Funktion som hämtar sensordata utifrån sensorUrl
function getWebData(response, sensorUrl, sensorId, floorNumber) {
    //Hur ska vi göra så man hämtar mer sensordata? Det som står precis under här i request säger vilken sensor.
    let myRequest = new Request(sensorUrl, {
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + response.accessToken,
        },
        mode: 'cors',
        cache: 'default',
    });

    // Testing the API for one sensor and its latest data:
    return fetch(myRequest)
        // Step 1 is to fetch the response, convert into json format
        .then(function (response) {
            return response.json();
        })
        // Find the value we look for in the last function's return value 
        // Will do this later
        .then(function (data) {
            sessionStorage.setItem('floor_' + floorNumber + '_sensorId_' + sensorId, data.value);
            return data.value
        });
}

//Funktion som beräknar medelvärde av en array
function mean(array) {
    let sum = 0;
    let values = 0;
    array.forEach(element => {
        if (element !== 'NaN') {
            //console.log("inte NaN");
            sum += parseFloat(element);
            values++;
        }
    });
    return Number(sum / values).toFixed(1); //Här kan man ändra antalet decimaler som ska visas
}

//Funktion som returnerar en array med alla temp-värden för en våning
function getTempValues(floorNumber, sensorIds) {
    let tempValues = [];
    sensorIds.forEach(sensorId => {
        tempValues.push(sessionStorage.getItem('floor_' + floorNumber + '_sensorId_' + sensorId));
    });
    return tempValues;
}

//Nån funktion Rebecca skrev som jag helt ärligt inte riktigt fattar vad den gör men jag vågar inte ta bort den :)
function insertInfo(text) {
    const p = document.createElement('p');
    p.innerText = text;
    document.querySelector('main').appendChild(p);
}