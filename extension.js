var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},t={};e.d(t,{Z:()=>o});const n={tabTitle:"Test Ext 1",settings:[{id:"button-setting",name:"Button test",description:"tests the button",action:{type:"button",onClick:e=>{console.log("Button clicked!")},content:"Button"}},{id:"switch-setting",name:"Switch Test",description:"Test switch component",action:{type:"switch",onChange:e=>{console.log("Switch!",e)}}},{id:"input-setting",name:"Input test",action:{type:"input",placeholder:"placeholder",onChange:e=>{console.log("Input Changed!",e)}}},{id:"select-setting",name:"Select test",action:{type:"select",items:["one","two","three"],onChange:e=>{console.log("Select Changed!",e)}}}]},o={onload:function({extensionAPI:e}){e.settings.panel.create(n);const t="mobile-more-icon-button",o=((e,t)=>{const n=document.createElement("button");n.id="mobile-more-icon-button",n.className="bp3-button bp3-minimal rm-mobile-button dont-unfocus-block",n.style.padding="6px 4px 4px;";const o=document.createElement("i");return o.className="zmdi zmdi-hc-fw-rc zmdi-menu",o.style.cursor="pointer",o.style.color="rgb(92, 112, 128)",o.style.fontSize="18px",o.style.transform="scale(1.2)",o.style.fontWeight="1.8",o.style.margin="8px 4px",n.appendChild(o),n})();let c=[];o.onclick=()=>{const e=document.getElementById("rm-mobile-bar");c=Array.from(e.children),Array.from(e.children).forEach((t=>e.removeChild(t))),e.appendChild(todoIconButton),e.appendChild(backIconButton),"TEXTAREA"===previousActiveElement.tagName&&previousActiveElement.focus()},o.onmousedown=()=>{previousActiveElement=document.activeElement},createObserver((()=>{if(!document.getElementById(t)&&!document.getElementById(MOBILE_BACK_ICON_BUTTON_ID)){const e=document.getElementById("rm-mobile-bar");e&&e.appendChild(o)}})),console.log("load example plugin")},onunload:function(){console.log("unload telegroam plugin")}};var c=t.Z;export{c as default};