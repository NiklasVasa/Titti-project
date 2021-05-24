const myMSALObj = new Msal.UserAgentApplication(msalConfig);

//funktion för att logga in. Skapar själva popupen och använder loginResponse som finns i authConfig-filen.
function signIn() {
  myMSALObj.loginPopup(loginRequest)
    .then(loginResponse => {
      console.log(myMSALObj.getAccount());
      console.log("id_token acquired at: " + new Date().toString());
      console.log(loginResponse);
      if (myMSALObj.getAccount()) {
        sessionStorage.setItem('myMSALObj', myMSALObj);
        sessionStorage.setItem('userName', loginResponse.account.name);
        loggedInChecker(myMSALObj.getAccount());
      }
    }).catch(error => {
      console.log(error);
    });
}

//Funderar på att ta bort denna funktionen, då sessionStorage ändå kommer rensas och man inte riktigt kommer behöva logga ut.
function signOut() {
  myMSALObj.logout();
}

//Här hämtas accessToken tyst. Om det misslyckas blir man tvingad att logga in igen. Då används tokenResponse, som
//också finns i authConfig-filen. 
function getTokenPopup(request) {
  //console.log(myMSALObj.acquireTokenSilent(request));
  return myMSALObj.acquireTokenSilent(request)
    .catch(error => {
      console.log(error);
      console.log("silent token acquisition fails. acquiring token using popup");

      // fallback to interaction when silent call fails
      return myMSALObj.acquireTokenPopup(request)
        .then(tokenResponse => {
          console.log(tokenResponse);
          return tokenResponse;
        }).catch(error => {
          console.log(error);
        });
    });
}