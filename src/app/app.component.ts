import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor (private http: Http) {}

	typeCommand: boolean = true;
	otherType: boolean = false;
	showWelcome: boolean = true;
  searchValue:string = '';


  urlList: string = environment.apiLink + "/api/commands";
  urlQuote: string = environment.apiLink + "/api/quote";
  urlLocalization: string = "https://geoip.nekudo.com/api/en/";
  urlWeather: string = environment.apiLink+ "/api/weather";
  urlGame: string = environment.apiLink + "/api/game";

  commands: string[];
  quoteData: any;
  weatherData: string;
  minNumber: number = 0;
  maxNumber: number = 1000;
	gameHistory: any[] = [];

	ngOnInit() {
    this.searchValue = '';
  }

  getRandomIntInclusive(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  guessNumber() {
	  const randomInt = this.getRandomIntInclusive(this.minNumber, this.maxNumber);
  	const data = { state: randomInt }
	  this.http.post(this.urlGame, data).subscribe(
			data => {
			  this.gameHistory.push({author: "Frontend Bot", message: randomInt});
				const message = data.json().message;
				switch(message) {
					case "less, please": {
						this.gameHistory.push({author: "Backend Bot", message: message});
			    	this.maxNumber = randomInt-1;
		    	  this.guessNumber();
		    	  break
					}
					case "more, please": {
						this.gameHistory.push({author: "Backend Bot", message: message});
		    	  this.minNumber = randomInt+1;
			      this.guessNumber();
			      break
					}
					case randomInt: {
				    const finalMessage = "great!"
				    this.gameHistory.push({author: "Backend Bot", message: finalMessage});
				    break
					}

	      }
		  },
		  err => {
		  	alert("Something went wrong");
		  }
		);
	}

	commandHelpScript() {
		this.otherType = false;
		this.showWelcome = false;
		this.http.get(this.urlList)
	  .subscribe(
	    response => {
				this.commands = response.json();
	    },
	    err => {
	      alert('Something went wrong');
	    }
	  );
	}

	commandQuoteScript() {
		this.otherType = false;
		this.showWelcome = false;
    this.http.get(this.urlQuote)
    .subscribe(
    	response => {
				this.quoteData = response.json()
      },
      err => {
      	alert("Something went wrong");
      }
    );
  }

	commandWeatherScript() {
		this.otherType = false;
		this.showWelcome = false;
		this.http.get(this.urlLocalization)
	  .subscribe(response => {
	    const myLocalization = response.json();
	    const latitude = myLocalization.location.latitude;
	    const longitude = myLocalization.location.longitude;
	    const data = {latitude: latitude, longitude: longitude};
	    this.http.post(this.urlWeather, data).subscribe(
		    data => {
	        this.weatherData = data.json()
		    },
		    err => {
		    	alert("Something went wrong");
		    }
	    )
	  });
	}

	commandGameScript() {
		this.otherType = false;
		this.showWelcome = false;
	  const data = { state: "play" }
	  this.http.post(this.urlGame, data).subscribe(
	    data => {
	    	this.gameHistory.push({author: "Backend Bot", message: "play"})
	      this.guessNumber();
	    },
		  err => {
		  	alert("Something went wrong");
		  }
		)
	}

	otherScript() {
		this.otherType = true;
		this.showWelcome = false;
	}

  onEnter(value: string) {
  	this.quoteData = undefined;
  	this.weatherData = undefined;
  	this.gameHistory = [];
  	this.commands = [];
  	this.minNumber = 0;
    this.maxNumber = 1000;

    switch(value) {
    	case "help": {
				this.commandHelpScript();
				this.searchValue = '';
	      break;
      }
		  case "quote": {
				this.commandQuoteScript();
				this.searchValue = '';
				break;
		  }
		  case "weather": {
				this.commandWeatherScript();
				this.searchValue = '';
				break;
	    }
	    case "game": {
				this.commandGameScript();
				this.searchValue = '';
				break;
			}
			default:
				this.otherScript();
				this.searchValue = '';

    }
  }
}

