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
function getLeaderboard(table) {
    const result = knex.select().table(table).orderBy("score", "desc");

    return result.then(function(rows){
        return rows;
    })
};

////////////
// Routes //
////////////

// Page des classements
app.get("/web/:name", async (req, res) => {
    try {
        res.render("leaderboard.ejs", {
            scores: await getLeaderboard(req.params.name)
        });
    } catch {
        res.render("error.ejs");
    }
});

// Envoie le classement en JSON
app.get("/api/:name", async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(await getLeaderboard(req.params.name)));
})

// Enregistre un score dans la BDD
app.post("/sendscore", (req, res, next) => {
    knex("galakanoid").insert({
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