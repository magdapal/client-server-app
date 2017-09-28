const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const APIQuotes = 'https://talaikis.com/api/quotes/random/';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/quote', (req, res) => {

  axios.get(`${APIQuotes}/`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.post('/game', (req, res) => {

	function getRandomIntInclusive(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;  
  }
  
  if(req.body.state == "play") {
  	global.randomNumber = getRandomIntInclusive(1,1000)
  	res.status(200).json({message: "start"});
  } else if (req.body.state < global.randomNumber) {
  	res.status(200).json({message: "more, please"});
  } else if (req.body.state > global.randomNumber) {
  	res.status(200).json({message: "less, please"});
  } else if (req.body.state = global.randomNumber) {
  	res.status(200).json({message: global.randomNumber});
  }

});

 

router.post('/weather', (req, res) => {
 	global.longitude = req.body.longitude;
    global.latitude = req.body.latitude;
    axios.get('https://fcc-weather-api.glitch.me/api/current?lon=' + global.longitude + '&' + 'lat=' + global.latitude)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/commands', (req, res) => {
  res.send([{typeCommands:"weather"}, {typeCommands:"quote"}, {typeCommands:"game"}]);
});

module.exports = router;


