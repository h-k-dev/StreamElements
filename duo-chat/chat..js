class Chat {
/** 
 * @param {obj} - All below param are incl. in the object as `property`
 * @param {string} containerId  - TO DO
 * @param {string} paddingCss - TO DO.
 * @param {string} scrollCss - TO DO.
 * @param {string} msgCss - TO DO.
 * @param {string} typographyCss - TO DO.
 * @param {string} computationCss - TO DO.
 * */ 
	constructor(obj)
		{	
		// Parent container
		this.container = document.getElementById(obj["containerId"]);

		// Display relevant elements.
		this.padding = document.createElement("div");
		this.scroll = document.createElement("div");
		this.msg = document.createElement("div");

		// Computation relevant elements.
		this.computor = document.createElement("div")
		this.lineHeight = null;
		this.maxNumlines = null;
		this.maxLinesHeight = null;

		// Auto Invoke
		this.adjustContainer(obj);

		// Messagge queue
		this.queue = [];
	};


	adjustContainer(obj)
	{	
		// Display relevant elements.
		this.padding.classList.add(obj["paddingCss"]);
		this.scroll.classList.add(obj["scrollCss"]);
		this.msg.classList.add(obj["msgCss"]);
		this.msg.classList.add(obj["typographyCss"]);

		// Computation relevant elements.
		this.computor.classList.add(obj["computationCss"], obj["typographyCss"]);

		// Nesting
		this.scroll.appendChild(this.msg);
		this.padding.appendChild(this.scroll);
		this.container.appendChild(this.padding);

		document.body.appendChild(this.computor);
	};


	computeLineHeight(fontSize = null) {
		if (fontSize === null) {
			const fontSize = parseInt(this.getcAtr(this.computor, this.fontSize))};
		
		// Get and adjust
		this.lineHeight = this.getcAtr(this.computor, "line-height");
			this.lineHeight = Math.ceil(parseFloat(this.lineHeight));
			
		// Update style
		document.querySelector(':root').style.setProperty(
		"--line-height", this.lineHeight / (fontSize * (4 / 3)));
	};


	computeMaxHeight(maxNumChar = 500) {
		const testStr = "W".repeat(maxNumChar);
		const paddingTop = parseInt(this.getcAtr(this.padding, "padding-top"));
		const paddingBot = parseInt(this.getcAtr(this.padding, "padding-bottom"));
		let height;
		
		// Adding testing content
		this.computor.innerHTML = testStr;

		height = this.computor.clientHeight - paddingTop - paddingBot;
		this.maxNumlines = Math.floor(height / this.lineHeight);
		this.maxLinesHeight = this.maxNumlines * this.lineHeight;
      	
		this.computor.style.maxheight = String(this.maxLinesHeight) + "px";
		this.padding.style.maxHeight = String(this.maxLinesHeight) + "px";
	};


	analyze(msg) {
		let scrollHeight;			

		this.computor.innerHTML = msg.asHTML;
		scrollHeight = this.computor.scrollHeight;
		
		msg.numLines = Math.floor(scrollHeight / this.lineHeight);
		msg.numScroll = Math.floor(scrollHeight / this.maxLinesHeight - 1);
	};


	calNumScroll(msg) {

	}

	
	getcAtr(element, attribute) {
		return window.getComputedStyle(element).getPropertyValue(attribute)
	};


	enqueue(msg) {
		msg.numLines = this.calNumLines(msg);

		if (this.queue.length > 0) {
			this.queue.push(message);
		} else {
			this.dequeue(msg)
		};
	};


	dequeue(msg = null) {
		if (msg) {
			this.msg.innerHTML = msg.asHTML;
		};

		if (this.queue.length > 0) {
			this.dequeue(this.queue.shift());
		};
	};

	retriggerAnimation(element, in_, out_) {
	/**
	 * As stated in the name, this trigger an animation by remove and
	 * re-adding the "css-animation-class". "in_" and "out_" can be
	 * one and the same. The main purpose is to re/-trigger an animation.
	 * @param {string} in_ - Name of the animation to be triggered.
	 * @param {string} out_ - Name of the animation to be used for flow trigger.
	 */
		element.classList.remove(out_);
		void element.offsetHeight;
		element.classList.add(in_);
	};
};
