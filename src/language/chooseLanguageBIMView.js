window.onload = changeLangBIM();

function changeLangBIM() {
    let i = sessionStorage.getItem('inEnglish');
    if (i % 2 == 0) {
        document.getElementsByName('city')[0].placeholder = 'Search city';
        document.getElementsByName('property')[0].placeholder = 'Search property';
        document.getElementById('searchBtn').innerHTML = 'SEARCH';
        document.getElementById('signIn').innerHTML = 'Log in';
        document.getElementById('signOut').innerHTML = `Logged in as <br> ${sessionStorage.userName}`;
        document.getElementById('signOut').dataset.hover = `Log out`;
        document.getElementById('koldioxid').innerHTML = 'Carbon dioxide<span class="popuptextCO2" id="myPopupCO2"><p>Coming soon! This website is still under developement and new features will be added incrementally.</p></span>';
        document.getElementById('ovrigt').innerHTML = 'Other';
        document.getElementById('tempViewText').innerHTML = 'Legend, temperature in °C';
        document.getElementById('setIntervalText').innerHTML = 'Choose intervall for desired temperature';
        document.getElementById('kandFooter').innerHTML = "A bachelor's thesis by: Rebecca Fällström, Karolina Hagerman, Tilda Myrsell & Niklas Norinder 2021";
        document.getElementById('toReport').innerHTML = 'To report';
        document.getElementsByName('maxValField')[0].placeholder = 'Highest temperature';
        document.getElementsByName('minValField')[0].placeholder = 'Lowest temperature';
        document.getElementById('subButton').innerHTML = 'Set';
        sessionStorage.setItem('noTemp', 'No temperature data');
        sessionStorage.setItem('yesTemp', 'Average <br> temperature');
        sessionStorage.setItem('listTemp', 'Temperature');
        sessionStorage.setItem('floorText', ' Floor');
        sessionStorage.setItem('OVText', 'Overview');
        sessionStorage.setItem('noSensors', 'There are no sensors to display.');
        sessionStorage.setItem('loggedIn', 'Logged in as');
        sessionStorage.setItem('notLoggedIn', 'You are not logged in');
        sessionStorage.setItem('sensListTooCold', 'Too cold');
        sessionStorage.setItem('sensListTooHot', 'Too hot');
    } else {
        document.getElementsByName('city')[0].placeholder = 'Sök stad';
        document.getElementsByName('property')[0].placeholder = 'Sök byggnad';
        document.getElementById('searchBtn').innerHTML = 'SÖK';
        document.getElementById('signIn').innerHTML = 'Logga in';
        document.getElementById('signOut').innerHTML = `Inloggad som <br> ${sessionStorage.userName}`;
        document.getElementById('signOut').dataset.hover = `Logga ut`;
        document.getElementById('koldioxid').innerHTML = 'Koldioxid<span class="popuptextCO2" id="myPopupCO2"><p>Kommer snart! Hemsidan är under utvcekling och snart kommer nya funktioner.</p></span>';
        document.getElementById('ovrigt').innerHTML = 'Övrigt';
        document.getElementById('tempViewText').innerHTML = 'Teckenförklaring, temperatur i °C';
        document.getElementById('kandFooter').innerHTML = 'Ett kandidatarbete av: Rebecca Fällström, Karolina Hagerman, Tilda Myrsell & Niklas Norinder 2021';
        document.getElementById('toReport').innerHTML = 'Till rapport';
        document.getElementsByName('maxValField')[0].placeholder = 'Högsta temperatur';
        document.getElementsByName('minValField')[0].placeholder = 'Lägsta temperatur';
        document.getElementById('subButton').innerHTML = 'Välj';
        sessionStorage.setItem('noTemp', 'Ingen temperaturdata att visa');
        sessionStorage.setItem('yesTemp', 'Genomsnittlig <br> temperatur');
        sessionStorage.setItem('listTemp', 'Temperatur');
        sessionStorage.setItem('floorText', ' Våning');
        sessionStorage.setItem('OVText', 'Översikt');
        sessionStorage.setItem('noSensors', 'Det finns inga sensorer att visa.');
        sessionStorage.setItem('loggedIn', 'Inloggad som');
        sessionStorage.setItem('notLoggedIn', 'Du är inte inloggad');
        sessionStorage.setItem('sensListTooCold', 'För kallt');
        sessionStorage.setItem('sensListTooHot', 'För varmt');
    };

};