var prenoms = ["Aminata","Fatima","Grace","Marie","Patricia","Nadège","Aïcha","Kadiatou","Mariam","Bintou","Salimata","Ramatou","Fanta","Adjaratou","Maimouna","Hawa","Djeneba","Awa","Oumou","Saran"];
var messages = ["J'adore mes achats !","Magnifique wax, je recommande.","Parfum qui tient toute la journée.","Service client au top !","Livraison rapide, merci.","Les couleurs sont sublimes.","Cliente fidèle depuis des mois.","Qualité prix imbattable.","Encore ravie de ma commande !","Correct, délais un peu longs.","Est-ce que vous livrez au Togo ?","Je suis en Côte d'Ivoire, possible ?"];
var container = document.getElementById('avis-container');
if (container) {
  container.innerHTML = '';
  function afficherAvis() {
    var nom = prenoms[Math.floor(Math.random() * prenoms.length)];
    var msg = messages[Math.floor(Math.random() * messages.length)];
    var note = Math.floor(Math.random() * 2) + 4;
    container.innerHTML = '<div class="avis-card"><div class="avis-header"><span class="avis-nom">'+nom+'</span><span class="avis-etoiles-display">'+'★'.repeat(note)+'☆'.repeat(5-note)+'</span></div><p class="avis-message">"'+msg+'"</p><span class="avis-date">'+new Date().toLocaleDateString('fr-FR')+'</span></div>';
  }
  afficherAvis(); setInterval(afficherAvis, 5000);
}
var selectedRating = 0;
document.querySelectorAll('.star').forEach(function(s) {
  s.addEventListener('click', function() {
    selectedRating = parseInt(this.getAttribute('data-value'));
    document.querySelectorAll('.star').forEach(function(st, i) { st.textContent = i < selectedRating ? '★' : '☆'; st.classList.toggle('active', i < selectedRating); });
  });
});
document.getElementById('comment-submit')?.addEventListener('click', function() {
  var nom = document.getElementById('comment-nom').value.trim(), message = document.getElementById('comment-message').value.trim();
  if (!nom || !message || selectedRating === 0) { alert('Remplissez tous les champs.'); return; }
  alert('Avis envoyé ! Merci ' + nom + '.');
  document.getElementById('comment-nom').value = ''; document.getElementById('comment-message').value = ''; selectedRating = 0;
  document.querySelectorAll('.star').forEach(function(st) { st.textContent = '☆'; st.classList.remove('active'); });
});
