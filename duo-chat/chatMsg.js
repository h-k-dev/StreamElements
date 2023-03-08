let testData = {
	"time": 1552400352142,
	"tags": {
		"badges": "broadcaster/1",
		"color": "#641FEF",
		"display-name": "SenderName",
		"emotes": "25:5-9",
		"flags": "",
		"id": "885d1f33-8387-4206-a668-e9b1409a998b",
		"mod": "0",
		"room-id": "85827806",
		"subscriber": "0",
		"tmi-sent-ts": "1552400351927",
		"turbo": "0",
		"user-id": "85827806",
		"user-type": ""
	},

	"nick": "sendername",
	"userId": "123123",
	"displayName": "senderName",
	"displayColor": "#641FEF",
	"badges": [
		{
		"type": "broadcaster",
		"version": "1",
		"url": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
		"description": "Broadcaster"
		}
	],
	"channel": "channelname",
	"text": "Test Kappa test Kappa test",
	"isAction": false,
	"emotes": [
		{
		"type": "twitch",
		"name": "Kappa",
		"id": "25",
		"gif": false,
		"urls": {
			"1": "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
			"2": "https://static-cdn.jtvnw.net/emoticons/v1/25/2.0",
			"4": "https://static-cdn.jtvnw.net/emoticons/v1/25/4.0"
		},
		"start": 5,
		"end": 9
		},
		{
			"type": "twitch",
			"name": "Kappa",
			"id": "25",
			"gif": false,
			"urls": {
				"1": "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
				"2": "https://static-cdn.jtvnw.net/emoticons/v1/25/2.0",
				"4": "https://static-cdn.jtvnw.net/emoticons/v1/25/4.0"
			},
			"start": 16,
			"end": 20
		}
	],
	"msgId": "885d1f33-8387-4206-a668-e9b1409a99Xb"
}



class chatMsg {
	constructor(data, emoteCss, bionicCss, typographyCss) {
		// Css
		this.data = data
		this.typographyCss = typographyCss
		this.emoteCss = emoteCss;
		this.bionicCss = bionicCss;
		
		// Compute
		this._msg = []
		this.trueStrIdx = []
		
		// Auto Invoke
		this.separateEmote(data);
	};


	separateEmote(data) {
		// No emotes
		if (data.emotes.length === 0) {	
			this._msg.push(data.text);
			this.trueStrIdx.push(0);
		};
	  
		// With emotes
		let emotes = data.emotes,
			lastEnd = 0,
			idx = 0;
	  
		// Create an img-tag for each emote
		for (let i = 0; i < emotes.length; i++) {
			let emoteImgUrl = emotes[i].urls[1],
				start = emotes[i].start;
	  
			if (start !== 0) {
				this._msg.push(data.text.slice(lastEnd, start - 1));
				this.trueStrIdx.push(idx);
				idx++
			};
	  
			this._msg.push(`<img class="${this.emoteCss}" src="${emoteImgUrl}">`);
			lastEnd = emotes[i].end + 1;
			idx++
		};
	  
		// Push last text trail
		if (lastEnd < data.text.length) {
		  	this._msg.push(data.text.slice(lastEnd, data.text.length));
			this.trueStrIdx.push(idx);
		};
	};



	toBionic(text) {
		let words = text.split(" "),
			newText = [];
		for (let i = 0; i < words.length; i++) {
			newText.push(this._toBionic(words[i]));
		};
		return newText.join(" ");
	};
	  
	
	_toBionic(word) {
		let boldPart = word.slice(0, Math.ceil(word.length / 2)),
			lightPart = word.slice(Math.ceil(word.length / 2), word.length);
		
		boldPart = this.htmlEncode(boldPart);
		lightPart = this.htmlEncode(lightPart);
	
		return `${boldPart}<span class="${this.bionicCss}">${lightPart}</span>`;
	};


	htmlEncode(str) {
		return str.replace(/[<>"^]/g, function (str) {
			return "&#" + str.charCodeAt(0) + ";";
		});
	};


	get numLines() {
		let numLines,
			computationDiv = document.createElement("div");			
		document.body.appendChild(computationDiv);
		
		// Style
		computationDiv.classList.add(this.typographyCss);
		computationDiv.style.visibility = "hidden";
		computationDiv.style.zIndex = "-1";
		computationDiv.innerHTML = this.asHTML;
		lineHeight = parseFloat(window.getComputedStyle(computationDiv).lineHeight);
		height = parseInt(window.getComputedStyle(computationDiv).height);
		numLines = height / lineHeight;
	  
		document.body.removeChild(testDiv);
		return numLines;
	};


	get asHTML() {
		for (let i = 0; i < this.trueStrIdx.length; i++) {
			let idx = this.trueStrIdx[i];
			if (this.bionicCss) {
				this._msg[idx] = this.toBionic(this._msg[idx]);
			} else {
				this._msg[idx] = this.htmlEncode(this._msg[idx])
			};
		};

		return this._msg.join("");
	};


	get hasText() {
		if (this.trueStrIdx.length !== 0) return true;
		return false;
	}


	get userId() {return this.data.userId};
	get nick() {return this.data.nick}
	get displayName() {return this.data.displayName};
};

const t = new chatMsg(testData, "haha", "hoho")
console.log(t.hasText)