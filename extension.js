/* Original code by matt vogel */

const panelConfig = {
  tabTitle: "Mobile BottomBar Buttons",
  settings: [
      {id:          "open-close",
       name:        "Open Close Block Button",
       description: "Adds a button to toggle the selected block open/close",
       action:      {type:     "switch",
                     onChange: (evt) => { 
                      console.log("Show Open Close Button", evt['target']['checked']);
                      // toggle button on/off
                      if (evt['target']['checked']) {
                        addBlockCloseButton()
                      } else {
                        destroyButton('bottomToggleBlockClose')
                      }
                    }}},
      {id:     "smartblock-workflow",
      name:   "Input test",
      description: "Adds a button to toggle a smartblock workflow. If nothing is entered a button will not be added",
      action: {type:        "input",
              placeholder: "none",
              onChange:    (evt) => { 
                console.log("Smartblock Input Changed!", evt['target']['value']); 
                // check if value is empty
                let val = evt['target']['value'];

                if (val.length === 0 || !val.trim()) {
                  destroyButton('bottomSmartblockButton')
                }
              }}},
      {id:          "bold-button",
      name:        "Bold Button",
      description: "Adds a button to bold the selected text",
      action:      {type:     "switch",
                    onChange: (evt) => { 
                      console.log("Show Bold Button", evt['target']['checked']);
                      // toggle button on/off
                      if (evt['target']['checked']) {
                        textFormatButton('bold')
                      } else {
                        destroyButton('formatBlockbold')
                      }
                    }}},
      {id:          "italic-button",
      name:        "Italicize Button",
      description: "Adds a button to italicize the selected text",
      action:      {type:     "switch",
                    onChange: (evt) => { 
                      console.log("Show Bold Button", evt['target']['checked']);
                      // toggle button on/off
                      if (evt['target']['checked']) {
                        textFormatButton('italic')
                      } else {
                        destroyButton('formatBlockitalic')
                      }
                    }}},
        {id:          "highlight-button",
        name:        "Highlight Button",
        description: "Adds a button to highlight the selected text",
        action:      {type:     "switch",
                      onChange: (evt) => { 
                        console.log("Show Bold Button", evt['target']['checked']);
                        // toggle button on/off
                        if (evt['target']['checked']) {
                          textFormatButton('highlight')
                        } else {
                          destroyButton('formatBlockhighlight')
                        }
                      }}},
      {id:     "button-order",
       name:   "Button Locations",
       description: "NOT WORKING:Where in the bottom bar to start adding the buttons",
       action: {type:     "select",
                items:    ["Main Bar", "New Panel"],
                onChange: (evt) => { console.log("Select Changed!", evt); }}}
  ]
};

const createIconButton = (icon) => {
  // create a button using a blueprintjs icon
  const popoverButton = document.createElement("button");
  popoverButton.className = "bp3-button bp3-minimal rm-mobile-button dont-unfocus-block";
  popoverButton.tabIndex = 0;

  const popoverIcon = document.createElement("span");
  popoverIcon.className = `bp3-icon bp3-icon-${icon}`;

  popoverButton.appendChild(popoverIcon);

  return popoverButton;
};

const createImageButton = (imageURL) => {
  // create a button using a URL image
  const popoverButton = document.createElement("button");
  popoverButton.className = "bp3-button bp3-minimal rm-mobile-button dont-unfocus-block";
  popoverButton.tabIndex = 0;

  const popoverImage = document.createElement("img");
  popoverImage.src = imageURL;
  popoverImage.alt = "";
  popoverImage.width = "15"

  popoverButton.appendChild(popoverImage);

  return popoverButton;
}

function destroyButton(id) {
  // remove a button from the dom
  // works if there are somehow multiple
  let button = document.querySelectorAll(`#${id}`);
  console.log(button)
  button.forEach(tog => {
      tog.remove();
  });
}

function toggleBlockClose() {  
  // get block openn/close status and toggle it 
  let currentBlockOpen = window.roamAlphaAPI.data.pull("[:block/open]", [":block/uid", roamAlphaAPI.ui.getFocusedBlock()['block-uid']])[':block/open'];
  if (currentBlockOpen){
      roamAlphaAPI
      .updateBlock({"block": 
                    {"uid": roamAlphaAPI.ui.getFocusedBlock()['block-uid'],
                     "open": false}})
    } else {
      roamAlphaAPI
      .updateBlock({"block": 
                    {"uid": roamAlphaAPI.ui.getFocusedBlock()['block-uid'],
                     "open": true}})
    }
    
};

function addBlockCloseButton(){
  // add a button to toggle close/open
  var iconName = 'arrows-vertical'
  var nameToUse = 'bottomToggleBlockClose';

  var checkForButton = document.getElementById(`${nameToUse}-flex-space`);
  if (!checkForButton) {
      var mainButton = createIconButton(iconName);
      mainButton.id = nameToUse;
      var mobileBottomBar = document.getElementById("rm-mobile-bar");
      var nextIconButton = mobileBottomBar.children[4];

      nextIconButton.insertAdjacentElement("afterend", mainButton);

      mainButton.addEventListener("click", toggleBlockClose);
  }

}

function runSmartblockWorkflow(extensionAPI){
  // trigger the workflow
  let workflow = extensionAPI.settings.get('smartblock-workflow')
  try {
    // run workflow on current block
    window.roamjs.extension.smartblocks.triggerSmartblock({
      srcName: workflow,
      targetUid: roamAlphaAPI.ui.getFocusedBlock()['block-uid']
    });
  } catch (error) {
    // log error
    console.error(error);
    alert("Smartblock Workflow does not exist")
  }

}

function addSmartBlockButton(extensionAPI) {
  var iconURL = 'https://raw.githubusercontent.com/dvargas92495/roamjs-smartblocks/main/src/img/lego3blocks.png';
  var nameToUse = 'bottomSmartblockButton';

  // TODO make this check useful
  var checkForButton = document.getElementById(`${nameToUse}-flex-space`);
  if (!checkForButton) {
      var mainButton = createImageButton(iconURL);
      mainButton.id = nameToUse
      var mobileBottomBar = document.getElementById("rm-mobile-bar");
      var nextIconButton = mobileBottomBar.children[4];

      nextIconButton.insertAdjacentElement("afterend", mainButton);


      mainButton.addEventListener("click", function(){
        runSmartblockWorkflow(extensionAPI);
    }, false);
  }

}

function formatdSelectedText(style="bold"){
  console.log('next button', style)
  // replace text between two indexes
  String.prototype.replaceBetween = function(start, end, what) {
      return this.substring(0, start) + what + this.substring(end);
  };
  // get editing block text and selection info
  var textArea = document.querySelectorAll("textarea")[0]
  var text = textArea.value;
  var indexStart=textArea.selectionStart;
  var indexEnd=textArea.selectionEnd;
  var selection = text.substring(indexStart, indexEnd)

  // format selected text
  if (style=='bold') {
      var newText = text.replaceBetween(indexStart,indexEnd, `**${selection}**`);
  } else if (style=='italic') {
      var newText = text.replaceBetween(indexStart,indexEnd, `__${selection}__`);
  }
  else if (style=='highlight') {
      var newText = text.replaceBetween(indexStart,indexEnd, `^^${selection}^^`);
  }

  let blockUID = window.roamAlphaAPI.data.pull("[:block/uid]", [":block/uid", roamAlphaAPI.ui.getFocusedBlock()['block-uid']])[':block/uid'];

  // update block with new formatting
  roamAlphaAPI.updateBlock({"block": 
            {"uid": blockUID,
            "string": newText}})
}

function textFormatButton(style){
  console.log(style)
  // add a button to format
  var iconName = style;
  var nameToUse = 'formatBlock';

  var checkForButton = document.getElementById(`${nameToUse}-flex-space`);
  if (!checkForButton) {
      var mainButton = createIconButton(iconName);
      mainButton.id = nameToUse+style;
      var mobileBottomBar = document.getElementById("rm-mobile-bar");
      var nextIconButton = mobileBottomBar.children[4];

      nextIconButton.insertAdjacentElement("afterend", mainButton);
      // use anom function so formatdSelectedText doesn't run automatically
      mainButton.addEventListener("click", function(){
        formatdSelectedText(style);
    }, false);
  }

}

async function onload({extensionAPI}) {
  console.log("load Mobile BottomBar Button plugin");

  extensionAPI.settings.panel.create(panelConfig);

  // only do stuff if current device is mobile
  if (roamAlphaAPI.platform.isTouchDevice) {
    // constantly check if bottom bar is open
    // don't love this, maybe mutationObserver is better?
    var interval = setInterval(function() {
    
      var roam_bottombar = document.querySelector('#rm-mobile-bar');
      console.log(roam_bottombar)
      if(roam_bottombar) {
        // once bottom bar is open add buttons and stop checking
        // TODO how does this re-add buttons that have been removed?
        clearInterval(interval);
        if (extensionAPI.settings.get('open-close')) {
          addBlockCloseButton()
        }
        if (extensionAPI.settings.get('smartblock-workflow') != undefined) {
          addSmartBlockButton(extensionAPI)
        } 

      }
    }, 500);  


  }
}

function onunload() {
  destroyButton('bottomToggleBlockClose');
  destroyButton('bottomSmartblockButton');

  console.log("unload Mobile BottomBar Button plugin");
}

export default {
onload,
onunload
};
