////////////////////////////////
// Importation des librairies //
////////////////////////////////
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

//////////////////////////////
// Configuration de Express //
//////////////////////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

/////////////////////////////////////////
// Configuration de la base de données //
/////////////////////////////////////////
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : process.env.DATABASE_HOST,
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE_NAME
    }
});

///////////////
// Fonctions //
///////////////
function getLeaderboard() {
    const result = knex.select().table("leaderboard").orderBy("score", "desc");

    return result.then(function(rows){
        return rows;
    })
};

////////////
// Routes //
////////////

// Page des classements
app.get("/", async (req, res) => {
    res.render("leaderboard.ejs", {
        scores: await getLeaderboard()
    });
});

// Envoie le classement en JSON
app.get("/api", async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(await getLeaderboard()));
})

// Enregistre un score dans la BDD
app.post("/sendscore", (req, res, next) => {
    knex("leaderboard").insert({
        name: req.body.name,
        score: req.body.score,
    })
    .then(() => {
        res.send("OK");
    })
    .catch(error => next(error));
});

/////////////////////////////////////////////
// Écoute du serveur sur le port configuré //
/////////////////////////////////////////////
app.listen(process.env.PORT, () => console.log("Server is running on port " + process.env.PORT));