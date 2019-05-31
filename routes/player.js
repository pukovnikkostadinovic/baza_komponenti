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
});
},
addKompPage: (req, res) => {
        let query="select * from kategorije_komponenti;";

	db.query(query,(err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
	res.render('dodaj-komp.ejs', {
            title:"Dodaj Komponentu"
            ,message: '',
	    kategorije:results
        });
	});        
    },
addKomp: (req, res) => {
        let message = '';
        let ime_komp = req.body.ime_komp;
        let kratak_opis = req.body.kr_op;
        let kategorija = req.body.kategorija;

        let query = "INSERT INTO `komponente` (ime_komponente,kateg_id, kratak_opis_komp) VALUES ('" +
                            ime_komp + "', '" + kategorija + "', '" + kratak_opis + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
             });
    },
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
    },editKategPage: (req, res) => {
        let kategId = req.params.id;
	//console.log(kategId);
        let query = "SELECT * FROM `kategorije_komponenti` WHERE id = '" + kategId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-kateg.ejs', {
                title: "Izmjeni Kategoriju"
                ,kategorija: result[0]
                ,message: ''
            });
        });
    },
editKateg: (req, res) => {
        let kategId = req.params.id;
        let ime_kategorije = req.body.ime_kat;
        let kratak_opis = req.body.kr_op;

        let query = "UPDATE `kategorije_komponenti` SET `ime_kategorije` = '" + ime_kategorije + "', `kratak_opis` = '" + kratak_opis + "' WHERE `kategorije_komponenti`.`id` = '" + kategId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
editKompPage: (req,res)=>{
	let kompId=req.params.id;
	let query = "SELECT * FROM `komponente` WHERE id = '" + kompId + "';select * from kategorije_komponenti; ";
	db.query(query, (err, result,fields) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-komp.ejs', {
                title: "Izmjeni Komponentu"
                ,komponenta: result[0][0],
		kategorije:result[1]
            });
        });
},editKomp: (req, res) => {
        let kompId = req.params.id;
        let ime_komponente = req.body.ime_komp;
        let kategorija = req.body.kategorija;
	let kr_opis = req.body.kr_op;
	console.log(kategorija);
        let query = "UPDATE `komponente` SET `ime_komponente` = '" + ime_komponente + "', `kratak_opis_komp` = '" + kr_opis + "', `kateg_id` = '" + kategorija + "' WHERE `id` = '" + kompId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
komponentePage: (req, res) => {
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
        let query = "select d.id, k.ime_komponente, l.ime_lokacije, d.kolicina from komponente k,lokacije l, komp_lok_kol d where k.id=d.komp_id and l.id=d.lok_id and k.id  = '" + kompId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('komplok.ejs', {
                title: "Komponenta lokacija"
                ,komplok: result,
		kid:kompId
            });
        });
    },
editKompLokPage: (req, res) => {
        let komp_lokid = req.params.id;
                let query = "select d.id, d.lok_id,k.ime_komponente, l.ime_lokacije, d.kolicina from komponente k,lokacije l, komp_lok_kol d where k.id=d.komp_id and l.id=d.lok_id and d.id  = '" + komp_lokid + "';select * from lokacije; ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-komp-lok.ejs', {
                title: "Izmjeni Lokaciju i količinu"
                ,lok_kol: result[0][0]
		,lokacije:result[1]
                ,message: ''
            });
        });
    },
editKompLok: (req, res) => {
        let kategId = req.params.id;
        let ime_kategorije = req.body.ime_kat;
        let kratak_opis = req.body.kr_op;

        let query = "UPDATE `kategorije_komponenti` SET `ime_kategorije` = '" + ime_kategorije + "', `kratak_opis` = '" + kratak_opis + "' WHERE `kategorije_komponenti`.`id` = '" + kategId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
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
    },
deleteKomp: (req, res) => {
        let kompId = req.params.id;
        let deleteKompQuery = 'DELETE FROM komponente WHERE id = "' + kompId + '"';

                       db.query(deleteKompQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                     });
    },
addKompLokPage:(req,res)=>{
	let query="select * from lokacije";
	
	db.query(query,(err,result)=>{
		if(err){
			return res.status(500).send(err);
		}
		res.render('add-komp-lok.ejs', {
                title: "Dodaj lokaciju i kolicinu"
                ,lokacije: result
            });
	});	
},
addKompLok:(req,res)=>{
	let kompId=req.params.id;
	let kolicina=req.body.kolicina;
	let lokId=req.body.lokacija;
	
	let query = "INSERT INTO `komp_lok_kol` (komp_id,lok_id, kolicina) VALUES ('" +
                            kompId + "', '" + lokId + "', '" + kolicina + "')";

	db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                     });
},
allKompList:(req,res)=>{
	let query= "select k.ime_komponente,d.ime_kategorije,sum(l.kolicina)tot_kol from komponente k, komp_lok_kol l,kategorije_komponenti d where k.id=l.komp_id and k.kateg_id=d.id group by k.ime_komponente,d.ime_kategorije order by d.ime_kategorije";
	db.query(query,(err,result)=>{
		if(err){
			return res.status(500).send(err);
		}
		res.render('all-komp-list.ejs', {
                title: "Sve komponente"
                ,data: result
            });
	});	
}
};

