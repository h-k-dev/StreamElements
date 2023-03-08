class Chat {
	constructor(containerId,  paddingCss, scrollCss, msgCss, typographyCss) {
		// Parent container
		this.container = document.getElementById(containerId);

		// Style
		this.padding = document.createElement("div");
		this.scroll = document.createElement("div");
		this.msg = document.createElement("div");

		// Auto Invoke
		this.adjustContainer(paddingCss, scrollCss, msgCss, typographyCss);

		// Messagge queue
		this.queue = [];
	};


	adjustContainer(paddingCss, scrollCss,  msgCss, typographyCss) {
		// Class
		this.padding.classList.add(paddingCss);
		this.scroll.classList.add(scrollCss);
		this.msg.classList.add(msgCss);
		this.msg.classList.add(typographyCss);

		// ID
		this.padding.setAttribute("id", "padding");
		this.scroll.setAttribute("id", "scroll");
		this.msg.setAttribute("id", "msg");

		// Nesting
		this.scroll.appendChild(this.msg);
		this.padding.appendChild(this.scroll);
		this.container.appendChild(this.padding)
	};


	getAtr(element, attribute) {
		window.getComputedStyle(element).getPropertyValue(attribute);
	};


	enqueue(message) {
		this.queue.push(message)
	}
};