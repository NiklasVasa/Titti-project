const msalConfig = {
    auth: {
        clientId: "861a8b77-0916-4f84-9e08-c81fe1273510",
        authority: "https://login.microsoftonline.com/d4218456-670f-42ad-9f6a-885ae15b6645/",
        redirectUri: "https://vasakronanone2one.me:443/",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};
const loginRequest = {
    scopes: ["User.Read", "https://vk.proptechos.com/api/Api.Use"]
};

const tokenRequest = {
    scopes: ["https://vk.proptechos.com/api/Api.Use"],
    forceRefresh: true // Set this to "true" to skip a cached token and go to the server to get a new token
};