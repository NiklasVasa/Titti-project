//Dessa ska senare inte skrivas in manuellt här utan istället ska det hämtas data som sen skickas in
const cities = {
    "Stockholm": "ID0",
    // "Stad1": "ID1",
    // "Stad2": "ID2",
    // "Stad3": "ID3",
    // "Stad4": "ID4",
}

const properties = {
    "Skjutsgossen 8": "ID0", 
    // "Hus1": "ID1",
    // "Hus2": "ID2",
    // "Hus3": "ID3",
    // "Hus4": "ID4"
}

createSearchOptions("city", cities);
createSearchOptions("property", properties);

//Funktion som skapar sökalternativ i dropdown-menyer utifrån kategori och objekt med namn och id.
//Om du vill lägga till en ny sökmeny, se till att skapa en datalist med id="kategori"List i html-filen
function createSearchOptions(category, myObject) {
    const parentList = document.querySelector(`#${category}List`);
    Object.entries(myObject).forEach(entry => {
        const [name, ID] = entry;
        let newOption = document.createElement("option");
        newOption.innerHTML = `${ID}`;
        parentList?.appendChild(newOption);
        newOption.setAttribute("value", `${name}`);
    });
}