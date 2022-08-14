// framework cribbed from mobile-todos by DVargas
// https://github.com/dvargas92495/roamjs-com/blob/4901f3519fb9749ce5fb31cb0955906a43e80e2c/src/entries/mobile-todos.ts
import "roamjs-components/dom/createObserver";
import "roamjs-components/dom/getUids"
import {
    createMobileIcon,
    fixCursorById,
  } from "./entry-helpers.js";

  
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

function onload({extensionAPI}) {

    // set defaults if they dont' exist

    extensionAPI.settings.panel.create(panelConfig);
    // create more button
    const MOBILE_MORE_ICON_BUTTON_ID = "mobile-more-icon-button";
    const moreIconButton = createMobileIcon(MOBILE_MORE_ICON_BUTTON_ID, "menu");
    let menuItems = [];

    moreIconButton.onclick = () => {
        const mobileBar = document.getElementById("rm-mobile-bar");
        menuItems = Array.from(mobileBar.children);
        Array.from(mobileBar.children).forEach((n) => mobileBar.removeChild(n));
        mobileBar.appendChild(todoIconButton);
        mobileBar.appendChild(backIconButton);
        if (previousActiveElement.tagName === "TEXTAREA") {
        previousActiveElement.focus();
        }
    };
    moreIconButton.onmousedown = () => {
        previousActiveElement = document.activeElement;
      };

      createObserver(() => {
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
    console.log("load example plugin");
}

function onunload() {
    console.log("unload telegroam plugin");
}
  
export default {
onload,
onunload
};
