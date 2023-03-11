class Chat {
	/** 
	 * @param {obj} - All below param are incl. in the object as `property`
	 * @param {string} paddingCss 
	 * @param {string} paddingCss - string.
	 * @param {string} scrollCss - TO DO.
	 * @param {string} msgCss - TO DO.
	 * @param {string} typographyCss - TO DO.
	 * @param {string} computationCss - TO DO.
	 * 
	 * */ 
	constructor(obj)
 	{
		// Parent container
		this.container = document.getElementById(obj[containerId]);

		// Main containers
		this.padding = document.createElement("div");
		this.scroll = document.createElement("div");
		this.msg = document.createElement("div");

		// Computation
		this.computor = document.createElement("div")
		this.lineHeight = null

		// Auto Invoke
		this.adjustContainer(obj);

		// Messagge queue
		this.queue = [];
	};


	adjustContainer(obj) 
	{	
		// Class
		this.padding.classList.add(obj[paddingCss]);
		this.scroll.classList.add(obj[scrollCss]);
		this.msg.classList.add(obj[msgCss]);
		this.msg.classList.add(obj[typographyCss]);
		this.computor.classList.add(obj[computationCss], obj[typographyCss]);

		// Nesting
		this.scroll.appendChild(this.msg);
		this.padding.appendChild(this.scroll);
		this.container.appendChild(this.padding);
		document.body.appendChild(this.computor);
	};


	calNumLines(msg) {
		let numLines, lineHeight, height;			

		computationDiv.innerHTML = msg.asHTML;
		height = parseInt(this.getcAtr(this.computor, height));
		numLines = height / this.lineHeight;

		return numLines;
	};


	getcAtr(element, attribute)
	{
		window.getComputedStyle(element).getPropertyValue(attribute);
	};


	enqueue(message)
	{
		this.queue.push(message)
	}
};