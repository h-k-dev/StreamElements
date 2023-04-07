class DuoChat {
/** 
 * @param {obj} - All below param are incl. in the object as `property`
 * @param {string} containerId  - TO DO
 * @param {string} paddingCss - TO DO.
 * @param {string} typographyCss - TO DO.
 * @param {string} computeCss - TO DO.
 * ------
 * @param {string} useBionic - TO DO
 * */ 
	constructor(
		obj,
		useBionic = false
	) {	
		// Display relevant elements.
		this.kuro = document.getElementById("kuro");
		this.shiro = document.getElementById("shiro");

		// Computation relevant elements.
		this.computor = document.createElement("div");

		// Computed Attr
		this.sandBoxError = 3;
		this.lineHeight = null;

		// Auto Invoke
		this.adjustContainer(obj);

		// Messagge queues
		this.queue = [];
		
		// States
		this.kuroOrShiro = -1  // -1 for kuro and 1 for shiro
		this.kuroMsg = null;
		this.shiroMsg = null;
		this.kuroIdleTimer = null;
		this.shiroIdleTimer = null;
		// this.retriggerAnimation(this.kuro, "blend-out", "blend-in");
		// this.retriggerAnimation(this.shiro, "blend-out", "blend-in");

		// Options
		this.allowNumLines = 3;
		this.useBionic = useBionic;
	};


	adjustContainer(obj)
	{	
		// Display relevant elements.
		this.kuro.classList.add(obj["paddingCss"]);
		this.kuro.classList.add(obj["typographyCss"]);

		this.shiro.classList.add(obj["paddingCss"]);
		this.shiro.classList.add(obj["typographyCss"]);

		// Computation relevant elements.
		this.computor.classList.add(obj["computeCss"], obj["typographyCss"], obj["paddingCss"]);

		// Nesting
		document.body.appendChild(this.computor);
	};


	computeLineHeight() {
		const fontSize = parseFloat(this.getcAtr(this.computor, "font-size"));
		
		// Get and adjust
		this.lineHeight = this.getcAtr(this.computor, "line-height");
		this.lineHeight = Math.ceil(parseFloat(this.lineHeight));
		
		this.setCssVar({
			"--line-height": this.lineHeight / fontSize
		});
		console.log(this.lineHeight / fontSize)
	};


	analyze(msg) {
		const paddingTop = parseInt(this.getcAtr(this.computor, "padding-top"));
		const paddingBot = parseInt(this.getcAtr(this.computor, "padding-bottom"));
		let scrollHeight;			

		this.computor.innerHTML = msg.asHTML;
		scrollHeight = this.computor.scrollHeight - paddingTop - paddingBot - this.sandBoxError;
		
		msg.numLines = Math.floor(scrollHeight / this.lineHeight);
	};

	

	enqueue(msg) {
		this.analyze(msg)
		
		if (msg.numLines > this.allowNumLines) return;

		this.queue.push(msg);
		if (this.curMsg === null) {
			clearTimeout(this.idleTimer);
			this.peak()
		};
	};


	peak() {
		this.curMsg = this.queue[0];
		console.log(this.curMsg)
		// this.changeUsernameTo(this.curMsg.displayName);

		this.dequeue()
	};

	
	getKuroOrShiro(state){
		if (state === -1) return this.kuro	
		else if (state === 1) return this.shiro
	};


	displayMsg(element, msg) {
		this.element.innerHTML = msg.asHTML
		this.retriggerAnimation(this.padding, "blend-in", "blend-out");
	};


	changeUsernameTo(newUsername) {
		if (this.padding.dataset.username === this.curMsg.displayName) return;
		this.padding.dataset.username = this.curMsg.displayName;
	};

	dequeue(msg) {
		this.queue.shift();
		
		if (this.queue.length > 0) {
			this.peak() }
		else {
			this.curMsg = null;
			this.idleTimer = window.setTimeout(this.idle.bind(this), 5000);
		};
	};


	retriggerAnimation(element, in_, out_) {
		element.classList.remove(out_);
		void element.offsetHeight;
		element.classList.add(in_);
	};


	idle(element) {
		this.retriggerAnimation(element, "blend-out", "blend-in");
	};


	getcAtr(element, attribute) {
		return window.getComputedStyle(element).getPropertyValue(attribute)
	};


	setCssVar(obj) {
		for (const [varName, value] of Object.entries(obj)) {
			document.documentElement.style.setProperty(varName, value);
		};
	};
};
