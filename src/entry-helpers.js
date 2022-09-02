// mostly borrowed from roamjs-com
// https://github.com/dvargas92495/roamjs-com/blob/4901f3519fb9749ce5fb31cb0955906a43e80e2c/src/entry-helpers.ts
import {
    Button,
    Icon,
    Menu,
    MenuItem,
    Popover2,
  } from "@blueprintjs/core";
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

export const headingOptions = (heading) => {
    return (
          <Popover2
            interactionKind="click"
            // onClosed={reFocus}
            content={
              <>
                <Menu>
                  <MenuItem
                    icon="paragraph"
                    text="text"
                    // intent={isIntent(isPlain())}
                    onClick={() => {
                    //   toPlain();
                    }}
                    // active={isPlain()}
                  />
                  <MenuItem
                    icon="header-one"
                    text={"H1"}
                    onClick={() => {
                    //   headering(1);
                    }}
                    // active={isHeading(1)}
                  />
                  <MenuItem
                    icon="header-two"
                    text={"H2"}
                    // active={isHeading(2)}
                    onClick={() => {
                    //   headering(2);
                    }}
                  />
                  <MenuItem
                    // active={isHeading(3)}
                    icon="header-three"
                    text="H3"
                    // onClick={() => headering(3)}
                  />
                  <MenuItem
                    // active={isQuotation()}
                    icon="citation"
                    text="Quote"
                    // onClick={() => quotation()}
                  />
                </Menu>
              </>
            }
          >
            <Button
              icon={
                "header-one"
              }
            >
              <Icon icon="chevron-down" size={14} style={{ color: "grey" }} />
            </Button>
          </Popover2>
      );

}
