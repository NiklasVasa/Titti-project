# 🏘️ DIGITAL TWIN PROJECT FOR VASAKRONAN 🏘️

This is a bachelor's thesis written by
- Rebecca Fällström
- Karolina Hagerman
- Tilda Myrsell
- Niklas Norinder

Sociotechnical Systems Engineering at Uppsala University. 
Written with guidance from Georgios Fakas and Georgios Panayiotou.

## HOW TO NAVIGATE THE REPO

- ```./server.js``` server-file, also automatically updates the SQL DB, client credit flow.

- ```./app.ts```  Where a lot of the operations regarding the BIM model happens.

- ```./index.html``` the index-page.

- ```./certs/``` where the certificates for the SSL are located.

- ```./SQL/``` operations and connection to the SQL database.

- ```./data/``` contains a .json file of all the sensors and the PBI-files.

- ```./fonts/``` contains the fonts.

- ```./html/``` contains the htmls.

- ```./images/``` contains Vasakronans logo and other images used on the site.

- ```./src/authentication/``` contains the files for implicit grant flow

- ```./src/language/``` files for changing langage.

- ```./src/``` files for getting data from the ProptechOS API into the page, as well as a file for the search options. Also some sensordata-files.

- ```./stylesheets/``` stylesheets.



## CREDITS & REFERENCES


```./src/authentication/authConfig.js```
made with inspiration from https://github.com/idun-corp/Idun-Examples/tree/master/ProptechOS-Api

```./src/authentication/authPopup.js```
made with inspiration from https://github.com/Azure-Samples/ms-identity-javascript-v2

```./server.js```
made with inspiration from https://github.com/idun-corp/Idun-Examples/tree/master/ProptechOS-Api/examples/nodejs-client-credential-grant-flow

```./app.ts```
made with help from the one and only Erik Holm @ SWECO. 

also we have been all over StackOverflow.

## SPECIAL THANKS TO
 - Ulf Näslund 
 - Mathias Hellqvist 
 - Erik Holm 
 - Natalia Mazurkevych 
 - and all the other wonderful folk @ Vasakronan, SWECO and IDUN who helped us with this project. 

## SECURITY

To be able to use this code, you will need an Microsoft-account at Vasakronan, and all the right accesses to RITA & PBI.
As well as some passphrases, certificates and client-secrets we've redacted from the code.

Since this code is in a new repo and not the original due to security reasons, here are some screenshots of the original commit-history:

![Commits 3](https://user-images.githubusercontent.com/81626057/119350136-44801a00-bc9f-11eb-979e-b320c5c09d91.png)
![Commits 2](https://user-images.githubusercontent.com/81626057/119350134-42b65680-bc9f-11eb-9798-a76563e39ddb.png)
![Commits 1](https://user-images.githubusercontent.com/81626057/119350124-3fbb6600-bc9f-11eb-916a-196256571af9.png)

## CONTACT

Please reach out to me if you have any Qs -> niklas.norinder.4686@student.uu.se
