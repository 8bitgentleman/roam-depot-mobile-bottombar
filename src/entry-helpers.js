// mostly borrowed from roamjs-com
// https://github.com/dvargas92495/roamjs-com/blob/4901f3519fb9749ce5fb31cb0955906a43e80e2c/src/entry-helpers.ts

// Helper function to show user notifications
export const showNotification = (message, type = 'info') => {
    // Use a simple visual feedback for mobile
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#F55656' : '#0F9960'};
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        animation: fadeInOut 2.5s ease-in-out;
    `;

    // Add CSS animation
    if (!document.getElementById('mobile-bottombar-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-bottombar-toast-styles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                10% { opacity: 1; transform: translateX(-50%) translateY(0); }
                90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
};

// Helper function to get the active textarea more reliably
export const getActiveTextarea = () => {
    // First try to get the actively focused element
    const focused = document.activeElement;
    if (focused?.tagName === 'TEXTAREA') {
        return focused;
    }

    // Fallback to finding textarea via Roam's API
    try {
        const focusedBlock = window.roamAlphaAPI?.ui?.getFocusedBlock();
        if (focusedBlock?.['block-uid']) {
            const textarea = document.querySelector(`[id$="${focusedBlock['block-uid']}"] textarea`);
            if (textarea) return textarea;
        }
    } catch (error) {
        console.warn("Mobile Bottombar: Could not get focused block via API");
    }

    // Last resort: first textarea (original behavior)
    return document.querySelector("textarea");
};

export const createMobileIcon = (
    id,
    iconType
) => {
    const iconButton = document.createElement("button");
    iconButton.id = id;
    iconButton.className =
        "bp3-button bp3-minimal rm-mobile-button dont-unfocus-block";
    iconButton.style.padding = "6px 4px 4px;";
    const icon = document.createElement("span");
    icon.className = `bp3-icon bp3-icon-${iconType}`;
    icon.style.cursor = "pointer";
    icon.style.color = "rgb(92, 112, 128)";
    icon.style.fontSize = "18px";
    icon.style.transform = "scale(1.2)";
    icon.style.fontWeight = "1.8";
    icon.style.margin = "8px 4px";
    iconButton.appendChild(icon);
    return iconButton;
};

export const createMobileTextButton = (
    id,
    text
) => {
    const iconButton = document.createElement("button");
    iconButton.id = id;
    iconButton.className =
        "bp3-button bp3-minimal rm-mobile-button dont-unfocus-block";
    iconButton.style.padding = "6px 4px 4px;";
    const icon = document.createElement("strong");
    // icon.className = `bp3-icon bp3-icon-${iconType}`;
    icon.innerText=text;
    icon.style.cursor = "pointer";
    icon.style.color = "rgb(92, 112, 128)";
    icon.style.fontSize = "15px";
    // icon.style.transform = "scale(1.2)";
    // icon.style.fontWeight = "1.8";
    // icon.style.margin = "8px 4px";
    iconButton.appendChild(icon);
    return iconButton;
};

export const createMobileImage = (
    id,
    imageURL
) => {
    const iconButton = document.createElement("button");
    iconButton.id = id;
    iconButton.className =
        "bp3-button bp3-minimal rm-mobile-button dont-unfocus-block";
    iconButton.style.padding = "6px 4px 4px;";
    const popoverImage = document.createElement("img");
    popoverImage.src = imageURL;
    popoverImage.alt = "";
    popoverImage.width = "15"
  
    iconButton.appendChild(popoverImage);
    return iconButton;
};

// update-block replaces with a new textarea
export const fixCursorById = ({
    id,
    start,
    end,
    focus,
}) =>
    window.setTimeout(() => {
        const textArea = document.getElementById(id);
        if (focus) {
            textArea.focus();
        }
        textArea.setSelectionRange(start, end);
    }, 100);

export const destroyButton = (id) => {
    // remove a button from the dom
    // works if there are somehow multiple
    let selector = `#${id}`
    let button = document.querySelectorAll(`#${id}`);
    button.forEach(tog => {
        tog.remove();
    });
}
