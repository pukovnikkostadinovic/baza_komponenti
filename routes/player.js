const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title:"Welcome to Socka | Add a new player"
            ,message: ''
        });
    },
    addPlayer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message,
                    title: "Welcome to Socka | Add a new player"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-player.ejs', {
                        message,
                        title: "Welcome to Socka | Add a new player"
                    });
                }
            }
        });
    },
addKategPage: (req, res) => {
        res.render('add-kateg.ejs', {
            title:"Dodavanje kategorije"
            ,message: ''
        });
    },
addKateg: (req, res) => {
        /*if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }*/

        let message = '';

        let ime_kategorije = req.body.ime_kateg;
        let kratak_opis = req.body.kr_opis;
        let query = "INSERT INTO `kategorije_komponenti` (ime_kategorije, kratak_opis)  VALUES ('" +
                            ime_kategorije + "', '" + kratak_opis + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
});},
 editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-player.ejs', {
                title: "Edit  Player"
                ,player: result[0]
                ,message: ''
            });
        });
    },komponentePage: (req, res) => {
        let kategId = req.params.id;
        let query = "SELECT * FROM `komponente` WHERE kateg_id = '" + kategId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('komponente.ejs', {
                title: "Komponente"
                ,komponente: result
            });
        });
    },komplokPage: (req, res) => {
        let kompId = req.params.id;
        let query = "select k.ime_komponente, l.ime_lokacije, d.kolicina from komponente k,lokacije l, komp_lok_kol d where k.id=d.komp_id and l.id=d.lok_id and k.id  = '" + kompId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('komplok.ejs', {
                title: "Komponenta lokacija"
                ,komplok: result
            });
        });
    },
editPlayer: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
        let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    },
deleteKateg: (req, res) => {
        let kategId = req.params.id;
        let deleteKategQuery = 'DELETE FROM kategorije_komponenti WHERE id = "' + kategId + '"';

                       db.query(deleteKategQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                     });
    }
};

