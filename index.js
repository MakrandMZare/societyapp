const express = require("express");
const { google } = require("googleapis");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/", async (req, res) => {
    const { name, mobile_no, email, amount, transaction_id, date } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

//Create client instance for auth
const client = await auth.getClient();


//Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });

const spreadsheetId = "1uhSOdkb6Zz7DceSoEm4Tlc5c0e4KGD6zlzCLd0ABSuk";

//Get metadata about spreadsheet
const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
})

//Read rows from spreadsheet
const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "BankCredit",
})

await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "BankCredit!A:G",
    valueInputOption: "USER_ENTERED",
    resource: {
        values: [[name, mobile_no, email, amount, transaction_id, date]],
    },
});

res.send("successfully submitted! Thank you!");

});

app.listen(2000, (req, res) => console.log("running on 2000"));