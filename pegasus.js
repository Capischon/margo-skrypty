const audioSrc = localStorage.getItem("sound") || "https://cdn.freesound.org/previews/758/758966_14213757-lq.mp3";

window.pegasusInit = function() {

    let observer;

const getKeywords = () => {
    const PEGASUS_KEY_STORAGE = localStorage.getItem("keywords");
    if (!PEGASUS_KEY_STORAGE) return [];
    return PEGASUS_KEY_STORAGE.split(",").map(k => k.trim()).filter(k => k.length > 0);
}

const requestNotificationPermission = () => {
    if (Notification.permission !== "granted") Notification.requestPermission();
}

const chatCheck = () => {
    const chat = document.querySelector(".one-message-wrapper.active").children;
    let wasSoundPlayed = false;

    for (let i = chat.length-1; i>=0; i--){
        const messageContainer = chat[i];
        const message = messageContainer.querySelector(".message-section")?.textContent;
        const soundPlayed = messageCheck(message, messageContainer, !wasSoundPlayed);

        if (soundPlayed && !wasSoundPlayed) wasSoundPlayed = true;
        }
}

const messageCheck = (message, messageContainer, wasSoundPlayed) => {
    if (!message) return false;

    const keywords = getKeywords();
    for (let keyword of keywords){
        if (message.toLowerCase().includes(keyword.toLowerCase())){
            messageContainer.style.backgroundColor = "rgba(100,255,255,0.2)";
            if (wasSoundPlayed) soundAlert(message);
            return true;
        }
    }
    return false;
}

const soundAlert = (message) => {
    const notificationSound = new Audio(audioSrc);
    notificationSound.volume = 0.4;
    notificationSound.play();
    if (Notification.permission === "granted" && document.hidden) {
         new Notification("Nowa wiadomość!", {icon: "https://micc.garmory-cdn.cloud/obrazki/npc/mez/npc275.gif", body: `${message}`});
    }
}
    
const pegasus = () => {
    const target = document.querySelector(".one-message-wrapper.active");
    if (!target) return;

    const config = { childList: true };

    if (observer instanceof MutationObserver) observer.disconnect();

    observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            for (const addedNode of mutation.addedNodes) {
                const message = addedNode.querySelector(".message-section").textContent;
                 messageCheck(message, addedNode, true);
            }
        }
    });

    if (localStorage.getItem("Pegasus") === "ON") {
        observer.observe(target, config);
        console.log("Pegasus - obserwuje...");
        chatCheck();
    }
    else {
        observer.disconnect();
        console.log("Pegasus - rozłączono...");
    }
}

requestNotificationPermission();
pegasus();

window.pegasus = pegasus;
};

window.pegasusDesc = function(column) {
    column.querySelector("#addon-desc").innerHTML = `
        Dodatek nasłuchuje czat ogólny w poszukiwaniu podanych słów.<br />
        Podświetla znalezione wiadomości i wysyła powiadomienie.
    `;
};

window.pegasusConfig = function(column){
    column.querySelector("#addon-config").innerHTML = `
    <ul style="list-style: none">
        <li style="display:flex; justify-content:space-between"><div class="checkbox-custom">
            <input type="checkbox" id="tick-1" checked>
            <label for="tick-1" class="c-checkbox__label" style="color: #444">Dźwięk</label>
        </div>
            <div style="display:flex"><div class="button small green" id="upload-button" style="width:50%">
                <div class="background"></div>
                <div class="label" style="text-align: center">⬆</div>
            </div><div class="button small green" id="play-button" style="width:50%">
                <div class="background"></div>
                <div class="label" style="text-align: center">▶</div>
            </div></div></li>
        <li><div class="checkbox-custom">
            <input type="checkbox" id="tick-2" checked>
            <label for="tick-2" class="c-checkbox__label" style="color: #444">Powiadomienia</label>
        </div></li>
        <li><div class="checkbox-custom">
            <input type="checkbox" id="tick-3" checked>
            <label for="tick-3" class="c-checkbox__label" style="color: #444">Podświetlenie</label>
        </div></li><br />
        <li style="display:flex"><div class="button small green" id="add-button"style="width:33%">
                <div class="background"></div>
                <div class="label" style="text-align: center">Dodaj</div>
            </div><div class="button small green" id="remove-button" style="width:33%">
                <div class="background"></div>
                <div class="label" style="text-align: center">Usuń</div>
            </div><div class="button small green" id="show-button" style="width:33%">
                <div class="background"></div>
                <div class="label" style="text-align: center">Wyświetl</div>
            </div>
        </li>
    </ul>
    `;

   column.querySelector("#upload-button").onclick = () => {
        const uploadPrompt = prompt("Wprowadź URL do nowego dźwięku.");
        if (uploadPrompt == null || uploadPrompt == "") localStorage.removeItem("sound");
        else localStorage.setItem("sound",uploadPrompt);
    };
    column.querySelector("#play-button").onclick = () => {new Audio(audioSrc).play();};

    column.querySelector("#add-button").onclick = () => {
        const addWordsPrompt = prompt("Wprowadź słowa do dodania (oddzielone przecinkiem lub spacją)");
        let keywords = localStorage.getItem("keywords");
        keywords = keywords ? keywords.split(",") : [];
        keywords.push(addWordsPrompt);
        localStorage.setItem("keywords",keywords);
        dictionaryCheck();
    };

    column.querySelector("#remove-button").onclick = () => {
        dictionaryCheck();
        //const rmWordsPrompt = prompt("Wprowadź słowa do usunięcia (oddzielone przecinkiem)");
        
    };

    column.querySelector("#show-button").onclick = () => {
        dictionaryCheck();
        column.querySelector(".description-label").textContent = "Słownik:";
        column.querySelector("#addon-desc").textContent = localStorage.getItem("keywords");
    };

    const dictionaryCheck = () => {
        let keywords = localStorage.getItem("keywords");
        if (!keywords) return;

        keywords = keywords
            .split(/[,\s]+/)
            .map(w => w.trim())
            .filter(w => w.length > 0);

        localStorage.setItem("keywords", keywords.join(","));
    };
};