// ==UserScript==
// @name         Margonem dodatki
// @namespace    http://tampermonkey.net/
// @version      2025-10-24
// @description  dodatki do margo
// @author       Fan Grzibów (fobos)
// @match        https://*.margonem.pl/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=margonem.pl
// @grant        none
// ==/UserScript==

const scripts = [
    {name: "Pegasus", icon: "https://micc.garmory-cdn.cloud/obrazki/npc/mez/npc275.gif", script: "http://localhost:8000/pegasus.js"}, //https://raw.githack.com/Capischon/margo-skrypty/refs/heads/main/pegasus.js
    {name: "Zwojator", icon: "https://micc.garmory-cdn.cloud/obrazki/itemy/pap/zw_kwieciste.gif", script: "http://localhost:8000/zwojator.js"} //https://raw.githack.com/Capischon/margo-skrypty/refs/heads/main/zwojator.js
];

const menuIcon = "https://micc.garmory-cdn.cloud/obrazki/itemy/eve/g24-aniolek-c2.gif";

const delay = (time) => new Promise(resolve => setTimeout(resolve, time * 1000));
let isMenuOnScreen = false;

(async function() {
    'use strict';
    while (!document.querySelector(".top-left.main-buttons-container.ui-droppable.static-widget-position")){ await delay(0.1); }
    loadScripts();
    createButton();
})();

function createButton(){
    const widgetButton = document.createElement("div");
    const topLeftWidgetBar = document.querySelector(".top-left.main-buttons-container.ui-droppable.static-widget-position");
    const widgetCount = topLeftWidgetBar.querySelectorAll(".widget-in-interface-bar").length;

    widgetButton.className = "widget-button violet widget-in-interface-bar";
    Object.assign(widgetButton.style, {
        width: "44px",
        height: "44px",
        left: `${widgetCount*44}px`,
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    });

    widgetButton.innerHTML = `<img src="${menuIcon}" style="max-height: 80%;">`;
    widgetButton.onclick = () => isMenuOnScreen ? destroyMenu() : createMenu();

    topLeftWidgetBar.appendChild(widgetButton);
}

function destroyMenu(){
    document.getElementById("menuContainer").remove();
    isMenuOnScreen = false;
}

function createMenu(){
    const menuHTML = `
        <div class="border-window" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 14; display: block;">
            <div class="header-label-positioner">
                <div class="header-label" id="zwojator-label">
                    <div class="left-decor"></div>
                    <div class="right-decor"></div>
                    <div class="text">DODATKI</div>
                </div>
            </div>
            <div class="close-button-corner-decor">
                <button type="button" class="close-button"></button>
            </div>

            <div class="content">
                <div class="inner-content">
                    <div class="addons-panel">
                        <div class="left-column">
                            <div class="interface-element-middle-3-background-stretch"></div>
                            <div class="main-header">
                                <div class="interface-element-active-card-background-stretch"></div>
                                <div class="addon-list-label">Lista dodatków</div>
                            </div>
                            <div class="left-scroll scroll-wrapper classic-bar scrollable" style="top:33px">
                                <div class="addon-list" id="addons">
                                </div>
                            </div>
                        </div>
                        <div class="right-column" id="widget-desc">
                            <div class="interface-element-middle-2-background-stretch"></div>
                            <div class="right-header-graphic">
                                <div class="interface-element-active-card-background-stretch"></div>
                            </div>
                            <div class="addon-header" style="display: table;">
                                <div class="img-wrapper">
                                    <div class="border-blink"></div>
                                    <div class="widget-button no-hover violet" style="width: 44px; height: 44px;">
                                        <div class="addon-header-img icon" style="background: url(${menuIcon}); max-height: 80%;"></div>
                                    </div>
                                </div>
                                <div class="title-wrapper">
                                    <div class="addon-header-title">Dodatki od Fan Grzibów (Fobos)</div>
                                </div>
                            </div>
                            <div class="right-scroll scroll-wrapper classic-bar">
                                <div class="scroll-pane" style="overflow-y: auto; overflow-x: hidden">
                                    <div class="one-addon-description" style="display: hide;">
                                        <div class="on-off-button">
                                            <div class="button small green" id="on-off">
                                                <div class="background"></div>
                                                <div class="label">Aktywuj</div>
                                            </div>
                                        </div>
                                        <div class="description-label">Opis: </div>
                                        <div class="description-text" id="addon-desc"></div><br />
                                        <div class="description-label">Konfiguracja: </div>
                                        <div class="description-text" id="addon-config"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    isMenuOnScreen = true;

    const menuContainer = document.createElement("div");
    menuContainer.id = "menuContainer";
    menuContainer.innerHTML = menuHTML;

    document.querySelector(".alerts-layer").appendChild(menuContainer);
    menuContainer.querySelector(".close-button").onclick = destroyMenu;

    scripts.forEach((script) => createWidgetElement(script));
}

function createWidgetElement(script){
    const element = document.createElement("div");
    element.className = "one-addon-on-list";
    document.querySelector("#addons").appendChild(element);
    const buttonColor = localStorage.getItem(script.name) === "ON" ? "green" : "red";
    element.innerHTML = `
            <div class="img-wrapper">
                <div class="widget-button no-hover ${buttonColor}">
                    <div class="addon-img icon" style="background: url(${script.icon}); max-height: 80%;"></div>
                </div>
            </div>
            <div class="title-wrapper">
                <div class="addon-title">${script.name}</div>
            </div>
    `;
    element.onclick = () => loadRightColumn(script);
}

function loadScripts(){
    scripts.forEach(({name, script}) => {
        const s = document.createElement("script");
        s.src = script;
        s.type = "text/javascript";
        s.async = false;
        s.onload = () => {
            if (localStorage.getItem(name) === "ON") {
                window[`${name.toLowerCase()}Init`]();
            }
        };
        document.body.appendChild(s);
    });
}

function loadRightColumn(script){
    const column = document.querySelector("#widget-desc");
    column.querySelector(".addon-header-title").innerText = `${script.name}`;
    column.querySelector(".addon-header-img.icon").style.background = `url(${script.icon})`;
    column.querySelector(".one-addon-description").style.display = "block";
    column.querySelector(".scroll-pane").style.background = "none";

    const isActivated = localStorage.getItem(script.name) || "OFF";
    const onOffButton = column.querySelector("#on-off");
    onOffButton.className = `button small ${isActivated === "ON" ? "green" : "red"}`;
    onOffButton.querySelector(".label").innerText = isActivated === "ON" ? "Dezaktywuj" : "Aktywuj";

    onOffButton.onclick = () => {
        const isActivated = localStorage.getItem(script.name) || "OFF";
        onOffSwitch(script,onOffButton,isActivated);
    }

    const descFunc = window[`${script.name.toLowerCase()}Desc`];
    if (typeof descFunc === "function") descFunc(column);
    else column.querySelector("#addon-desc").innerText = "Brak opisu";

    const configFunc = window[`${script.name.toLowerCase()}Config`];
    if (typeof configFunc === "function") configFunc(column);
    else column.querySelector("#addon-config").innerText = "Brak opisu";

}

function onOffSwitch(script,button,isActivated){
    if(isActivated === "ON") {
        localStorage.setItem(script.name,"OFF");
        button.className = "button small red";
        button.querySelector(".label").innerText = "Aktywuj";
    }
    else {
        localStorage.setItem(script.name,"ON");
        button.className = "button small green";
        button.querySelector(".label").innerText = "Dezaktywuj";
    }
}
