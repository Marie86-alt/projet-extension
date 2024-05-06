let currentSelection = ""; //Variable globale pour stocker le texte selectionné dans la page web

//fonction pour traduire une string
async function translateSelectedText(text, source = "auto", target = "fr") {
   try {
      const res = await fetch("http://localhost:5000/translate", {
         method: "POST",
         body: JSON.stringify({
            q: text,
            source: source,
            target: target,
            format: "text",
            api_key: "",
         }),
         headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
         throw new Error("La réponse du réseau n'a pas été correcte");
      }

      const data = await res.json();
      const translatedText = data.translatedText;
      return translatedText;
   } catch (error) {
      console.error("Une erreur est survenue:", error.message);
   }
}

//Ecouter le message envoyé par content
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   //Si on reçoit le texte selectionné dans la page web
   if (message.type === "selectedText") {
      //on stocke le texte dans la variable currentSelection
      currentSelection = message.text;
      console.log("2 selection reçu : ", currentSelection);
   }
});

/******************************************************************************************************************************/

let activeTabId = null;
let menuItemId = null;

// Fonction pour créer ou mettre à jour l'option de menu contextuel
function createOrUpdateContextMenu() {
   if (activeTabId !== null) {
      if (menuItemId === null) {
         // Créer l'option de menu contextuel pour l'onglet actif
         menuItemId = "translateOption_" + activeTabId;
         chrome.contextMenus.create({
            id: menuItemId,
            title: "Traduire",
            contexts: ["selection"],
         });
      } else {
         // Mettre à jour l'option de menu contextuel pour l'onglet actif
         chrome.contextMenus.update(menuItemId, {
            title: "Traduire",
            contexts: ["selection"],
         });
      }
   }
}

// Écouter les changements d'onglet
chrome.tabs.onActivated.addListener(function (activeInfo) {
   activeTabId = activeInfo.tabId;
   // Mettre à jour l'option de menu contextuel pour l'onglet actif
   createOrUpdateContextMenu();
});


/*******************************************************************************************************************************************/

//fonction qui se déclenche dès qu'on clique sur l'option dans le menu
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
   if (info.menuItemId === menuItemId) {
      const translatedText = await translateSelectedText(currentSelection); //traduit le texte
      console.log("3 Traduction : ", translatedText);

      //on envoie le texte traduit au script content
      chrome.tabs.sendMessage(tab.id, {
         type: "translation",
         translatedText: translatedText
      });
   }
});