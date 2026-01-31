document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/offer');
    const offer = await res.json();

    if (!offer || !offer.isActive) return;

    // show only once
    if (localStorage.getItem('offer_shown')) return;

    setTimeout(() => {
      showOfferPopup(offer);
      localStorage.setItem('offer_shown', 'yes');
    }, (offer.delay || 10) * 1000);

  } catch (err) {
    console.error('Offer popup error', err);
  }
});

function showOfferPopup(offer) {
  const overlay = document.createElement('div');
  overlay.className = 'offer-popup-overlay';

  overlay.innerHTML = `
    <div class="offer-popup">
      <button class="offer-close">&times;</button>

      <img src="${offer.image}" alt="Offer Image">

      <div class="offer-content">
        <h3>${offer.title}</h3>

        <a href="/booking.html" class="offer-btn">
          Know More
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // CLOSE
  overlay.querySelector('.offer-close').onclick = () => {
    overlay.remove();
  };
}
