import { InputGroup, Switch, Label, Intent } from "@blueprintjs/core";

import { useMemo, useState, useRef, useEffect } from 'react';
import {
  destroyButton,
} from "../entry-helpers.js";
import { OnloadArgs } from "roamjs-components/types/native";

const HotKeyEntry = ({
  hotkey,
  value,
  order,
  keys,
  setKeys,
  extensionAPI,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current.className = "rm-extensions-settings";
    inputRef.current.style.minWidth = "100%";
    inputRef.current.style.maxWidth = "100%";
  }, [inputRef]);
  return (
    <div className={"flex items-center gap-1"}>
      <Label className="flex-1">
        Hot Key
        <InputGroup
          placeholder={"Type the keys themselves"}
          value={hotkey}
          onChange={() => true}
          className={"w-full"}
          inputRef={inputRef}
          onKeyDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // TODO correctly order the hotkey
            const parts = hotkey ? hotkey.split("+") : [];
            const formatValue = (
              e.key === "Backspace"
                ? parts.slice(0, -1)
                : ["Shift", "Control", "Alt", "Meta"].includes(e.key)
                  ? Array.from(new Set(parts.concat(e.key.toLowerCase()))).sort(
                    (a, b) => b.length - a.length
                  ).sort() //sort after so that everything is alphabetic and can match e
                  : parts.concat(e.key.toLowerCase())
            ).join("+");

            if (formatValue === hotkey) return;
            const error = !formatValue || !!keys[formatValue];
            const newKeys = Object.fromEntries(
              Object.entries(keys).map((k, o) =>
                o !== order ? k : [formatValue, k[1]]
              )
            );
            setKeys(newKeys);
            if (!error) {
              extensionAPI.settings.set("hot-keys", newKeys);
            }
          }}
          intent={Intent.NONE}
        />
      </Label>

      <Button
        icon={"trash"}
        style={{ width: 32, height: 32 }}
        minimal
        onClick={() => {
          const newKeys = Object.fromEntries(
            Object.entries(keys).filter((_, o) => o !== order)
          );
          setKeys(newKeys);
          extensionAPI.settings.set("hot-keys", newKeys);
        }}
      />
    </div>
  );
};


const HotKeyPanel = ({extensionAPI}) => {
  const config = useMemo(
    () =>
      extensionAPI.settings.get("smartblock-workflow"),
    []
  );
  const [keys, setKeys] = useState(
    () => extensionAPI.settings.get("hot-keys") || {}
  );
  const [disabled, setDisabled] = useState(!config);
  const [workflowName, setWorkflowName] = useState(config?.["workflow name"]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.className = "rm-extensions-settings";
    inputRef.current.style.minWidth = "100%";
    inputRef.current.style.maxWidth = "100%";
  }, [inputRef]);
  return (
    <div
    // not happy with this styling, sometimes causes the Roam Depot settings page
    // to horizontally scroll and I'm not sure whys
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
            // enable and set the smartblock button
            extensionAPI.settings.set("smartblock-workflow", {
              "workflow name": workflowName,
            });
            setDisabled(false);
          } else {
            // clear and remove the smartblock button
            extensionAPI.settings.set("smartblock-workflow", undefined);
            setDisabled(true);
            destroyButton('bottomSmartblockButton')
          }
        }}
        className={"rm-extensions-settings"}
        label={disabled ? "Disabled" : "Enabled"}
      />
      <HotKeyEntry
            style={{
              opacity: disabled ? .5 : 1,
              cursor: disabled ? 'not-allowed' : 'auto',
            }}
            key={order}
            hotkey={key}
            value={value}
            order={order}
            extensionAPI={extensionAPI}
            keys={keys}
            setKeys={setKeys}
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
            // update the workflow 
            // this should probably be async? no issues so far 
            extensionAPI.settings.set("smartblock-workflow", {
              "workflow name": e.target.value,
            });
            setWorkflowName(e.target.value);
          }}
          inputRef={inputRef}
          disabled={disabled}
          placeholder={extensionAPI.settings.get("smartblock-workflow")}
          className={"w-full"}
        />
      </Label>
    </div>
  );
};

export default HotKeyPanel;