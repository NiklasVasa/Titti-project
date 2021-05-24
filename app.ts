import { BimApi, BimApiClient, BimApiLoadOptionsFactory, BimIfcDoor, BimTwinfinityApiClient, PickOptionType } from '@sweco-ps/embedded';
import { sensorData } from './src/sensorData';

//Här väljer du vilket hus du tittar på, hemsideadressen kopieras från RITA. "bim." måste vara med i början!
const ritaAddress = 'https://bim.rita.vasakronan.se/sites/archive/OriginalArchive/631%20001';
const compNameAdress = 'https://bim.rita.vasakronan.se'
const url = new URL(ritaAddress);
const client: BimApiClient = new BimTwinfinityApiClient(new URL(compNameAdress));
let floor: number = -1;
let showSensorList: boolean = false;
sessionStorage.setItem('currentFloor', JSON.stringify(floor));
const totalFloors: any = sessionStorage.getItem("totalFloors");
const [litteras, sensorIds] = getSensorRooms(); //har tidigare haft i init() och i loadfloor()

async function init(): Promise<void> {
    const api = await BimApi.create('viewer-container', client);
    api.setBackgroundColor([255, 255, 255,]);
    api.axes = false;
    api.isSkyboxEnabled = false;
    api.grid.isEnabled = true;

    clickRoom(api);
    loadFloor(api, floor);


    initGradientTemp(api);
    createFloorButtons(totalFloors); //än så länge har vi inte hämtat in datan, så skickar in manuellt
    createFloorButtonListeners(api);
    createSensorListListener();
};

/* =========================================== FUNKTIONER =========================================== */


function getTotalFloors() {
    const numberOfFloors = Object.values(sensorData.floors).length;
    return numberOfFloors
}

//Funktion som laddar våningarna som ska visas
async function loadFloor(api: BimApi, floor: number) {
    showSensorList = false;

    if (floor == -1) {
        await api.setContainer(url, BimApiLoadOptionsFactory.all());
        setRoofColor(api);
    }
    else {
        const bottomFloor = api.ifc.floors.reverse()[floor];
        api.foreach((object) => {
            object.visible(object.enclosingFloor === bottomFloor);
        });
        api.ifc.spaces.forEach((space) => {
            space.visible(space?.spaceType === 'ROOM' && space.enclosingFloor === bottomFloor);
        });

        removeRoof(api);

    };
    showMeanTemp(floor);
    showAllSpace(api);
    getFloorSensors(floor);
    litteraColorLoop(api, floor);         //här färgas samtliga rum med sensorer efter latest temp

    await api.applyVisualChanges();
};

/* ====================================
    FUNKTIONER FÖR SENSORLISTAN         */

//Funktion som tar fram alla sensorer (sensorIds och litteras) med tillhörande latest temp för en våning och displayar
function getFloorSensors(floorNumber: number) {
    let latestTemp: number;
    createSensorList();
    let sensorCounter: number = 0;

    for (let idx = 0; idx < litteras.length; idx++) {
        if (!(floorNumber === -1)) {
            latestTemp = Number(getRoomTemp(floorNumber, sensorIds[idx]).toFixed(1));
            if (sessionStorage.getItem('floor_' + floorNumber + '_sensorId_' + sensorIds[idx])) {
                sensorCounter++;

                addToSensorList(sensorIds[idx], litteras[idx], latestTemp, sensorCounter);
            }
        }
        else {
            /*  För översikten, floor=-1, måste vi just nu kolla alla lagrade värden i sessionStorage med varje våning.
                Inte optimal lösning, men det kan vi titta mer på senare.   */
            for (let floor = 0; floor < totalFloors; floor++) {
                latestTemp = Number(getRoomTemp(floor, sensorIds[idx]).toFixed(1));
                if (sessionStorage.getItem('floor_' + floor + '_sensorId_' + sensorIds[idx])) {
                    sensorCounter++;
                    addToSensorList(sensorIds[idx], litteras[idx], latestTemp, sensorCounter);
                }

            }
        }

    }
    if (!(document.querySelector('.sensorListItem'))) {
        noSensors();
    }
    sessionStorage.setItem('sensorCounter', JSON.stringify(sensorCounter));
    let numberOfSensors = sessionStorage.getItem('sensorCounter');
    console.log(numberOfSensors, 'TEST HÄR NU')
    let sensorNrButton: any = document.querySelector('#sensorListHeading');
    let i: any = sessionStorage.getItem('inEnglish');
    if (i % 2 == 0) {
        sensorNrButton.innerHTML = `<p>List of sensors (${numberOfSensors})</p>`;
    }
    else {
        sensorNrButton.innerHTML = `<p>Sensorlista (${numberOfSensors})</p>`;
    }

}

//Funktion som skapar eventlistener för sensorList-knappen
function createSensorListListener() {
    const visibilityButton = document.querySelector('.viewerMenuHeading');
    visibilityButton?.addEventListener('click', changeVisibility);
};

//Funktion som ändrar synligheten på sensorList
function changeVisibility() {
    const sensorList: any = document.querySelector('#sensorList');
    if (showSensorList) {
        showSensorList = false;
        sensorList.classList.remove('showTemp');
        sensorList.setAttribute('class', 'hideTemp');
    }
    else {
        showSensorList = true;
        sensorList.classList.remove('hideTemp');
        sensorList.setAttribute('class', 'showTemp');
    }
    return showSensorList;
};

//Funktion som clearar och skapar ny sensorList 
function createSensorList() {
    let oldSensorList = document.querySelector('#sensorList');
    if (oldSensorList) {
        oldSensorList.remove();
    }
    const sensorInfoDiv = document.querySelector(".sensorInfo");
    let sensorList = document.createElement('ul');
    sensorList.setAttribute('id', 'sensorList');
    sensorList.setAttribute('class', 'hidetemp');
    sensorInfoDiv?.appendChild(sensorList);
}

//Funktion som lägger till ett li-element för varje sensor
function addToSensorList(sensorId: string, littera: string, latestTemp: number, sensorNumber: number): void {
    const tooColdText = sessionStorage.getItem('sensListTooCold');
    const tooHotText = sessionStorage.getItem('sensListTooHot');
    const floorText = sessionStorage.getItem('floorText');
    const temp = sessionStorage.getItem('listTemp');
    const maxTemp = Number(sessionStorage.getItem('maxTemp'));
    const minTemp = Number(sessionStorage.getItem('minTemp'));
    const sensorList = document.querySelector("#sensorList");

    let listElement = document.createElement("li");
    listElement.classList.add('sensorListItem', `littera${littera}`);
    listElement.setAttribute('id', sensorId);
    if (latestTemp < minTemp) {
        listElement.innerHTML = `${sensorNumber}. ${floorText} ${littera[0]}: ${littera}, <p class="newLineSensList">${temp}: ${latestTemp}°C <span class='tooCold'>${tooColdText}<span><p>`;
    }
    else if (latestTemp > maxTemp) {
        listElement.innerHTML = `${sensorNumber}. ${floorText} ${littera[0]}: ${littera},  <p class="newLineSensList">${temp}: ${latestTemp}°C <span class='tooHot'>${tooHotText}<span><p>`;
    }
    else {
        listElement.innerHTML = `${sensorNumber}. ${floorText} ${littera[0]}: ${littera},  <p class="newLineSensList">${temp}: ${latestTemp}°C<p>`;
    }
    sensorList?.appendChild(listElement);
}

//Funktion som displayar att det saknar sensorer i sensorList
function noSensors() {
    const noSensorsText = sessionStorage.getItem('noSensors');
    const sensorList = document.querySelector("#sensorList");
    let noSensors = document.createElement("li");
    noSensors.setAttribute('class', 'sensorListItem');
    noSensors.innerHTML = `${noSensorsText}`;
    sensorList?.appendChild(noSensors);
}

/*  SLUT PÅ FUNKTIONER FÖR SENSORLISTAN
    =====================================   */

/* ======================================
    FUNKTIONER KLICK I BIM                   */

//Funktion som anger vad som ska ske när man klickar på någonting i BIM.
//if: om det är ett rum, else: annars
function clickRoom(api: BimApi): void {
    api.on("click", (object) => {
        let littera: any = object?.product.properties.data.BIP.spacenumber;

        //Reset av tidigare klick
        sessionStorage.removeItem('clickedRoomLittera');
        litteraColorLoop(api, Number(sessionStorage.getItem('currentFloor')));
        resetSensorHighlight(); //

        litteras.forEach(sensorLittera => {
            if (littera == sensorLittera) {
                sessionStorage.setItem('clickedRoomLittera', littera);
                highlightSensor(littera);
                object?.product.setColor([245, 233, 131, 255]);
                if (!showSensorList) {
                    changeVisibility();
                }
            }
        });
        api.applyVisualChanges();
    });
}

//Funktion som highlightar den senast klickade sensorn på sensorList och returnerar dess id
function highlightSensor(littera: string): string {
    const sensorListItems = document.querySelectorAll('.sensorListitem');
    let sensorId: string = '';
    sensorListItems.forEach(listItem => {
        if (listItem.classList.contains(`littera${littera}`)) {
            listItem.classList.add('clickedRoom');
            sensorId = listItem.id;
        }
    });
    return sensorId;
}

//Funktion om återställer till ej highlight på sensor i listan
function resetSensorHighlight() {
    const sensorListItems = document.querySelectorAll('.sensorListitem');
    sensorListItems.forEach(listItem => {
        if (listItem.classList.contains('clickedRoom')) {
            listItem.classList.remove('clickedRoom');
        }
    });
}

/*  SLUT PÅ FUNKTIONER FÖR KLICK I BIM
    =====================================   */

//Funktion som visar medeltemperatur i temperaturknappen
function showMeanTemp(floor: number) {
    let meanTempStr: any;
    let meanTemp: any;
    let noTemp: any = sessionStorage.getItem('noTemp');
    let yesTemp: any = sessionStorage.getItem('yesTemp');
    let tempButton: any = document.querySelector('#tempButton');

    if (floor === -1) {
        meanTempStr = sessionStorage.getItem("totMeanTemp");
    }
    else {
        meanTempStr = sessionStorage.getItem(('meanTemp' + floor));
    }
    meanTemp = +meanTempStr;

    if (Number.isNaN(meanTemp)) {
        tempButton.innerHTML = `${noTemp}`;
    }
    else {
        tempButton.innerHTML = `<p>${yesTemp} </br> ${meanTemp} °C</p>`;
    }
}

//Funktion som skapar alla våningsknappar utifrån antalet våningar i huset
function createFloorButtons(floors: number): void {
    const floorMenu = document.querySelector("#all-floors");
    const floorText = sessionStorage.getItem('floorText');
    const OVText = sessionStorage.getItem('OVText');
    for (let floor: number = -1; floor < floors; floor++) {
        let listElement = document.createElement("li");
        let floorButton = document.createElement("button");
        if (floor == -1) {
            floorButton.innerHTML = `${OVText}`;
        }
        else {
            floorButton.innerHTML = ` ${floorText} ${floor}`;
        }
        listElement?.appendChild(floorButton);
        floorMenu?.appendChild(listElement);
        floorButton.setAttribute("class", "floorBtn");
    }
}

//Funktion som hämtar våningsknappar och gör så att våningen byts när vi klickar
function createFloorButtonListeners(api: BimApi): void {
    const floorButtons = document.querySelectorAll('.floorBtn');
    floorButtons.forEach(button => {
        const floor = Array.prototype.indexOf.call(floorButtons, button) - 1; //idx i arrayen = våning + 1, pga -1 är översikt
        button.addEventListener("click", function () {
            sessionStorage.setItem('currentFloor', JSON.stringify(floor));
            loadFloor(api, floor);
        });
    });
}

//Funktion som tar bort den gröna färgen från space
async function showAllSpace(api: BimApi) {
    api.foreach((object => {
        if (object.class.type === 'space') {
            object.setColor([255, 255, 255, 1]);
        }
    }));
}

//Funktion som färgar taket mörkblått
async function setRoofColor(api: BimApi) {
    api.foreach((object => {
        if (object.class.type === 'roof') {
            object.setColor([0, 11, 61, 255]);
        }
    }));
}

//Funktion som tar bort taket
async function removeRoof(api: BimApi) {
    api.foreach((object => {
        if (object.class.type === 'roof') {
            object.setColor([255, 255, 255, 0]);
        }
    }));
}

//Funktion som utifrån dataobjekt returnerar en lista med samtliga littera för de rum med sensorer
//OBS: typ samma som getSensorIds() i getDataProptecj.js, hade varit snyggt att framöver skriva ihop dem till 
//en gemensam allmän funktion där man istället stoppar in vilken info man faktiskt vill få ut
//TO DO: skriv om denna med input våningsnummber så att vi kan ta våning för våning
function getSensorRooms(): string[][] {
    const floors = Object.values(sensorData.floors); //array med alla våningar som objekt
    let litteraList: string[] = [];
    let sensorIdList: string[] = [];
    let littera: string;
    let sensorId: string;

    floors.forEach(floor => {
        const floorArray = Object.values(floor);
        const rooms = Object.values(floorArray[1]); //[0] är popularName, dvs 'Våning X', [1] rumsid
        rooms.forEach(room => {
            littera = Object.values(room)[0];
            sensorId = Object.values(room)[1];
            if (littera !== undefined) {
                litteraList.push(littera);
            }
            if (sensorId !== undefined) {
                sensorIdList.push(sensorId);
            }
        });

    });
    return [litteraList, sensorIdList];
}

//Funktion som utifrån en array med litteras och anropar vidare för samtliga 
function litteraColorLoop(api: BimApi, floorNumber: number): void {
    for (let sensorIdx = 0; sensorIdx < litteras.length; sensorIdx++) {
        colorRoomTemp(api, litteras[sensorIdx], sensorIds[sensorIdx], floorNumber);
    }
}

//Funktion som loopar över alla spaces och färgar det som matchar sitt spacenumber med input littera
function colorRoomTemp(api: BimApi, littera: string, sensorId: string, floorNumber: number): void {
    api.loadPropertySets();
    const rooms = api.ifc.spaces.filter((space) => space.properties.data.BIP.spacetype === 'ROOM');

    //console.dir(rooms);
    rooms.forEach((room) => {
        if (room.properties.data.BIP.spacenumber === littera) {
            let roomTemp: number = getRoomTemp(floorNumber, sensorId);
            let tempColor = findTempColor(roomTemp);
            room.setColor(tempColor);
        }
    });
}

//Funktion som hämtar hem rätt temperatur
function getRoomTemp(floorNumber: number, sensorId: string): number {
    let latestTempStr: any = sessionStorage.getItem('floor_' + floorNumber + '_sensorId_' + sensorId);
    let latestTemp: any = +latestTempStr;
    return latestTemp;
}


//Funktion som utifrån given temperatur ger vilken färg som ska användas
function findTempColor(temp: number): number[] {
    const tempLimit0 = Number(sessionStorage.getItem('tempLimit0'));
    const tempLimit1 = Number(sessionStorage.getItem('tempLimit1'));
    const tempLimit2 = Number(sessionStorage.getItem('tempLimit2'));
    const tempLimit3 = Number(sessionStorage.getItem('tempLimit3'));
    const tempLimit4 = Number(sessionStorage.getItem('tempLimit4'));
    const tempLimit5 = Number(sessionStorage.getItem('tempLimit5'));


    let rgb: number[];

    if (temp > tempLimit5) {
        //rgb = [206, 35, 39, 255];
        rgb = [255, 80, 57, 255];
    }
    else if (temp > tempLimit4 && temp <= tempLimit5) {
        //rgb = [46, 116, 43, 255];
        rgb = [114, 186, 118, 255];
    }
    else if (temp > tempLimit3 && temp <= tempLimit4) {
        //rgb = [0, 156, 26, 255];
        rgb = [120, 196, 125, 255];
    }
    else if (temp > tempLimit2 && temp <= tempLimit3) {
        //rgb = [34, 182, 0, 255];
        rgb = [126, 207, 131, 255];
    }
    else if (temp > tempLimit1 && temp <= tempLimit2) {
        //rgb = [38, 204, 0, 255];
        rgb = [131, 214, 136, 255];
    }
    else if (temp > tempLimit0 && temp <= tempLimit1) {
        //rgb = [123, 227, 130, 255];
        rgb = [135, 221, 141, 255];
    }
    else {
        rgb = [0, 20, 204, 255];
    };
    return rgb;
}

/*  ====================================================
    FUNKTIONER FÖR DISPLAY AV TEMPERATURFÄRGER  */

//Funktion som sätter default-värden för temperaturintervall
function setDefaultTemps(limits: number) {
    const [minTemp, maxTemp] = setTempDatemode();

    sessionStorage.setItem('minTemp', JSON.stringify(minTemp));
    sessionStorage.setItem('maxTemp', JSON.stringify(maxTemp));

    let tempLimits = calcColorTempLimits(minTemp, maxTemp, limits);
    for (let i = 0; i < limits; i++) {
        sessionStorage.setItem('tempLimit' + i, JSON.stringify(tempLimits[i]));
    }
}

//Funktion som väljer default temp utifrån vinter/sommar
function setTempDatemode(): number[] {
    const today: Date = new Date();
    const month = today.getMonth();
    let minTemp: number;
    let maxTemp: number;

    //sommar juni-augusti
    if (month >= 5 && month <= 7) {
        minTemp = 23;
        maxTemp = 25;
    }
    //vinter sep-maj
    else {
        minTemp = 21;
        maxTemp = 23;
    }
    return [minTemp, maxTemp];
}

//Funktion som sparar ner input för önskade temperaturer
function getGoalTempInput(): string[] {
    const minTempStr: any = document.querySelector('#minField');
    const maxTempStr: any = document.querySelector('#maxField');

    if (!(minTempStr.value != '' && maxTempStr.value != '')) {
        console.log("Skriv in ett temperaturintervall och försök igen!")
    }
    //console.log('min',typeof(minTemp),minTemp,'max',typeof(maxTemp),maxTemp);
    return [minTempStr.value, maxTempStr.value];
}

//Funktion som sparar ner önskade temperaturer i sessionStorage
function getGoalTempVal(minTemp: string, maxTemp: string): number[] {
    if (minTemp != '' && maxTemp != '') {
        sessionStorage.setItem('minTemp', minTemp);
        sessionStorage.setItem('maxTemp', maxTemp);
        return [+minTemp, +maxTemp];
    }
    else {
        return setTempDatemode();
    }
}

//Funktion som beräknar temperaturgränserna utifrån eget temperaturintervall
function calcColorTempLimits(minTemp: number, maxTemp: number, limits: number): number[] {
    const stepLength: number = (maxTemp - minTemp) / (limits - 1);
    let tempLimits: number[] = [];

    let tempLimit = minTemp;
    for (let i = 0; i < limits; i++) {
        sessionStorage.setItem('tempLimit' + i, JSON.stringify(tempLimit));
        tempLimits.push(tempLimit);
        tempLimit = tempLimit + stepLength;
    }
    return tempLimits;
}

//Funktion som rensar paletten på tempcolordivs
function clearTempColorPalette() {
    let gradientTempDiv: any = document.querySelector('div#gradientTemp');
    while (gradientTempDiv.hasChildNodes()) {
        gradientTempDiv.removeChild(gradientTempDiv.lastChild);
    }
}

//Funktion som skapar temperaturskalan med valda eller default-värden
function createTempColorDivs(tempLimits: number[], divs: number) {
    const gradientTempDiv = document.querySelector('div#gradientTemp');
    let tempDiv;

    for (let divNumber = 0; divNumber < divs; divNumber++) {
        tempDiv = document.createElement("div");
        tempDiv.setAttribute('class', 'colorDisp');
        tempDiv.setAttribute('id', 'tempColor' + divNumber)

        if (divNumber == 0) {
            tempDiv.innerHTML = `&lt ${sessionStorage.getItem('minTemp')}`;
        }
        else if (divNumber == (divs - 1)) {
            tempDiv.innerHTML = `&gt ${sessionStorage.getItem('maxTemp')}`;
        }
        else {
            let first = Number(sessionStorage.getItem('tempLimit' + divNumber)).toFixed(1);
            let second = Number(sessionStorage.getItem('tempLimit' + (divNumber + 1))).toFixed(1);

            tempDiv.innerHTML = `${first}-${second}`;
        }

        gradientTempDiv?.appendChild(tempDiv);
    }
}

//Funktion som initialiserar temperaturskalan
function initGradientTemp(api: BimApi) {
    const divs: number = 7;
    const limits: number = divs - 1;
    subTempBtnListener(api, divs, limits);
    setDefaultTemps(divs);
    createTempColorDivs([20, 21, 22, 23, 24, 25], divs);
}

//Funktion som lyssnar på event från knappen "Välj önskad temperatur"
function subTempBtnListener(api: BimApi, divs: number, limits: number) {
    const subBtn = document.querySelector('#subButton');
    subBtn?.addEventListener('click', function () {
        const [minTempStr, maxTempStr]: string[] = getGoalTempInput();
        const [minTemp, maxTemp]: number[] = getGoalTempVal(minTempStr, maxTempStr);
        const tempLimits: number[] = calcColorTempLimits(minTemp, maxTemp, limits);
        clearTempColorPalette();
        createTempColorDivs(tempLimits, divs);
        loadFloor(api, Number(sessionStorage.getItem('currentFloor')));
    });
}

//Funktion som körs när man klickar på knappen "Välj önskad"

/*  SLUT PÅ FUNKTIONER FÖR DISPLAY AV TEMPERATURFÄRGER
    =================================================== */

window.addEventListener('DOMContentLoaded', init);






