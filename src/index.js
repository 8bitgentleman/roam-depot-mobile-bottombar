// code by Matt Vogel
// framework cribbed from mobile-todos by DVargas

import createObserver from "roamjs-components/dom/createObserver";
import getUids from "roamjs-components/dom/getUids";

import {
    createMobileIcon,
    fixCursorById,
    createMobileImage,
    destroyButton,
  } from "./entry-helpers.js";
import {
    formatdSelectedText,
    runSmartblockWorkflow,
    toggleBlockClose,
} from "./button-helpers.js"

import SmartblockConfig from "./components/smartblockConfig";


// store observers globally so they can be disconnected 
var runners = {
    menuItems: [],
    observers: [],
}

const MOBILE_MORE_ICON_BUTTON_ID = "mobile-more-icon-button";
const MOBILE_BACK_ICON_BUTTON_ID = "mobile-back-icon-button";
const MOBILE_TOGGLE_ICON_BUTTON_ID = "mobile-block-toggle-icon-button";
const MOBILE_SMARTBLOCK_ICON_BUTTON_ID = "mobile-smartblock-button"
const MOBILE_BOLD_ICON_BUTTON_ID = "mobile-bold-icon-button";
const MOBILE_HIGHLIGHT_ICON_BUTTON_ID = "mobile-highlight-icon-button";
const MOBILE_ITALIC_ICON_BUTTON_ID = "mobile-italic-icon-button";
const MOBILE_ALIAS_ICON_BUTTON_ID = "mobile-alias-icon-button";

let previousActiveElement;

function onload({extensionAPI}) {
    const wrappedSmartblockConfig = () => SmartblockConfig({ extensionAPI });
    const panelConfig = {
        tabTitle: "Custom Mobile Buttons",
        settings: [
            {id:     "open-close",
             name:        "Open Close Block Button",
             description: "Adds a button to toggle the selected block open/close",
             action:      {type:     "switch",
                           onChange: (evt) => { 
                            // toggle button on/off
                            if (!evt['target']['checked']) {
                                destroyButton(MOBILE_TOGGLE_ICON_BUTTON_ID)
                            }
                          }}},
            {
              id: "smartblock-workflow",
              name: "SmartBlock Workflow",
              description:
                  "Enable to add a button that will trigger given smartblock workflow",
              action: {
                  type: "reactComponent",
                  component: wrappedSmartblockConfig,
              },
          },
            {id:         "bold-button",
            name:        "Bold Button",
            description: "Adds a button to bold the selected text",
            action:      {type:     "switch",
                          onChange: (evt) => { 
                            if (!evt['target']['checked']) {
                              destroyButton(MOBILE_BOLD_ICON_BUTTON_ID)
                            }
                          }}},
            {id:          "italic-button",
            name:        "Italicize Button",
            description: "Adds a button to italicize the selected text",
            action:      {type:     "switch",
                          onChange: (evt) => { 
                            // toggle button on/off
                            if (!evt['target']['checked']) {
                              destroyButton(MOBILE_ITALIC_ICON_BUTTON_ID)
                            }
                          }}},
            {id:          "highlight-button",
              name:        "Highlight Button",
              description: "Adds a button to highlight the selected text",
              action:      {type:     "switch",
                            onChange: (evt) => { 
                              // toggle button on/off
                              if (!evt['target']['checked']) {
                                destroyButton(MOBILE_HIGHLIGHT_ICON_BUTTON_ID)
                              }
                            }}},
            {id:          "alias-button",
                name:        "Alias Button",
                description: "Adds a button to turn the selected text into an alias []()",
                action:      {type:     "switch",
                            onChange: (evt) => { 
                                // toggle button on/off
                                if (!evt['target']['checked']) {
                                destroyButton(MOBILE_ALIAS_ICON_BUTTON_ID)
                                }
                            }}}
            
        ]
      };
    extensionAPI.settings.panel.create(panelConfig);

    const moreIconButton = createMobileIcon(MOBILE_MORE_ICON_BUTTON_ID, "menu");
    const backIconButton = createMobileIcon(
        MOBILE_BACK_ICON_BUTTON_ID,
        "arrow-left"
        );

    const toggleIconButton = createMobileIcon(
        MOBILE_TOGGLE_ICON_BUTTON_ID,
        "arrows-vertical"
        );
    const smartblockImageButton = createMobileImage(
        MOBILE_SMARTBLOCK_ICON_BUTTON_ID,
        'https://raw.githubusercontent.com/8bitgentleman/roam-depot-mobile-bottombar/main/icon.png'
        );
    const boldIconButton = createMobileIcon(
        MOBILE_BOLD_ICON_BUTTON_ID,
        "bold"
        );
    const highlightIconButton = createMobileIcon(
        MOBILE_HIGHLIGHT_ICON_BUTTON_ID,
        "highlight"
        );
    const italicIconButton = createMobileIcon(
        MOBILE_ITALIC_ICON_BUTTON_ID,
        "italic"
        );
    const aliasIconButton = createMobileIcon(
        MOBILE_ALIAS_ICON_BUTTON_ID,
        "link"
        );

    moreIconButton.onclick = () => {
        const mobileBar = document.getElementById("rm-mobile-bar");
        // save the existing bottom bar so it can be replaced later
        runners['menuItems'] = Array.from(mobileBar.children);
        Array.from(mobileBar.children).forEach((n) => mobileBar.removeChild(n));
        // only append new buttons as needed
        // this has the downside of only loading new buttons on menu 'refresh'
        if (extensionAPI.settings.get('open-close')) {
            mobileBar.appendChild(toggleIconButton);
            toggleIconButton.onclick = () => {
                toggleBlockClose();
            }
        }
        if (extensionAPI.settings.get('bold-button')) {
            mobileBar.appendChild(boldIconButton);
            boldIconButton.onclick = () => {
                formatdSelectedText('bold');
            }
        }
        if (extensionAPI.settings.get('italic-button')) {
            mobileBar.appendChild(italicIconButton);
            italicIconButton.onclick = () => {
                formatdSelectedText('italic');
            }
        }
        if (extensionAPI.settings.get('highlight-button')) {
            mobileBar.appendChild(highlightIconButton);
            highlightIconButton.onclick = () => {
                formatdSelectedText('highlight');
            }
        }
        if (extensionAPI.settings.get('smartblock-workflow')) {
            if (['workflow name'] != undefined) {
                mobileBar.appendChild(smartblockImageButton);
                smartblockImageButton.onclick = () => {
                    runSmartblockWorkflow(extensionAPI);
                }
            }
        
          } 
        // always append the back button
        mobileBar.appendChild(backIconButton);
        // if (previousActiveElement.tagName === "TEXTAREA") {
        // previousActiveElement.focus();
        // }
    };
    backIconButton.onclick = () => {
        const mobileBar = document.getElementById("rm-mobile-bar");
        Array.from(mobileBar.children).forEach((n) => mobileBar.removeChild(n));
        runners['menuItems'].forEach((n) => mobileBar.appendChild(n));
        // if (previousActiveElement.tagName === "TEXTAREA") {
        //   previousActiveElement.focus();
        // }
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
        // only the more button is showing
        destroyButton(MOBILE_MORE_ICON_BUTTON_ID)
    } else if (document.getElementById(MOBILE_BACK_ICON_BUTTON_ID)) {
        const mobileBar = document.getElementById("rm-mobile-bar");
        Array.from(mobileBar.children).forEach((n) => mobileBar.removeChild(n));
        runners['menuItems'].forEach((n) => mobileBar.appendChild(n));
        // remove the MORE button just in case
        destroyButton(MOBILE_MORE_ICON_BUTTON_ID)
    }
    console.log("unload mobile bottombar plugin");
}
  
export default {
onload,
onunload
};
