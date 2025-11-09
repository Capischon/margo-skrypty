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