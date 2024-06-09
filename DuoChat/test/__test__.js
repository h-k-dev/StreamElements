"use strict";

const Chat = require("./asyncchat")

let chat = new Chat();

(async() => {
    await chat.test();
})()
