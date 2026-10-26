(() => {
  const consentKey = "krofftCookieConsent";
  const returnToKey = "krofftConsentReturnTo";
  const isExternalUrl = (value) => {
    try {
      return new URL(value).origin !== window.location.origin;
    } catch {
      return false;
    }
  };

  try {
    if (isExternalUrl(document.referrer)) {
      sessionStorage.setItem(returnToKey, document.referrer);
    }
  } catch (error) {
    console.error("Nie udało się zapisać poprzedniej strony.", error);
  }

  const loadOptionalContent = () => {
    document.querySelectorAll("[data-cookie-src]").forEach((frame) => {
      frame.src = frame.dataset.cookieSrc;
      frame.hidden = false;
      frame.previousElementSibling?.remove();
    });
  };

  try {
    if (
      localStorage.getItem(consentKey) === "accepted" ||
      localStorage.getItem("cookiesAccepted") === "true"
    ) {
      loadOptionalContent();
      return;
    }
  } catch (error) {
    console.error("Nie udało się odczytać zgody na pliki cookie.", error);
  }

  const banner = document.createElement("section");
  banner.className = "cookie-consent";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Zgoda na pliki cookie");
  banner.innerHTML = `
    <div class="cookie-consent__content">
      <p class="cookie-consent__title">Czy wyrażasz zgodę na pliki cookie?</p>
      <p class="cookie-consent__text">
        Zgoda pozwoli nam zapamiętać Twój wybór i załadować zewnętrzne elementy,
        które mogą korzystać z plików cookie. Jeśli odmówisz,
        opuścisz stronę i wrócisz do poprzednio odwiedzonej witryny.
      </p>
      <p class="cookie-consent__error" role="alert" hidden>
        Nie udało się zapisać zgody. Sprawdź ustawienia prywatności przeglądarki
        i spróbuj ponownie.
      </p>
    </div>
    <div class="cookie-consent__actions">
      <button class="cookie-consent__button cookie-consent__button--decline" type="button" data-consent="decline">
        Nie zgadzam się
      </button>
      <button class="cookie-consent__button cookie-consent__button--accept" type="button" data-consent="accept">
        Tak, zgadzam się
      </button>
    </div>
  `;

  banner
    .querySelector('[data-consent="accept"]')
    .addEventListener("click", () => {
      try {
        localStorage.setItem(consentKey, "accepted");
        loadOptionalContent();
        banner.remove();
      } catch (error) {
        console.error("Nie udało się zapisać zgody na pliki cookie.", error);
        banner.querySelector(".cookie-consent__error").hidden = false;
      }
    });

  banner
    .querySelector('[data-consent="decline"]')
    .addEventListener("click", () => {
      let returnTo = "";
      try {
        returnTo = sessionStorage.getItem(returnToKey) || "";
      } catch (error) {
        console.error("Nie udało się odczytać poprzedniej strony.", error);
      }

      if (isExternalUrl(returnTo)) {
        window.location.replace(returnTo);
      } else {
        window.history.back();
      }
    });

  document.body.append(banner);
})();
