const bcrypt = require('bcryptjs');


module.exports = {

getLoginPage: (req, res) => {
        res.render('login.ejs',{
	title:'Login'
});
    },
getRegPage: (req, res) => {
        res.render('register.ejs', {
                    title: "Register"
                });
    },
getReg: (req, res) => {
	const { name, email, password, password2 } = req.body;
	let dupl;        
	let errors = [];
	
	if(!name || !email || !password || !password2){
		errors.push({msg: 'Please fill in all fields' });
	}

	if(password !== password2){
		errors.push({msg:'Passwords do not match' });
	}
	
	if(password.length < 6){
		errors.push({msg:'Password should be at least 6 characters' });
	}

    	
	if(errors.length > 0){
		res.render('register.ejs', {
                   	title: "Register",
			errors,
			name,
			email,
			password,
			password2
                });
	} else {
	
			let query = "SELECT count(*) dupl FROM `users` u WHERE u.email = '" + email + "'";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
	dupl = result[0].dupl;
	if ( dupl > 0){
			errors.push({msg:'Email is already registered'});
			res.render('register.ejs', {
                   	title: "Register",
			errors,
			name,
			email,
			password,
			password2
                });
		}  else{
			 let query = "INSERT INTO `users` (name, email, password) VALUES ('" +
                            name + "', '" + email + "', '" + password + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
			});
				res.send('hello');			

			}
	
	});
		
}
   
 }

};
