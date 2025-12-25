window.zwojatorInit = function() {

document.addEventListener("keydown", function(event) {
    if (event.code === "Numpad0") {
        isMenuOnScreen ? destroyMenu() : createMenu();
    }
});

let isMenuOnScreen = false;

const createButton = () => {
    const widgetButton = document.createElement("div");
    widgetButton.className = "widget-button blink-violet";

    const widgetAnchor = document.querySelector(".bags-navigation.ui-droppable");
    const anchorPosition = widgetAnchor.getBoundingClientRect();
    const anchorWidth = anchorPosition.width;

    Object.assign(widgetButton.style, {
         width: "44px",
        height: "44px",
        right: `${anchorWidth}px`,
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    });

    widgetButton.innerHTML = `<img src="https://micc.garmory-cdn.cloud/obrazki/itemy/pap/zw_kwieciste.gif" style="max-height: 80%;">`;
    widgetButton.onclick = () => isMenuOnScreen ? destroyMenu() : createMenu();

    document.querySelector(".bags-navigation.ui-droppable").appendChild(widgetButton);
}

const createMenu = () =>{
    const menuHTML = `
        <div class="border-window" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 15; display: block;">
            <div class="header-label-positioner">
                <div class="header-label" id="zwojator-label">
                    <div class="left-decor"></div>
                    <div class="right-decor"></div>
                    <div class="text">Zwojator</div>
                </div>
            </div>
            <div class="close-button-corner-decor">
                <button type="button" class="close-button"></button>
            </div>
            <div style="overflow-y: scroll; width: 400px; height: 60vh; border-style: solid; border-width: 0 11px;
                        border-image: url(../img/gui/middle_graphics.png?v=1760353180322) 0 11 fill round; background-size: contain; background: #1d1210; margin: -10px; padding: -10px;">
                <div class="list" id="zwojator-container">
                    <div class="search-wrapper" style="position: sticky; top: 0; z-index:100">
                        <input class="search" data-trans="placeholder#search" placeholder="Filtruj">
                            <div class="search-x" data-trans="data-tip#delete" tip-id="93"></div>
                    </div>
                </div>
            </div>
        </div>`;

    isMenuOnScreen = true;

    const zwojatorContainer = document.createElement("div");
    zwojatorContainer.setAttribute("id", "zwojatorContainer");
    zwojatorContainer.innerHTML = menuHTML;

    document.querySelector(".alerts-layer").appendChild(zwojatorContainer);
    zwojatorContainer.querySelector(".close-button").onclick = destroyMenu;
    zwojatorContainer.querySelector(".search-x").onclick = () => {
        zwojatorContainer.querySelector(".search").value = "";
        document.querySelectorAll("#zwojator-container > div:not(.search-wrapper)").forEach(item => {item.style.display = "flex"});
    };

    inventoryScanner();
}

const destroyMenu = () => {
    document.getElementById("zwojatorContainer").remove();
    isMenuOnScreen = false;
}

const createListElement = (tpList) => {
    
    const listElement = document.createElement("div");
    document.querySelector("#zwojator-container").appendChild(listElement);

    listElement.style = `
        display: flex;
        align-items: center;
        color: #cebc8d;
        padding: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    `;

    listElement.innerHTML = `
        <div class="tp-icon"><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/${tpList.icon}" alt="ikonka"></div>
        <div style="margin-left: 10px">
            <div class="tp-name" style="font-weight: bold">${tpList.name}</div>
            <div class="tp-location">${formatLocation(tpList.location)}</div>
            <div class="tp-amount">${isReusable(tpList.amount, tpList.timelimit, tpList.cooldown)}</div>
        </div>
        <div class="tp-action button blue" style="margin-left: auto; height: 2vw; width: 2vw; display: flex; justify-content: center; flex-shrink: 0; align-items: center">➡</div>
    `;

    listElement.onmouseover = () => {const readyToUse = !tpList.cooldown ? listElement.style.backgroundColor = "rgba(0,128,0,0.2)" : listElement.style.backgroundColor = "rgba(128,0,0,0.2)";};
    listElement.onmouseleave = () => {listElement.style.backgroundColor = "";};
    listElement.querySelector(".tp-action").onclick = () => {
        const dblClick = new MouseEvent("dblclick");
        document.querySelector(`.item-id-${tpList.id}`).dispatchEvent(dblClick);
    };
}

const inventoryScanner = () => {
    const inventory = document.querySelectorAll(".item.inventory-item");
    const teleportList = [];

    inventory.forEach((log) => {
        const jQueryKey = Object.keys(log).find(k => k.startsWith("jQuery"));
        const itemCachedStats = log[jQueryKey].item._cachedStats;

        let amount = log.querySelector(".amount") ? log.querySelector(".amount").textContent : 1;
        let cooldown = log.querySelector(".cooldown")?.textContent || null;

        if (itemCachedStats.teleport || itemCachedStats.custom_teleport) {
            teleportList.push({
                id: log[jQueryKey].item.id,
                name: log[jQueryKey].item.name,
                location: itemCachedStats.teleport || itemCachedStats.custom_teleport,
                amount: amount,
                icon: log[jQueryKey].item.icon,
                timelimit: itemCachedStats.timelimit,
                cooldown: cooldown
            });
        }
    });

    teleportList.sort((a, b) => {
        if (a.timelimit && !b.timelimit) return -1;
        if (!a.timelimit && b.timelimit) return 1;
        return a.name.localeCompare(b.name);
    });

    teleportList.forEach(tp => createListElement(tp));
    search();
    returnList(teleportList);
}

const formatLocation = (location) => {
    const locationParts = location.split(",");
    return `${locationParts[3]} (${locationParts[1]}, ${locationParts[2]})`;
}

const isReusable = (amount, timelimit, cooldown) => {
    if (timelimit) {
        let limit = timelimit.split(",");
        limit = limit[0];
        let toHours = (cooldown/60).toFixed(2);

        return cooldown ? `Pozostało ${Math.floor(toHours)}h:${Math.floor(60*(toHours-(Math.floor(toHours))))}m do ponownego użycia` : `Gotowy do użycia`;
    }
    return `Ilość: ${amount}`;
}

const returnList = (teleportList) => {
    document.querySelector("#zwojator-label").onclick = () => {console.table(teleportList);};
}

const search = () => {
    const searchInput = document.querySelector("#zwojatorContainer .search");
    const itemList = document.querySelectorAll("#zwojator-container > div:not(.search-wrapper)");

    searchInput.oninput = () => {const filter = searchInput.value.toLowerCase();

    itemList.forEach(item => {
        const name = item.querySelector(".tp-name")?.textContent.toLowerCase();
        const location = item.querySelector(".tp-location")?.textContent.toLowerCase();

        if (name.includes(filter) || location.includes(filter)) item.style.display = "flex";
        else item.style.display = "none";
        });
    };
}

    createButton();
}

window.zwojatorDesc = function(column) {
    column.querySelector("#addon-desc").innerHTML = `
        Wszystkie teleporty z ekwipunku w jednym menu.<br />
        Przypisany klawisz -> Numpad0
    `;
}

window.zwojatorConfig = function(column) {
    column.querySelector("#addon-config").innerHTML = ``;
}
