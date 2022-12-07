export const  formatdSelectedText = (style="bold") => {
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
    else if (style=='link') {
        var newText = text.replaceBetween(indexStart,indexEnd, `[${selection}]((()))`);
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

export const aliasSelection = () => {
    var textArea = document.querySelectorAll("textarea")[0]

    function getSelectedTextInTextarea(textarea) {
        // Get the start and end indexes of the selected text
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        // Get the selected text
        var selectedText = textarea.value.substring(start, end);
        return selectedText;
    }
        var selectedText = getSelectedTextInTextarea(textArea)

        function replaceSelectedTextInTextarea(textarea, newText) {
        // Get the start and end indexes of the selected text
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        aliasText = "[" + newText + "]()"
        // Replace the selected text with the new text
        textarea.value = textarea.value.substring(0, start) + aliasText + textarea.value.substring(end);
        // Set the cursor position after the replaced text
        textarea.setSelectionRange(start + aliasText.length, start + aliasText.length - 1);
    }

    return replaceSelectedTextInTextarea(textArea ,selectedText)
}

export const softReturn = () => {
    var textArea = document.querySelectorAll("textarea")[0]
  
    function getCaretLocation(textarea) {
        // Get the end indexes of the selected text
        var end = textarea.selectionEnd;
        // Get the selected text
        var value = textarea.value;
        return [value,end];
    }
    
    function insertSoftReturn(textarea, text,pos) {
        // get the current text
    
        // insert a soft return character at the given position
        var newText = text.substring(0, pos) + "\n" + text.substring(pos);
    
        // update the text with the soft return
        roamAlphaAPI.updateBlock({"block": 
                {"uid": "iytgVziyf",
                "string": newText}})

    }
    
    let caret = getCaretLocation(textArea)
    
    insertSoftReturn(textArea, caret[0], caret[1])
}