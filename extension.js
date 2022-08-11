/* Original code by matt vogel */

const panelConfig = {
  tabTitle: "Mobile BottomBar Buttons",
  settings: [
      {id:          "open-close",
       name:        "Open Close Block Button",
       description: "Adds a button to toggle the selected block open/close",
       action:      {type:     "switch",
                     onChange: (evt) => { console.log("Switch!", evt['target']['checked']); }}},
      {id:     "smartblock-workflow",
      name:   "Input test",
      description: "Adds a button to toggle a smartblock workflow. If nothing is entered a button will not be added",
      action: {type:        "input",
              placeholder: "none",
              onChange:    (evt) => { console.log("Input Changed!", evt['target'['value']]); }}},
      {id:     "button-order",
       name:   "Start Index",
       description: "Where in the bottom bar to start adding the buttons",
       action: {type:     "select",
                items:    ["one", "two", "three"],
                onChange: (evt) => { console.log("Select Changed!", evt); }}}
  ]
};

const createIconButton = (icon) => {
  const popoverButton = document.createElement("button");
  popoverButton.className = "bp3-button bp3-minimal rm-mobile-button dont-unfocus-block";
  popoverButton.tabIndex = 0;

  const popoverIcon = document.createElement("span");
  popoverIcon.className = `bp3-icon bp3-icon-${icon}`;

  popoverButton.appendChild(popoverIcon);

  return popoverButton;
};

const createImageButton = (imageURL) => {
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

function toggleBlockClose() {    
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
  var iconName = 'arrows-vertical'
  var nameToUse = 'bottomToggleBlockClose';

  var checkForButton = document.getElementById(`${nameToUse}-flex-space`);
  if (!checkForButton) {
      var mainButton = createIconButton(iconName);
      mainButton.id = nameToUse;
      var mobileBottomBar = document.getElementById("rm-mobile-bar");
      var nextIconButton = mobileBottomBar.children[2];

      nextIconButton.insertAdjacentElement("afterend", mainButton);

      mainButton.addEventListener("click", toggleBlockClose);
  }

}

function runSmartblockWorkflow(){
  // trigger the workflow
  let workflow = 'test'
  try {
    window.roamjs.extension.smartblocks.triggerSmartblock({
      srcName: workflow,
      // targetName: 'October 6th, 2021'
      targetUid: roamAlphaAPI.ui.getFocusedBlock()['block-uid']
    });
  } catch (error) {
    console.error(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
    alert("Smartblock Workflow does not exist")
  }

}

function addSmartBlockButton(workflow) {
  var iconURL = 'https://raw.githubusercontent.com/dvargas92495/roamjs-smartblocks/main/src/img/lego3blocks.png';
  var nameToUse = 'bottomSmartblockButton';

  var checkForButton = document.getElementById(`${nameToUse}-flex-space`);
  if (!checkForButton) {
      var mainButton = createImageButton(iconURL);
      mainButton.id = nameToUse
      var mobileBottomBar = document.getElementById("rm-mobile-bar");
      var nextIconButton = mobileBottomBar.children[2];

      nextIconButton.insertAdjacentElement("afterend", mainButton);

      mainButton.addEventListener("click", runSmartblockWorkflow);
  }

}

async function onload({extensionAPI}) {
  console.log("load Mobile BottomBar Button plugin");

  // set defaults if they dont' exist

  extensionAPI.settings.panel.create(panelConfig);

  let settings = extensionAPI.settings.getAll();
  // only do stuff if current device is mobile
  if (roamAlphaAPI.platform.isTouchDevice) {
    // constantly check if bottom bar is open
    // don't love this, maybe mutationObserver is better?
    var interval = setInterval(function() {
    
      var roam_topbar = document.querySelector('#rm-mobile-bar');
      if(roam_topbar) {  
        clearInterval(interval);

        for (const [key, value] of Object.entries(settings)) {
          console.log(`${key}: ${value}`);
          if( key == 'open-close' && value==true){
            addBlockCloseButton()
          }
          if (key == 'smartblock-workflow' && value) {
            addSmartBlockButton(value)
          }
        }
      }
    }, 500);  


  }
}

function onunload() {
  let openClose = document.querySelectorAll('#bottomToggleBlockClose');

  openClose.forEach(tog => {
      tog.remove();
  });
  let smartblockButton = document.querySelectorAll('#bottomSmartblockButton');

  smartblockButton.forEach(tog => {
      tog.remove();
  });

  console.log("unload Mobile BottomBar Butto plugin");
}

export default {
onload,
onunload
};
