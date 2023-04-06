let // Element and Comp
	shiroMsg = document.getElementById("shiro-msg"),
	kuroMsg = document.getElementById("kuro-msg"),  
    shiroComp = window.getComputedStyle(shiroMsg, null),
    kuroComp = window.getComputedStyle(kuroMsg, null),
    doc = document.documentElement,
    docComp =  window.getComputedStyle(doc, null),
    // Box
    paddingTop = parseFloat(shiroComp.getPropertyValue("padding-top")),
    paddingBottom = parseFloat(shiroComp.getPropertyValue("padding-bottom")),
    paddingVert = paddingTop + paddingBottom,
    // Typography, Geometry and related
    fontSize,
    lineHeight = parseFloat(shiroComp.lineHeight),   
    // Exception
    animatedAvatar = "twmuugwu",
    // Animation
	baseStayDuration = 7000,
	shiroOrkuro = -1,
	shiroTimer =  window.setTimeout(idle, baseStayDuration, shiroMsg),
    kuroTimer = window.setTimeout(idle, baseStayDuration, kuroMsg);
	


window.addEventListener('onWidgetLoad', function (obj) {
 /**
  * Listen ONCE on widget being load. Here, load implying
  * changes in fields found in "Settings"-section. Data is read
  * from fields (obj) and saved in "Session-Variables", here,
  * Session implies the state of fields after every changes.
  */
  const {fieldData} = obj.detail;
  // Typography
  fontSize = fieldData["fontSize"];
});



window.addEventListener('onEventReceived', function (obj) {
  // Handle empty event
  if (!obj.detail.event) {
    return;
  }

  // StreamElement sepecifics
  if (typeof obj.detail.event.itemId !== "undefined") {
    obj.detail.listener = "redemption-latest"
  } 

  // Handle:  user message is removed by channel moderator

  // Upon receiving a twitch chat message
  const event = obj.detail.event;

  if (obj.detail.listener !== "message") return;
  if (event.data.nick === animatedAvatar) return;
  displayMsg(event.data);
});


function displayMsg(data) {
 /**
  * Relay msg to the display.
  */
  let stayDuration,
  	  element = shiroOrkuro_();
      msg = attachEmote(data);
  
  console.log(calNumLines(msg));
  if (calNumLines(msg) > 2) return;
 
  element.innerHTML= msg;
  console.log("real", element.clientHeight);
  
  retriggerAnimation(element, "blend-in", "blend-out");
  
  // Blendout
  if (shiroOrkuro === -1) {
  	shiroTimer =  window.setTimeout(idle, baseStayDuration, shiroMsg);
  } else {
    kuroTimer = window.setTimeout(idle, baseStayDuration, kuroMsg);
  };
  
  // Switch
  shiroOrkuro *= -1;
};


function onlyEmote(data) {
  // No emotes
  if (data.emotes.length === 0) return false;

  // Containing emotes
  let emotes = data.emotes,
      newMsg = [],
      lastEnd = 0;

  // Create an img-tag for each emote
  for (emote in emotes) {
    let emoteImgUrl = emotes[emote].urls[1],
        start = emotes[emote].start;

    if (start !== 0) {
      newMsg.push(data.text.slice(lastEnd, start - 1));
    };
    
    lastEnd = emotes[emote].end + 1;
  };

  // Push last text trail
  if (lastEnd < data.text.length) {
    newMsg.push(data.text.slice(lastEnd, data.text.length))
  };

  newMsg = newMsg.join("");
  if (newMsg.length === 0) return true;
  return false 
}


function attachEmote(
  data,
  element = null,
  bionic = false) {
  // No emotes
  if (data.emotes.length === 0) return toBionic(data.text);

  // Containing emotes
  let emotes = data.emotes,
      newMsg = [],
      lastEnd = 0;

  // Create an img-tag for each emote
  for (emote in emotes) {
    let emoteImgUrl = emotes[emote].urls[1],
        start = emotes[emote].start;

    if (start !== 0) {
      newMsg.push(toBionic(data.text.slice(lastEnd, start - 1)));
    };

    newMsg.push(`<img class="emote" src="${emoteImgUrl}">`);
    lastEnd = emotes[emote].end + 1;
  };

  // Push last text trail
  if (lastEnd < data.text.length) {
    newMsg.push(toBionic(data.text.slice(lastEnd, data.text.length)));
  };

  return newMsg.join("");
};


function toBionic(text) {
  let str_ = text.split(" "),
      newText = [];
  for (let i = 0; i < str_.length; i++) {
  	newText.push(_toBionic(str_[i]));
  };
  return newText.join(" ");
}


function _toBionic(word) {
  console.log(word);
  let boldPart = word.slice(0, Math.ceil(word.length / 2)),
      lightPart = word.slice(Math.ceil(word.length / 2), word.length);
  return `${boldPart}<span class="bionic">${lightPart}</span>`
};


function shiroOrkuro_() {
  if (shiroOrkuro === -1) {
    window.clearTimeout(shiroTimer);
    return shiroMsg
  } else {
    window.clearTimeout(kuroTimer);
    return kuroMsg};
};

    
function idle(element) {
  retriggerAnimation(element, "blend-out", "blend-in");
};


function calNumLines(text){
  let numLines,
      testDiv = document.createElement("div");

  document.body.appendChild(testDiv);
  testDiv.classList.add("msg-typography");
  testDiv.style.visibility = "hidden"
  testDiv.innerHTML = text;
  numLines = parseInt(window.getComputedStyle(testDiv).height) / lineHeight;

  document.body.removeChild(testDiv);
  return numLines;
};

    
function retriggerAnimation(element, in_, out_) {
 /**
  * As stated in the name, this trigger an animation by remove and
  * re-adding the "css-animation-class". "in_" and "out_" can be
  * one and the same. The main purpose is to re/-trigger an animation.
  * @param {string} in_: Name of the animation to be triggered.
  * @param {string} out_: Name of the animation to be used for flow trigger.
  */
  element.classList.remove(out_);
  void element.offsetHeight;
  element.classList.add(in_);
};


