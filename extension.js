async function translateText() {
   try {
      const translate = document.getElementById("inputTranslate").value;
      const res = await fetch("http://localhost:5000/translate", {
         method: "POST",
         body: JSON.stringify({
            q: translate,
            source: "auto",
            target: "fr",
            format: "text",
            api_key: ""
         }),
         headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
         throw new Error('La réponse du réseau n\'a pas été correcte');
      }

      const data = await res.json();
      const translatedText = data.translatedText;
      document.getElementById("translatedText").value = translatedText;
   } catch (error) {
      console.error('Une erreur est survenue:', error.message);
   }
}

// Appel initial de la fonction de traduction
translateText();

// Sélection du champ de texte
const inputTranslate = document.getElementById("inputTranslate");

// Ajout d'un écouteur d'événement pour la touche "Entrée"
inputTranslate.addEventListener("keydown", function (event) {
   if (event.key === "Enter") {
      translateText();
   }
});

// Ajout d'un écouteur d'événement pour le clic sur le bouton de recherche Google
document.getElementById("inputTranslate").addEventListener("click", function () {
   const query = document.getElementById("inputTranslate").value;
   if (query) {
      const googleTranslateUrl = `https://translate.google.fr/?sl=auto&tl=fr&text=${encodeURIComponent(query)}`;
      chrome.tabs.create({ url: googleTranslateUrl });
   }
});