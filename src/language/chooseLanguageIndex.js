window.onload = addListeners();

function addListeners() {
    let i = 3;
    changeLangIndex(i);
    document.getElementById('changeLangBtn').addEventListener('click', function () {
        console.log('click!');
        i++;
        changeLangIndex(i);
    });
};

function changeLangIndex(i) {
    if (i % 2 == 0) {
        document.getElementsByName('city')[0].placeholder = 'Search city';
        document.getElementsByName('property')[0].placeholder = 'Search property';
        document.getElementById('searchBtn').innerHTML = 'SEARCH';
        document.getElementById('signIn').innerHTML = 'Log in';
        document.getElementById('signOut').innerHTML = 'Log out';
        document.getElementById('kandFooter').innerHTML = "A bachelor's thesis by: Rebecca Fällström, Karolina Hagerman, Tilda Myrsell & Niklas Norinder 2021";
        document.getElementById('changeLangBtn').innerHTML = 'På svenska'
        sessionStorage.setItem('loggedIn', 'Logged in as');
        sessionStorage.setItem('notLoggedIn', 'You are not logged in');
        sessionStorage.setItem('inEnglish', i);
    } else {
        document.getElementsByName('city')[0].placeholder = 'Sök stad';
        document.getElementsByName('property')[0].placeholder = 'Sök byggnad';
        document.getElementById('searchBtn').innerHTML = 'SÖK';
        document.getElementById('signIn').innerHTML = 'Logga in';
        document.getElementById('signOut').innerHTML = 'Logga ut';
        document.getElementById('kandFooter').innerHTML = "Ett kandidatarbete av: Rebecca Fällström, Karolina Hagerman, Tilda Myrsell & Niklas Norinder 2021";
        document.getElementById('changeLangBtn').innerHTML = 'In English'
        sessionStorage.setItem('loggedIn', 'Inloggad som');
        sessionStorage.setItem('notLoggedIn', 'Du är inte inloggad');
        sessionStorage.setItem('inEnglish', i);
    }
};