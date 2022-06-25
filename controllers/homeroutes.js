const router = require('express').Router();
const User  = require('../models/User');
const Hike = require('../models/Hike');
const withAuth = require('../utils/auth');


// stops non logged in users from accessing page
router.get('/', async (req, res) => {
  console.log('route');
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });

    const users = userData.map((hike) => hike.get({ plain: true }));

    res.render('homepage', {
      users,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }    
});

router.get('/hike/:id', async (req, res) => {
  try {
    const hikeData = await Hike.findByPk(req.params.id, {
       include: [
         {
           model: User,
           through: {
            attributes: ['name'],
           }           
         },
       ],
    });
    const hikes = hikeData.get({ plain: true});
    res.render('hike', {
      ...hikes,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Hike,
         through: {
           attributes: ['hikeName']
         }}],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // session redirects to home page if it exists
  if (req.session.logged_in) {
    res.redirect('homepage');
    return;
  }

  res.render('login');
});
module.exports = router;
