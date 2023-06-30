export const formatdSelectedText = (style="bold") => {
    // grab the text selected by index and replace it with the markdown formatted text
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
    else if (style=='curly') {
        var newText = text.replaceBetween(indexStart,indexEnd, `{{${selection}}}`);
    }
  
    let blockUID = window.roamAlphaAPI.data.pull("[:block/uid]", [":block/uid", roamAlphaAPI.ui.getFocusedBlock()['block-uid']])[':block/uid'];
  
    // update block with new formatting
    roamAlphaAPI.updateBlock({"block": 
              {"uid": blockUID,
              "string": newText}})
  }

export const runSmartblockWorkflow = (extensionAPI) => {
    // trigger the smartblock workflow
    let workflow = extensionAPI.settings.get('smartblock-workflow');
    try {
        // run workflow on current block
        window.roamjs.extension.smartblocks.triggerSmartblock({
            srcName: workflow['workflow name'],
            targetUid: roamAlphaAPI.ui.getFocusedBlock()['block-uid']
        });
    } catch (error) {
        // log error
        console.error(error);
        alert("Smartblock Workflow does not exist")
    }

}

export const toggleBlockClose = () => {  
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

  export const deleteBlock = () => {
    let uid = roamAlphaAPI.ui.getFocusedBlock()['block-uid'];
    window
    .roamAlphaAPI
    .deleteBlock({"block": 
                    {"uid": uid}})}

export const toggleCommandPalette = () => {  
    const convertShortcut = () => {
        return new KeyboardEvent("keydown", {
          metaKey: true,
          key: "p",
          code: "KeyP",
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 80,
        });
      };
      
      const evt = convertShortcut();
      document.activeElement.dispatchEvent(evt);
    
};

export const triggerBlockMenu = () => {
    // if the cursor is in a block text area get the whole block
    let block = document.querySelectorAll("textarea")[0].parentNode.parentElement;
    let bullet = block.getElementsByClassName("rm-bullet")[0];
    var event = new MouseEvent('contextmenu', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });

    bullet.dispatchEvent(event);
}

export const getBlockRef = () => {
    let uid =  `((${roamAlphaAPI.ui.getFocusedBlock()['block-uid']}))`;

    navigator.clipboard.writeText(uid).then(function() {
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
}  

export const toggleHeading = () => {
    let block = window.roamAlphaAPI.ui.getFocusedBlock()

    // check if a block is focused
    if (block !=null) {
        let uid = block['block-uid'];
        // default blocks don't always have view-type set if so assume bullet
        let headingObj = window.roamAlphaAPI.data.pull("[:block/heading]", [":block/uid", uid]);
        let heading = headingObj ? headingObj[':block/heading'] : null;
        let newHeading = heading ? heading - 1 : 3;  

        window.roamAlphaAPI.updateBlock(
            {"block": 
                {"uid": uid,
                "heading": newHeading}})
    }
}