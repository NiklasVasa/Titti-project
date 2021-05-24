const signInButton = document.getElementById("signIn");
const signOutButton = document.getElementById('signOut');

window.onload = loggedInChecker();

function loggedInChecker() {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (sessionStorage.userName != null) {
        dispUserNameDiv.innerHTML = `${loggedIn} <br> ${sessionStorage.userName}`;
        signInButton.classList.add('d-none');
        signOutButton.classList.remove('d-none');
    }
}

window.onload = loggedInChecker();