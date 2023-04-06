class ChatCell {
/** 
 * @param {obj} - All below param are incl. in the object as `property`
 * @param {string} containerId  - TO DO
 * @param {string} paddingCss - TO DO.
 * @param {string} scrollCss - TO DO.
 * @param {string} msgCss - TO DO.
 * @param {string} typographyCss - TO DO.
 * @param {string} compareCss - TO DO.
 * @param {string} computeCss - TO DO.
 * ------
 * @param {string} useBionic - TO DO
 * @param {string} useAutoScroll - TO DO
 * */ 
	constructor(
		obj,
		useBionic = false,
		useAutoScroll = true
	) {	
		// Parent container
		this.container = document.getElementById(obj["containerId"]);

		// Display relevant elements.
		this.padding = document.createElement("div");
		this.scroll = document.createElement("div");
		this.msg = document.createElement("div");

		// Computation relevant elements.
		this.computor = document.createElement("div");
		this.comparor = document.createElement("div");

		// Computed Attr
		this.sandBoxError = 3;
		this.lineHeight = null;
		this.maxNumlines = null;
		this.maxLinesHeight = null;

		// Auto Invoke
		this.adjustContainer(obj);

		// Messagge queue
		this.queue = [];
		
		// States
		this.curMsg = null;
		this.idleTimer = this.retriggerAnimation(this.padding, "blend-out", "blend-in");

		// Options
		this.allowNumLines = 3;
		this.useBionic = useBionic;
		this.useAutoScroll = useAutoScroll;
	};


	adjustContainer(obj)
	{	
		// Display relevant elements.
		this.padding.classList.add(obj["paddingCss"]);
		this.scroll.classList.add(obj["scrollCss"]);
		this.msg.classList.add(obj["msgCss"]);
		this.msg.classList.add(obj["typographyCss"]);

		// Computation relevant elements.
		this.comparor.classList.add(obj["compareCss"], obj["typographyCss"]);
		this.computor.classList.add(obj["computeCss"], obj["typographyCss"], obj["paddingCss"])

		// Nesting
		this.scroll.appendChild(this.msg);
		this.padding.appendChild(this.scroll);
		this.container.appendChild(this.padding);

		document.body.appendChild(this.comparor);
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
		
		// Adding testing content
		this.padding.dataset.username = "USERNAME";
		this.comparor.innerHTML = testStr;

		const usernameHeight = Math.ceil(parseFloat(window.getComputedStyle(this.padding, ':before').height));
		const height = this.comparor.clientHeight - paddingTop - paddingBot - this.sandBoxError - usernameHeight;

		this.maxNumlines = Math.floor(height / this.lineHeight);
		this.maxLinesHeight = this.maxNumlines * this.lineHeight;
			
		this.comparor.style.maxheight = String(this.maxLinesHeight) + "px";
		this.computor.style.maxheight = String(this.maxLinesHeight + paddingTop + paddingBot + this.sandBoxError) + "px";
		this.padding.style.maxHeight = String(this.maxLinesHeight) + "px";
		console.log("test", window.getComputedStyle(this.padding, ':before').height);
		this.setCssVar({
			"--scroll-len": String(this.maxLinesHeight) + "px",
			"--scroll-duration": String(this.maxLinesHeight / 60) + "s"});
	};


	analyze(msg) {
		const paddingTop = parseInt(this.getcAtr(this.padding, "padding-top"));
		const paddingBot = parseInt(this.getcAtr(this.padding, "padding-bottom"));
		let scrollHeight, _scrollHeight;			

		this.comparor.innerHTML = msg.asHTML;
		this.computor.innerHTML = msg.asHTML;
		_scrollHeight = this.computor.scrollHeight - paddingTop - paddingBot - this.sandBoxError;
		scrollHeight = this.comparor.scrollHeight;
		
		msg.numLines = Math.floor(scrollHeight / this.lineHeight);
		msg.numScroll = Math.ceil(_scrollHeight / this.maxLinesHeight) - 1;
		msg.scrollStart = this.maxLinesHeight;
	};


	autoScroll() {
		
		if (this.curMsg.numScroll === 0) return this.dequeue();

		this.padding.style.height = String(this.maxLinesHeight) + "px";
		this.curMsg.numScroll -= 1;
		this.curMsg.scrollStart -= this.maxLinesHeight;
		
		this.setCssVar({"--scroll-start": String(this.curMsg.scrollStart) + "px"})

		// No animation time involve
		this.retriggerAnimation(this.msg, "scroll-down", "scroll-down")
		this.idleTimer = window.setTimeout(this.autoScroll.bind(this), 5000);
	};
	

	enqueue(msg) {
		this.analyze(msg)
		
		if (msg.numLines < this.allowNumLines) return;

		this.queue.push(msg);
		if (this.curMsg === null) {
			clearTimeout(this.idleTimer);
			this.peak()
		};
	};


	peak() {
		this.curMsg = this.queue[0];
		this.msg.classList.remove("scroll-down");
		this.changeUsernameTo(this.curMsg.displayName);
		if (this.curMsg.numScroll > 0 && this.useAutoScroll) {
			this.padding.style.height = `${this.maxLinesHeight}px`;
			this.msg.innerHTML = this.curMsg.asHTML;
			this.retriggerAnimation(this.padding, "blend-in", "blend-out");
			this.idleTimer = window.setTimeout(this.autoScroll.bind(this), 7000)
		} else {
			this.padding.style.height = "auto";
			this.msg.innerHTML = this.curMsg.asHTML;
			this.retriggerAnimation(this.padding, "blend-in", "blend-out");
			this.dequeue()
		};	
	};

	changeUsernameTo(newUsername) {
		if (this.padding.dataset.username === this.curMsg.displayName) return;
		this.padding.dataset.username = this.curMsg.displayName;
	};

	dequeue() {
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


	idle() {
		this.retriggerAnimation(this.padding, "blend-out", "blend-in");
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
