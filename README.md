##Guidelines:

- The database dump is in the file: shipme.dev.sql, it must be loaded into the database database changes to yii / config / db.php - where you set the user, password, database server address

- server data - backend to which angular connects (frontend) changes into angular \ src \ app \ definitions.ts - backendUrl variable - you should enter the domain under which the server is.

- create "assets" directory in yii / web / if it's not there.



Test if angular works and connects properly to the backend

go to the backend address. eg services.transovia.com create an account, confirm email. NOTE: the email will come from a different domain - in the current version, because there is no email created yet: admin@transovia.com

you need to click the link confirming the creation of an account. when I update this readme - there is no automatic transition to angular, so enter transovia.com into the browser, log in with the username and password,

there is a test tab: the hero's name, it is used to test if everything is well connected.

after logging in, go to this tab and see if the list shows. try adding a name to it, the name should show up in the list. If it shows up, it means that everything is nice ..


