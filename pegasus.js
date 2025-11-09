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
    <ul class="hero-options" style="list-style: none; color: black">
                            <li data-serveroption="1" class="opt_1"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_1" name="settings" value="asd">
            <label for="settings_1" class="c-checkbox__label">Dźwięk</label>
        </div></li>
                            <li data-serveroption="6" class="opt_6"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_6" name="settings" value="asd">
            <label for="settings_6" class="c-checkbox__label">Powiadomienia</label>
        </div></li>
                            <li data-serveroption="3" class="opt_3"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_3" name="settings" value="asd">
            <label for="settings_3" class="c-checkbox__label">Podświetlenie</label>
        </div></li>
                            <li data-serveroption="5" class="opt_5"><div class="checkbox-custom c-checkbox">
            <input type="checkbox" id="settings_5" name="settings" value="asd">
            <label for="settings_5" class="c-checkbox__label">Słownik</label>
        </div></li>
    </ul>
    `;
}