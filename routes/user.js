const router = require('express').Router();
const { Op, Sequelize } = require('sequelize');
const User = require('../model/user');
const {userValidationUsername, userValidationEmail, isNotValid} = require('../utils/userValidation');


router.get('/', (req, res)=> {
    User.findAll()
    .then((rows)=> {
        res.status(200);
        res.render('index', {data:rows});
    })
    .catch(err=>console.log(err))
});

router.get('/add-user', (req, res)=>{
    res.status(200);
    res.render('add-user', {isNotValid});
});

// POST add-user with findOrCreate and inline validation
router.post('/add-user', (req, res) => {
    const { username, email } = req.body;
    const age = parseInt(req.body.age)
    
    // Basic input validation
    if (!username || !email || !age || isNaN(age)) {
       userValidationUsername();
        res.status(409);
        return res.redirect('/add-user?error=All fields are required and age must be a number');
    }
    
    //find and add user with validation
   User.findOrCreate({
        where: {
            [Op.or]: [
                { username },
                { email },
            ]
        },
        defaults: {
            username,
            email,
            age:parseInt(age)
        }
    })
    .then(([user, created]) => {
        if (!created) {
            // User already exists with that name, email, and age
            if(username == user.username){
                userValidationUsername();
            return res.redirect('/add-user?error=email is not correct');
            };

            if(email == user.email){
                userValidationEmail();
            return res.redirect('/add-user?error=email is not correct');
            };
          
            res.status(409);
            return res.redirect('/add-user?error=User already exists');
        };
        res.status(303);
        res.redirect('/');
    })
    .catch(err => {
        console.error(err);
        res.stat(500).send('Server Error');
    });
});



router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    const age = parseInt(req.body.age);

    // Basic input validation
    if (!username || !email || isNaN(age)) {
        return res.status(400).redirect('/user');
    }

    User.findByPk(id)
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            // Check if nothing has changed
            if (user.username === username && user.email === email && user.age === age) {
                console.log('No update needed for user');
                return res.status(304).redirect('/user');
            }

            // Check for existing username or email in other users
            return User.findOne({
                where: {
                    id: { [Op.ne]: id },
                    [Op.or]: [
                        { username: username },
                        { email: email }
                    ]
                }
            })
            .then(duplicateUser => {
                if (duplicateUser) {
                    console.log('Username or email already exists');
                    return res.status(409).redirect('/user');
                }

                // Update user
                user.username = username;
                user.email = email;
                user.age = age;

                return user.save()
                    .then(() => {
                        console.log('User updated successfully');
                        return res.status(200).redirect('/user');
                    });
            });
        })
        .catch(err => {
            console.error('Error during user update:', err);
            return res.status(500).send('Internal server error');
        });
});




router.post('/delete/:id', (req, res)=>{
    const {id} =req.params
    User.findByPk(id)
    .then((row)=>{
        return row.destroy();
    })
    .then(()=>{
        res.status(204).redirect('/user')
    })
    .catch(err=>console.log(err))
});

router.get('/user', (req, res)=> {
    User.findAll()
    .then((rows)=> {
        res.status(200);
        res.render('user', {data:rows})
    })
});


router.get('/user/:username', (req, res)=> {
    const {username} = req.params;
    User.findOne({
        where:Sequelize.where(Sequelize.fn('lower', Sequelize.col('username')),
    username.toLowerCase())
    })
    .then((row)=> {
        res.status(200);
        res.render('userView', {user:row})
    })
    .catch(err=>console.log(err))
});

module.exports = router;