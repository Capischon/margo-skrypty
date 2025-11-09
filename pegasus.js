window.pegasusInit = function() {

    const keywords = ["lambo",
                  "sopel",
                  "sopla",
                  "amaimon"
                 ];

    const audioSrc = "https://cdn.freesound.org/previews/758/758966_14213757-lq.mp3";
    let observer;

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
            console.log("Obserwuje...");
            chatCheck();
        }
        else {
            observer.disconnect();
            console.log("Rozłączono...");
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
    <ul class="hero-options">
                            <li data-serveroption="1" class="opt_1"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_1" name="settings" value="asd">
            <label for="settings_1" class="c-checkbox__label">Wiadomości prywatne od nieznajomych</label>
        </div></li>
                            <li data-serveroption="6" class="opt_6"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_6" name="settings" value="asd">
            <label for="settings_6" class="c-checkbox__label">Wiadomości na pocztę od nieznajomych</label>
        </div></li>
                            <li data-serveroption="3" class="opt_3"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_3" name="settings" value="asd">
            <label for="settings_3" class="c-checkbox__label">Zaproszenia do handlu od nieznajomych</label>
        </div></li>
                            <li data-serveroption="5" class="opt_5"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_5" name="settings" value="asd">
            <label for="settings_5" class="c-checkbox__label">Zaproszenia na listę przyjaciół</label>
        </div></li>
                            <li data-serveroption="21" class="opt_21"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_21" name="settings" value="asd">
            <label for="settings_21" class="c-checkbox__label">Informuj o braku miejsca w torbach</label>
        </div></li>
                            <li data-serveroption="2" class="opt_2"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_2" name="settings" value="asd">
            <label for="settings_2" class="c-checkbox__label">Zaproszenia do klanu i zgłoszenia dyplomacji</label>
        </div></li>
                            <li data-serveroption="14" class="opt_14"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_14" name="settings" value="asd">
            <label for="settings_14" class="c-checkbox__label">Zaproszenia do drużyn spoza przyjaciół, klanu i sojuszników klanowych</label>
        </div></li>
                            <li data-serveroption="9" class="opt_9"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_9" name="settings" value="asd">
            <label for="settings_9" class="c-checkbox__label">Informuj o logowaniu się klanowiczów</label>
        </div></li>
                            <li data-serveroption="15" class="opt_15"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_15" name="settings" value="asd">
            <label for="settings_15" class="c-checkbox__label">Informuj o logowaniu przyjaciół</label>
        </div></li>
                            <li data-serveroption="18" class="opt_18"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_18" name="settings" value="asd">
            <label for="settings_18" class="c-checkbox__label">Informuj o dołączeniu/opuszczeniu grupy</label>
        </div></li>
                        </ul>
    `;
}