import { InputGroup, Switch, Label } from "@blueprintjs/core";
import { useMemo, useState, useRef, useEffect } from 'react';
import {
  createMobileIcon,
  fixCursorById,
  createMobileImage,
  destroyButton,
} from "../entry-helpers.js";

const SmartblockConfig = ({ extensionAPI }) => {
  // Declare a new state variable, which we'll call "count"
  const config = useMemo(
    () =>
      extensionAPI.settings.get("smartblock-workflow"),
    []
  );

  const [disabled, setDisabled] = useState(!config);
  const [workflowName, setWorkflowName] = useState(config?.["workflow name"]);
  const inputRef = useRef(null);

  console.log(extensionAPI.settings.get("smartblock-workflow"), config, !config, disabled)

  useEffect(() => {
    inputRef.current.className = "rm-extensions-settings";
    inputRef.current.style.minWidth = "100%";
    inputRef.current.style.maxWidth = "100%";
  }, [inputRef]);
  return (
    <div
      className="flex items-start gap-2 flex-col"
      style={{
        width: "100%",
        minWidth: 256,
      }}
    >
      <Switch
        defaultChecked={!disabled}

        onChange={(e) => {
          if (e.target.checked) {
            extensionAPI.settings.set("smartblock-workflow", {
              "workflow name": workflowName,
            });
            setDisabled(false);
          } else {
            extensionAPI.settings.set("smartblock-workflow", {
              "workflow name": undefined,
            });
            setDisabled(true);
            destroyButton('bottomSmartblockButton')
          }
        }}
        className={"rm-extensions-settings"}
        label={disabled ? "Disabled" : "Enabled"}
      />
      <Label>
        Workflow Name
        <InputGroup
          value={workflowName}
          style={{
            opacity: disabled ? .5 : 1,
            cursor: disabled ? 'not-allowed' : 'auto',
          }}
          onChange={(e) => {
            // extensionAPI.settings.set("smartblock-workflow", {
            //   ...(extensionAPI.settings.get("smartblock-workflow")),
            //   "workflow name": e.target.value,
            // });
            extensionAPI.settings.set("smartblock-workflow", {
              "workflow name": e.target.value,
            });
            setWorkflowName(e.target.value);
            console.log(e.target.value, workflowName, extensionAPI.settings.get("smartblock-workflow"));
          }}
          inputRef={inputRef}
          disabled={disabled}
          placeholder={"Daily"}
          className={"w-full"}
        />
      </Label>
    </div>
  );
};

export default SmartblockConfig;