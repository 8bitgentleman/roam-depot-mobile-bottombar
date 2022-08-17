// framework cribbed from mobile-todos by DVargas
// https://github.com/dvargas92495/roamjs-com/blob/4901f3519fb9749ce5fb31cb0955906a43e80e2c/src/entries/mobile-todos.ts
import createObserver from "roamjs-components/dom/createObserver";
import getUids from "roamjs-components/dom/getUids"
import {
    createMobileIcon,
    fixCursorById,
    createMobileImage,
    destroyButton,
  } from "./entry-helpers.js";

// store observers globally so they can be disconnected 
var runners = {
    observers: [],
}
const panelConfig = {
    tabTitle: "Test Ext 1",
    settings: [
        {id:		  "button-setting",
         name:		"Button test",
         description: "tests the button",
         action:	  {type:	"button",
                       onClick: (evt) => { console.log("Button clicked!"); },
                       content: "Button"}},
        {id:		  "switch-setting",
         name:		"Switch Test",
         description: "Test switch component",
         action:	  {type:	 "switch",
                       onChange: (evt) => { console.log("Switch!", evt); }}},
        {id:	 "input-setting",
         name:   "Input test",
         action: {type:		"input",
                  placeholder: "placeholder",
                  onChange:	(evt) => { console.log("Input Changed!", evt); }}},
        {id:	 "select-setting",
         name:   "Select test",
         action: {type:	 "select",
                  items:	["one", "two", "three"],
                  onChange: (evt) => { console.log("Select Changed!", evt); }}}
    ]
};

const MOBILE_MORE_ICON_BUTTON_ID = "mobile-more-icon-button";
const MOBILE_BACK_ICON_BUTTON_ID = "mobile-back-icon-button";
let previousActiveElement;

function onload({extensionAPI}) {
    extensionAPI.settings.panel.create(panelConfig);

    // create more button

    const moreIconButton = createMobileIcon(MOBILE_MORE_ICON_BUTTON_ID, "menu");
    const backIconButton = createMobileIcon(
        MOBILE_BACK_ICON_BUTTON_ID,
        "arrow-left"
      );
    const todoIconButton = createMobileIcon(
        "mobile-todo-icon-button",
        "check-square"
      );
    let menuItems = [];

    moreIconButton.onclick = () => {
        const mobileBar = document.getElementById("rm-mobile-bar");
        menuItems = Array.from(mobileBar.children);
        Array.from(mobileBar.children).forEach((n) => mobileBar.removeChild(n));
        mobileBar.appendChild(todoIconButton);
        mobileBar.appendChild(backIconButton);
        // if (previousActiveElement.tagName === "TEXTAREA") {
        // previousActiveElement.focus();
        // }
    };
    backIconButton.onclick = () => {
        const mobileBar = document.getElementById("rm-mobile-bar");
        Array.from(mobileBar.children).forEach((n) => mobileBar.removeChild(n));
        menuItems.forEach((n) => mobileBar.appendChild(n));
        // if (previousActiveElement.tagName === "TEXTAREA") {
        //   previousActiveElement.focus();
        // }
    };
    todoIconButton.onclick = () => {
    if (previousActiveElement.tagName === "TEXTAREA") {
        const textArea = previousActiveElement;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const oldValue = textArea.value;
        const newValue = TODO_REGEX.test(oldValue)
        ? oldValue.replace(TODO_REGEX, "{{[[DONE]]}}")
        : DONE_REGEX.test(oldValue)
        ? oldValue.replace(DONE_REGEX, "")
        : `{{[[TODO]]}} ${oldValue}`;
        const diff = newValue.length - oldValue.length;
        const { blockUid } = getUids(textArea);
        window.roamAlphaAPI.updateBlock({
        block: { uid: blockUid, string: newValue },
        });
        fixCursorById({ id: textArea.id, start: start + diff, end: end + diff });
    }
    };

    const bottombarObserver = createObserver(() => {
        if (
            !document.getElementById(MOBILE_MORE_ICON_BUTTON_ID) &&
            !document.getElementById(MOBILE_BACK_ICON_BUTTON_ID)
        ) {
            const mobileBar = document.getElementById("rm-mobile-bar");
            if (mobileBar) {
                mobileBar.appendChild(moreIconButton);
            }
        }
        });
    // save observers globally so they can be disconnected later
    runners['observers'] = [bottombarObserver]
    console.log("load mobile bottombar plugin");
}

function onunload() {
    // loop through observers and disconnect
    for (let index = 0; index < runners['observers'].length; index++) {
        const element = runners['observers'][index];
        element.disconnect()
    }
    // put back the normal bottombar
    if (document.getElementById(MOBILE_MORE_ICON_BUTTON_ID)) {
        destroyButton(MOBILE_MORE_ICON_BUTTON_ID)
    } else if (document.getElementById(MOBILE_BACK_ICON_BUTTON_ID)) {
        const mobileBar = document.getElementById("rm-mobile-bar");
        Array.from(mobileBar.children).forEach((n) => mobileBar.removeChild(n));
        menuItems.forEach((n) => mobileBar.appendChild(n));
    }
    console.log("unload mobile bottombar plugin");
}
  
export default {
onload,
onunload
};
