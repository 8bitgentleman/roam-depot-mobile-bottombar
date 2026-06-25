import { getActiveTextarea, showNotification } from "./entry-helpers.js";

// Helper function to replace text between two indexes
const replaceBetween = (str, start, end, what) => {
    return str.substring(0, start) + what + str.substring(end);
};

export const formatdSelectedText = (style="bold") => {
    try {
        // get editing block text and selection info
        const textArea = getActiveTextarea();
        if (!textArea) {
            console.warn("Mobile Bottombar: No textarea found - please focus a block first");
            showNotification("Please focus a block first", "error");
            return;
        }

        const text = textArea.value;
        const indexStart = textArea.selectionStart;
        const indexEnd = textArea.selectionEnd;
        const selection = text.substring(indexStart, indexEnd);

        // format selected text
        let newText;
        if (style === 'bold') {
            newText = replaceBetween(text, indexStart, indexEnd, `**${selection}**`);
        } else if (style === 'italic') {
            newText = replaceBetween(text, indexStart, indexEnd, `__${selection}__`);
        } else if (style === 'highlight') {
            newText = replaceBetween(text, indexStart, indexEnd, `^^${selection}^^`);
        } else if (style === 'curly') {
            newText = replaceBetween(text, indexStart, indexEnd, `{{${selection}}}`);
        } else if (style === 'hash') {
            newText = replaceBetween(text, indexStart, indexEnd, `#`);
        } else {
            console.warn(`Mobile Bottombar: Unknown style "${style}"`);
            return;
        }

        // get focused block UID
        const focusedBlock = roamAlphaAPI.ui.getFocusedBlock();
        if (!focusedBlock || !focusedBlock['block-uid']) {
            console.warn("Mobile Bottombar: No block focused");
            return;
        }

        const blockUID = window.roamAlphaAPI.data.pull("[:block/uid]", [":block/uid", focusedBlock['block-uid']])[':block/uid'];
        if (!blockUID) {
            console.error("Mobile Bottombar: Could not get block UID");
            return;
        }

        // Calculate new cursor position based on formatting added
        let newCursorPos = indexStart;
        if (style === 'bold' || style === 'italic' || style === 'highlight') {
            newCursorPos = indexStart + 2; // Move cursor after opening markers
        } else if (style === 'curly') {
            newCursorPos = indexStart + 2; // Move cursor after {{
        } else if (style === 'hash') {
            newCursorPos = indexStart + 1; // Move cursor after #
        }

        // update block with new formatting
        roamAlphaAPI.updateBlock({
            "block": {
                "uid": blockUID,
                "string": newText
            }
        }).then(() => {
            // Refocus the block and set cursor position after update
            setTimeout(() => {
                window.roamAlphaAPI.ui.setBlockFocusAndSelection({
                    location: { 'block-uid': blockUID, 'window-id': 'main-window' },
                    selection: { start: newCursorPos }
                });
            }, 50);
        }).catch(err => {
            console.error("Mobile Bottombar: Failed to update block:", err);
        });
    } catch (error) {
        console.error("Mobile Bottombar: Text formatting error:", error);
    }
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
    try {
        // get focused block
        const focusedBlock = roamAlphaAPI.ui.getFocusedBlock();
        if (!focusedBlock || !focusedBlock['block-uid']) {
            console.warn("Mobile Bottombar: No block focused for toggle");
            return;
        }

        const blockUid = focusedBlock['block-uid'];

        // get block open/close status and toggle it
        const blockData = window.roamAlphaAPI.data.pull("[:block/open]", [":block/uid", blockUid]);
        if (!blockData) {
            console.error("Mobile Bottombar: Could not fetch block data");
            return;
        }

        const currentBlockOpen = blockData[':block/open'];
        const newOpenState = !currentBlockOpen;

        roamAlphaAPI.updateBlock({
            "block": {
                "uid": blockUid,
                "open": newOpenState
            }
        }).catch(err => {
            console.error("Mobile Bottombar: Failed to toggle block:", err);
        });
    } catch (error) {
        console.error("Mobile Bottombar: Toggle block error:", error);
    }
};

export const deleteBlock = () => {
    try {
        const focusedBlock = roamAlphaAPI.ui.getFocusedBlock();
        if (!focusedBlock || !focusedBlock['block-uid']) {
            console.warn("Mobile Bottombar: No block focused for deletion");
            return;
        }

        const uid = focusedBlock['block-uid'];
        window.roamAlphaAPI.deleteBlock({
            "block": {
                "uid": uid
            }
        }).catch(err => {
            console.error("Mobile Bottombar: Failed to delete block:", err);
        });
    } catch (error) {
        console.error("Mobile Bottombar: Delete block error:", error);
    }
}

export const toggleCommandPalette = () => {
    try {
        // Dispatch onto the currently-focused element (the editing textarea, kept
        // focused by the `dont-unfocus-block` class) so the event bubbles up to
        // Roam's global keydown handler exactly as a real keypress would. Fall
        // back to document if nothing is focused.
        const target = getActiveTextarea() || document.activeElement || document;

        const fire = (mods) => {
            ["keydown", "keyup"].forEach((type) => {
                target.dispatchEvent(new KeyboardEvent(type, {
                    ...mods,
                    key: "p",
                    code: "KeyP",
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    keyCode: 80,
                    which: 80,
                }));
            });
        };

        // The command-palette shortcut is user-configurable and NOT exposed via
        // the Roam API, so we can't read it. Fire both common bindings as separate
        // single-modifier events; whichever matches the user's binding triggers,
        // the other is a no-op. (Setting both modifiers at once matches neither.)
        fire({ ctrlKey: true });
        fire({ metaKey: true });
        console.log("Mobile Bottombar: Command palette triggered");
    } catch (error) {
        console.error("Mobile Bottombar: Command palette error:", error);
    }
};

export const triggerBlockMenu = () => {
    try {
        // if the cursor is in a block text area get the whole block
        const textArea = getActiveTextarea();
        if (!textArea) {
            console.warn("Mobile Bottombar: No textarea found for block menu");
            return;
        }

        // Walk up to the block container that holds the bullet, rather than
        // assuming a fixed parentNode depth (Roam's DOM nesting varies).
        const block = textArea.closest(".rm-block-main") || textArea.closest(".roam-block-container") || textArea.parentNode?.parentElement;
        if (!block) {
            console.warn("Mobile Bottombar: Could not find block element");
            return;
        }

        const bullet = block.getElementsByClassName("rm-bullet")[0];
        if (!bullet) {
            console.warn("Mobile Bottombar: Could not find bullet element");
            return;
        }

        // Roam only opens the bullet menu for a right-click: the event needs
        // button/buttons set to the secondary button, and clientX/Y at the
        // bullet's on-screen position so the menu has somewhere to render.
        const rect = bullet.getBoundingClientRect();
        const event = new MouseEvent('contextmenu', {
            view: window,
            bubbles: true,
            cancelable: true,
            button: 2,
            buttons: 2,
            clientX: Math.round(rect.left + rect.width / 2),
            clientY: Math.round(rect.top + rect.height / 2),
        });

        bullet.dispatchEvent(event);
    } catch (error) {
        console.error("Mobile Bottombar: Trigger block menu error:", error);
    }
}

export const getBlockRef = () => {
    try {
        const focusedBlock = roamAlphaAPI.ui.getFocusedBlock();
        if (!focusedBlock || !focusedBlock['block-uid']) {
            console.warn("Mobile Bottombar: No block focused for copying ref");
            return;
        }

        const uid = `((${focusedBlock['block-uid']}))`;

        navigator.clipboard.writeText(uid).then(() => {
            console.log("Mobile Bottombar: Block ref copied to clipboard");
            showNotification("Block ref copied!", "info");
        }).catch(err => {
            console.error('Mobile Bottombar: Could not copy block ref to clipboard:', err);
            showNotification("Failed to copy block ref", "error");
        });
    } catch (error) {
        console.error("Mobile Bottombar: Get block ref error:", error);
    }
}  

export const toggleHeading = () => {
    try {
        const block = window.roamAlphaAPI.ui.getFocusedBlock();

        // check if a block is focused
        if (!block || !block['block-uid']) {
            console.warn("Mobile Bottombar: No block focused for heading toggle");
            return;
        }

        const uid = block['block-uid'];

        // default blocks don't always have heading set, if so assume no heading (0)
        const headingObj = window.roamAlphaAPI.data.pull("[:block/heading]", [":block/uid", uid]);

        // headingObj can be null or an empty object {} when no heading is set
        // In both cases, we should default to 0
        const heading = headingObj?.[':block/heading'] ?? 0;

        // Cycle: 0 -> 3 -> 2 -> 1 -> 0
        const newHeading = heading === 0 ? 3 : heading - 1;

        window.roamAlphaAPI.updateBlock({
            "block": {
                "uid": uid,
                "heading": newHeading
            }
        }).catch(err => {
            console.error("Mobile Bottombar: Failed to toggle heading:", err);
        });
    } catch (error) {
        console.error("Mobile Bottombar: Toggle heading error:", error);
    }
}