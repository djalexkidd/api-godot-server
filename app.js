////////////////////////////////
// Importation des librairies //
////////////////////////////////
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require ("bcrypt");
const cookieParser = require('cookie-parser');

//////////////////////////////
// Configuration de Express //
//////////////////////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cookieParser());

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

// Middleware pour vérifier si l'utilisateur est connecté
function ensureAuthenticated(req, res, next) {
    const token = req.cookies.token
    jwt.verify(token, process.env.SECRET, (error, decodedToken) => {
       if(error){
            res.status(403);
            res.send('Forbidden');
       }else{
            next();
       }
    })
};

///////////////////////
// Routes WWW et API //
///////////////////////

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
});

// Enregistre un score dans la BDD
app.post("/sendscore/:name", (req, res, next) => {
    knex(req.params.name).insert({
        name: req.body.name,
        score: req.body.score,
    })
    .then(() => {
        res.send("OK");
    })
    .catch(error => next(error));
});

/////////////////////////
// Routes de Connexion //
/////////////////////////

app.get("/login", async (req, res) => {
    res.render("login.ejs");
});

// Route pour la connexion
app.post("/login", (req, res, next) => {
    knex("users")
    .where({username: req.body.username})
    .first()
    .then(user => {
       if(!user){
        console.log("Failed login from " + req.body.username + " at " + req.ip);
        statusLogin = "Le nom d'utilisateur ou le mot de passe est incorrect.";
        res.redirect("/login");
       }else{
          return bcrypt
          .compare(req.body.password, user.password_digest)
          .then(isAuthenticated => {
             if(!isAuthenticated){
                console.log("Failed login from " + req.body.username + " at " + req.ip);
                statusLogin = "Le nom d'utilisateur ou le mot de passe est incorrect.";
                res.redirect("/login");
             }else{
                return jwt.sign({user}, process.env.SECRET, {expiresIn: "1h"}, (error, token) => {
                   console.log("Successful login from " + req.body.username + " at " + req.ip);
                   res.cookie("token", token);
                   res.redirect("/admin");
                })
             }
          })
       }
    })
});

// app.post("/register", (request, response, next) => {
//     bcrypt.hash(request.body.password, 10)
//     .then(hashedPassword => {
//        return knex("users").insert({
//           username: request.body.username,
//           password_digest: hashedPassword
//        })
//        .returning(["id", "username"])
//        .then(users => {
//           response.json(users[0])
//        })
//        .catch(error => next(error))
//     })
// });

////////////////////////
// Routes panel admin //
////////////////////////

// Page d'administration
app.get('/admin', ensureAuthenticated, async function(req, res) {
    res.send("Auth OK");
});

/////////////////////////////////////////////
// Écoute du serveur sur le port configuré //
/////////////////////////////////////////////
app.listen(process.env.PORT, () => console.log("Server is running on port " + process.env.PORT));