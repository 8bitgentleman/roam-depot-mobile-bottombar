// borrowed from roamjs-com
// https://github.com/dvargas92495/roamjs-com/blob/4901f3519fb9749ce5fb31cb0955906a43e80e2c/src/entry-helpers.ts

export const createMobileIcon = (
    id,
    iconType
) => {
    const iconButton = document.createElement("button");
    iconButton.id = id;
    iconButton.className =
        "bp3-button bp3-minimal rm-mobile-button dont-unfocus-block";
    iconButton.style.padding = "6px 4px 4px;";
    const icon = document.createElement("i");
    icon.className = `zmdi zmdi-hc-fw-rc zmdi-${iconType}`;
    icon.style.cursor = "pointer";
    icon.style.color = "rgb(92, 112, 128)";
    icon.style.fontSize = "18px";
    icon.style.transform = "scale(1.2)";
    icon.style.fontWeight = "1.8";
    icon.style.margin = "8px 4px";
    iconButton.appendChild(icon);
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