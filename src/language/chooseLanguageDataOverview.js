window.onload = changeLangDataOverview();

function changeLangDataOverview() {
    let i = sessionStorage.getItem('inEnglish');
    if (i % 2 == 0) {
        document.getElementsByName('city')[0].placeholder = 'Search city';
        document.getElementsByName('property')[0].placeholder = 'Search property';
        document.getElementById('searchBtn').innerHTML = 'SEARCH';
        document.getElementById('signIn').innerHTML = 'Log in';
        document.getElementById('signOut').innerHTML = `Logged in as <br> ${sessionStorage.userName}`;
        document.getElementById('signOut').dataset.hover = `Log out`;
        document.getElementById('parametrar').innerHTML = 'Parameters';
        document.getElementById('temperatur').innerHTML = 'Temperature';
        document.getElementById('koldioxid').innerHTML = 'Carbon dioxide';
        document.getElementById('kandFooter').innerHTML = "A bachelor's thesis by: Rebecca Fällström, Karolina Hagerman, Tilda Myrsell & Niklas Norinder 2021";
        sessionStorage.setItem('loggedIn', 'Logged in as');
        sessionStorage.setItem('notLoggedIn', 'You are not logged in');
    } else {
        document.getElementsByName('city')[0].placeholder = 'Sök stad';
        document.getElementsByName('property')[0].placeholder = 'Sök byggnad';
        document.getElementById('searchBtn').innerHTML = 'SÖK';
        document.getElementById('signIn').innerHTML = 'Logga in';
        document.getElementById('signOut').innerHTML = `Inloggad som <br> ${sessionStorage.userName}`;
        document.getElementById('signOut').dataset.hover = `Logga ut`;
        document.getElementById('parametrar').innerHTML = 'Parametrar';
        document.getElementById('temperatur').innerHTML = 'Temperatur';
        document.getElementById('koldioxid').innerHTML = 'Koldioxid';
        document.getElementById('kandFooter').innerHTML = 'Ett kandidatarbete av: Rebecca Fällström, Karolina Hagerman, Tilda Myrsell & Niklas Norinder 2021';
        sessionStorage.setItem('loggedIn', 'Inloggad som');
        sessionStorage.setItem('notLoggedIn', 'Du är inte inloggad');
    }
};