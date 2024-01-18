let User = require('../model/user');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../config');

//https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/

// Fonction d'inscription avec cryptage du mot de passe
function registerUser(req, res) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        login: req.body.login,
        password: hashedPassword,
        role: req.body.role
    },
        (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Pb utilisateur");
            }

            let token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 
            });

            res.status(200).send({ auth: true, token: token });
        });
}

// Fonction de connexion
function logInUser(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    User.findOne({ login: login }, (err, user) => {
        console.log(user);
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        if (!user) {
            console.log("Login n'existe pas");
            return res.status(404).json({ error: "Login n'existe pas" });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            console.log("Wrong password");
            return res.status(401).json({ error: "Mauvais mdp" });
        }

        let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 
        });

        res.status(200).send({ auth: true, token: token, role: user.role });

    });
}

// Récupérer le rôle de l'utilisateur (GET)
function getRole(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    User.findOne({ login: login, password: password }, (err, user) => {
        if (err) {
            console.error(err);
            return res.send(err);
        }

        if (!user) {
            return res.send("Login n'existe pas");
        }

        res.status(200).json({ role: user.role }); 
    });
}

function getUsers(req, res) {
    User.find((err, users) => {
        if (err) {
            res.send(err);
        }
        res.send(users);
    })
}


module.exports = { registerUser, logInUser, getRole, getUsers };
