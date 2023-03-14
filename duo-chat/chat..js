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
	constructor(obj) {	
		// Parent container
		this.container = document.getElementById(obj["containerId"]);

		// Display relevant elements.
		this.padding = document.createElement("div");
		this.scroll = document.createElement("div");
		this.msg = document.createElement("div");

		// Computation relevant elements.
		this.computor = document.createElement("div")

		// Computed Attr
		this.lineHeight = null;
		this.maxNumlines = null;
		this.maxLinesHeight = null;

		// Auto Invoke
		this.adjustContainer(obj);

		// Messagge queue
		this.queue = [];
		
		// States
		this.curMsg = null;
		this.idleTimer = null;
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


	computeLineHeight() {
		const fontSize = parseFloat(this.getcAtr(this.computor, "font-size"));
		
			// Get and adjust
		this.lineHeight = this.getcAtr(this.computor, "line-height");
		this.lineHeight = Math.ceil(parseFloat(this.lineHeight));
			
		// Update style
		document.querySelector(':root').style.setProperty(
		"--line-height", this.lineHeight / fontSize);
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
		msg.scrollStart = this.maxLinesHeight * -1;
	};


	autoScroll() {
		if (this.curMsg.numScroll === 0) return;

		this.curMsg.numScroll -= 1;
		this.curMsg.scrollStart -= this.maxLinesHeight;
		this.curMsg.scrollEnd -= this.maxLinesHeight;

		this.setCssVar({
			"--scroll-start": String(this.curMsg.scrollStart) + "px";
			"--scroll-end":  String(this.curMsg.scrollEnd) + "px";
		})

		this.idleTimer = window.setTimeout(this.autoScroll, 5000);
	};
	

	enqueue(msg) {
		this.analyze(msg)
		this.queue.push(msg);
		
		if (this.curMsg === null) {
			clearTimeout(this.idleTimer);
			this.peak()
		};
	};


	peak() {
		this.curMsg = this.queue[0];

		if (this.curMsg) {
			this.curMsg.innerHTML = this.curMsg.asHTML;
			this.retriggerAnimation(this.padding, "blend-in", "blend-out");
			this.autoScroll()
		};

	};


	dequeue() {
		
		if (this.queue.length > 0) {
			this.queue.shift();
			this.peak();
		} else {
			this.curMsg = null;
			this.idleTimer = window.setTimeout(this.idle, 5000);
		};
	};


	idle() {
		this.retriggerAnimation(this.padding, "blend-out", "blend-in");
	}


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


	getcAtr(element, attribute) {
		return window.getComputedStyle(element).getPropertyValue(attribute)
	};


	setCssVar(obj) {
		const doc = document.documentElement;
		for (const [varible, value] in Object.entries(obj)) {
			doc.style.setProperty(varible, value);
		}
	};
};
