var cart = [];
try { cart = JSON.parse(localStorage.getItem('mymix-cart')) || []; } catch(e) { cart = []; }
cart = cart.filter(function(i) { return i && i.id && i.nom && typeof i.prix === 'number' && i.quantite > 0; });
function saveCart() { localStorage.setItem('mymix-cart', JSON.stringify(cart)); updateCartUI(); }
function updateCartUI() { var cs = document.getElementById('cart-count'); if (cs) cs.textContent = cart.reduce(function(s, i) { return s + i.quantite; }, 0); }
function bindCartButtons() {
  var btns = document.querySelectorAll('.btn-add-cart');
  for (var i = 0; i < btns.length; i++) {
    btns[i].onclick = function() {
      var id = this.getAttribute('data-id'), nom = this.getAttribute('data-nom'), prix = parseInt(this.getAttribute('data-prix'));
      if (!id || !nom || isNaN(prix)) return;
      var ex = cart.find(function(item) { return item.id === id; });
      if (ex) ex.quantite += 1; else cart.push({ id: id, nom: nom, prix: prix, quantite: 1 });
      saveCart(); this.textContent = 'Ajouté ✓'; var btn = this;
      setTimeout(function() { btn.textContent = 'Ajouter au panier'; }, 1000);
    };
  }
}
var cartIcon = document.getElementById('cart-icon');
if (cartIcon) { cartIcon.onclick = function() { window.location.href = 'panier.html'; }; }

var menuToggle = document.getElementById('menu-toggle'), navMenu = document.getElementById('nav-menu');
if (menuToggle && navMenu) { menuToggle.onclick = function(e) { e.stopPropagation(); navMenu.classList.toggle('active'); }; document.addEventListener('click', function(e) { if (!navMenu.contains(e.target) && e.target !== menuToggle) navMenu.classList.remove('active'); }); }

function toggleGalerie(id) {
  var gals = document.querySelectorAll('.galerie.active');
  for (var i = 0; i < gals.length; i++) { if (gals[i].id !== id) gals[i].classList.remove('active'); }
  var g = document.getElementById(id); if (!g) return; g.classList.toggle('active'); if (g.classList.contains('active')) remplirGalerie(id);
}
function remplirGalerie(id) {
  var cf = { 'galerie-wax': { n: 10, p: 'wax/wax-miss-africa-', e: 'jpg', c: 'wax' }, 'galerie-parfums': { n: 23, p: 'parfums/parfum-', e: 'jpeg', c: 'parfums' }, 'galerie-chaussures': { n: 12, p: 'chaussures/chaussure-', e: 'jpeg', c: 'chaussures' }, 'galerie-accessoires': { n: 7, p: 'accessoires/sac-', e: 'jpg', c: 'accessoires', s: '-stylion-dellanear' } };
  var c = cf[id]; if (!c) return; var grid = document.getElementById(id + '-grid'); if (!grid || grid.children.length > 0) return;
  for (var i = 1; i <= c.n; i++) {
    var div = document.createElement('div'); div.className = 'galerie-item';
    var src = c.s ? 'assets/images/' + c.p + i + c.s + '.' + c.e : 'assets/images/' + c.p + (i < 10 ? '0' : '') + i + '.' + c.e;
    div.style.backgroundImage = "url('" + src + "')";
    (function(idx, cat, srcImg) {
      div.onclick = function() {
        var n = cat === 'wax' ? 'Wax Miss Africa ' + (idx+1) : cat === 'parfums' ? 'Parfum Oriental ' + (idx+1) : cat === 'chaussures' ? 'Chaussures Stylion ' + (idx+1) : 'Sac Stylion Dellanear ' + (idx+1);
        var p = cat === 'wax' ? '15 000 FCFA' : cat === 'parfums' ? '2 000 FCFA' : cat === 'chaussures' ? '25 000 FCFA' : '18 000 FCFA';
        var prixNum = cat === 'wax' ? 15000 : cat === 'parfums' ? 2000 : cat === 'chaussures' ? 25000 : 18000;
        document.getElementById('produit-modal-nom').textContent = n;
        document.getElementById('produit-modal-prix').textContent = p;
document.getElementById('produit-modal-desc').textContent = 'Motif wax authentique. Coton medium, qualité supérieure.';
        document.getElementById('produit-modal-img').src = srcImg;
        var btnCart = document.getElementById('produit-modal-cart');
        if (btnCart) {
          btnCart.setAttribute('data-id', 'gal-' + cat + '-' + (idx+1));
          btnCart.setAttribute('data-nom', n);
          btnCart.setAttribute('data-prix', prixNum);
        }
        document.getElementById('produit-modal').classList.add('active');
      };
    })(i-1, c.c, src);
    grid.appendChild(div);
  }
}
document.getElementById('close-produit-modal').onclick = function() { document.getElementById('produit-modal').classList.remove('active'); };
document.addEventListener('click', function(e) { if (e.target.id === 'produit-modal') document.getElementById('produit-modal').classList.remove('active'); });

setTimeout(function() {
  var counters = document.querySelectorAll('.counter-number'); if (counters.length > 0) {
    var obs = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { var t = parseInt(entry.target.getAttribute('data-target')); if (!t || entry.target.dataset.animated) return; entry.target.dataset.animated = true; var d = 2000, s = t / (d / 16), c = 0, el = entry.target; function up() { c += s; if (c < t) { el.textContent = Math.floor(c); requestAnimationFrame(up); } else el.textContent = t; } up(); } }); }, { threshold: 0.3 });
    for (var i = 0; i < counters.length; i++) obs.observe(counters[i]);
  }
}, 500);


var searchInput = document.getElementById('search-input'), searchBtn = document.getElementById('search-btn');
if (searchBtn && searchInput) { searchBtn.onclick = function() { var q = searchInput.value.toLowerCase().trim(); var gals = document.querySelectorAll('.galerie'); if (q === '') { for (var g = 0; g < gals.length; g++) gals[g].classList.remove('active'); return; } for (var g = 0; g < gals.length; g++) { var gal = gals[g], id = gal.id, cat = ''; if (id === 'galerie-wax') cat = 'wax'; else if (id === 'galerie-parfums') cat = 'parfums'; else if (id === 'galerie-chaussures') cat = 'chaussures'; else if (id === 'galerie-accessoires') cat = 'sacs'; if (cat.indexOf(q) !== -1) { gal.classList.add('active'); if (gal.querySelector('.galerie-grid').children.length === 0) remplirGalerie(id); } else gal.classList.remove('active'); } }; searchInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') searchBtn.onclick(); }); }

// ========== COMPTE (VÉRIFICATION PAR CODE) ==========
var lienCompte = document.getElementById('lien-compte'), compteModal = document.getElementById('compte-modal'), closeCompteModal = document.getElementById('close-compte-modal');
var compteSubmitBtn = document.getElementById('compte-submit'), switchConnexion = document.getElementById('switch-connexion');
var compteStep1 = document.getElementById('compte-step1'), compteStep2 = document.getElementById('compte-step2'), compteStep3 = document.getElementById('compte-step3');
var codeVerification = document.getElementById('code-verification'), compteVerification = document.getElementById('compte-verification');
var compteVerifyBtn = document.getElementById('compte-verify-btn'), verificationError = document.getElementById('verification-error');
var profilId = document.getElementById('profil-id'), profilNom = document.getElementById('profil-nom'), profilPrenom = document.getElementById('profil-prenom'), profilTel = document.getElementById('profil-tel');
var compteDeconnexion = document.getElementById('compte-deconnexion');
var currentCode = '', currentTel = '', modeCompte = 'inscription';

if (lienCompte) { lienCompte.onclick = function(e) { e.preventDefault(); var user = JSON.parse(localStorage.getItem('mymix-user')); if (user) { compteStep1.style.display = 'none'; compteStep2.style.display = 'none'; compteStep3.style.display = 'block'; profilId.textContent = user.id; profilNom.textContent = user.nom; profilPrenom.textContent = user.prenom; profilTel.textContent = user.tel; } else { compteStep1.style.display = 'block'; compteStep2.style.display = 'none'; compteStep3.style.display = 'none'; document.getElementById('compte-titre').textContent = 'CRÉER UN COMPTE'; modeCompte = 'inscription'; compteSubmitBtn.textContent = "S'INSCRIRE"; } compteModal.classList.add('active'); }; }
if (closeCompteModal) { closeCompteModal.onclick = function() { compteModal.classList.remove('active'); }; }
window.addEventListener('click', function(e) { if (e.target === compteModal) compteModal.classList.remove('active'); });
if (switchConnexion) { switchConnexion.onclick = function(e) { e.preventDefault(); if (modeCompte === 'inscription') { modeCompte = 'connexion'; document.getElementById('compte-titre').textContent = 'SE CONNECTER'; compteSubmitBtn.textContent = 'SE CONNECTER'; } else { modeCompte = 'inscription'; document.getElementById('compte-titre').textContent = 'CRÉER UN COMPTE'; compteSubmitBtn.textContent = "S'INSCRIRE"; } }; }
if (compteSubmitBtn) { compteSubmitBtn.onclick = function() { var tel = document.getElementById('compte-tel').value.trim(), code = document.getElementById('compte-code').value.trim(), nom = document.getElementById('compte-nom').value.trim(), prenom = document.getElementById('compte-prenom').value.trim(); if (!tel || !code) { alert('Remplis le numéro et le code secret.'); return; } if (code.length < 4) { alert('Code secret : 4 chiffres minimum.'); return; } var users = JSON.parse(localStorage.getItem('mymix-users')) || []; var existe = users.find(function(u) { return u.tel === tel; }); if (modeCompte === 'inscription') { if (existe) { alert('Ce numéro est déjà inscrit. Connectez-vous.'); return; } currentCode = Math.floor(100000 + Math.random() * 900000).toString(); currentTel = tel; compteStep1.style.display = 'none'; compteStep2.style.display = 'block'; compteStep3.style.display = 'none'; codeVerification.textContent = currentCode; compteVerification.value = ''; verificationError.style.display = 'none'; } else { if (!existe) { alert('Aucun compte avec ce numéro. Créez un compte.'); return; } if (existe.code !== code) { alert('Code secret incorrect.'); return; } localStorage.setItem('mymix-user', JSON.stringify(existe)); compteStep1.style.display = 'none'; compteStep2.style.display = 'none'; compteStep3.style.display = 'block'; profilId.textContent = existe.id; profilNom.textContent = existe.nom; profilPrenom.textContent = existe.prenom; profilTel.textContent = existe.tel; } }; }
if (compteVerifyBtn) { compteVerifyBtn.onclick = function() { var saisie = compteVerification.value.trim(); if (saisie === currentCode) { var users = JSON.parse(localStorage.getItem('mymix-users')) || []; var userId = 'MMS-' + Date.now().toString(36).toUpperCase(); var nouveauUser = { id: userId, nom: document.getElementById('compte-nom').value.trim(), prenom: document.getElementById('compte-prenom').value.trim(), tel: currentTel, code: document.getElementById('compte-code').value.trim() }; users.push(nouveauUser); localStorage.setItem('mymix-users', JSON.stringify(users)); localStorage.setItem('mymix-user', JSON.stringify(nouveauUser)); compteStep1.style.display = 'none'; compteStep2.style.display = 'none'; compteStep3.style.display = 'block'; profilId.textContent = userId; profilNom.textContent = nouveauUser.nom; profilPrenom.textContent = nouveauUser.prenom; profilTel.textContent = nouveauUser.tel; } else { verificationError.style.display = 'block'; } }; }
if (compteDeconnexion) { compteDeconnexion.onclick = function() { localStorage.removeItem('mymix-user'); compteStep1.style.display = 'block'; compteStep2.style.display = 'none'; compteStep3.style.display = 'none'; document.getElementById('compte-titre').textContent = 'CRÉER UN COMPTE'; modeCompte = 'inscription'; compteSubmitBtn.textContent = "S'INSCRIRE"; compteModal.classList.remove('active'); alert('Déconnecté(e).'); }; }

bindCartButtons(); updateCartUI();

// ========== FORMULAIRE DE CONTACT ==========
var contactSubmit = document.getElementById('contact-submit');
if (contactSubmit) {
  contactSubmit.onclick = function() {
    var nom = document.getElementById('contact-nom').value.trim();
    var tel = document.getElementById('contact-tel').value.trim();
    var message = document.getElementById('contact-message').value.trim();
    
    if (!nom || !message) {
      alert('Veuillez remplir votre nom et votre message.');
      return;
    }
    
    var whatsappMsg = 'Bonjour Mymix Sem !%0A%0A' + message + '%0A%0A— ' + nom + (tel ? '%0A📱 ' + tel : '');
    window.open('https://wa.me/2290166682765?text=' + whatsappMsg, '_blank');
    
    document.getElementById('contact-nom').value = '';
    document.getElementById('contact-tel').value = '';
    document.getElementById('contact-message').value = '';
  };
}

// ========== À PROPOS ==========
setTimeout(function() {
  var aboutLink = document.querySelector('a[href="#about"]');
  var aboutSection = document.getElementById('about');
  var aboutTimer;
  if (aboutLink && aboutSection) {
    aboutLink.onclick = function(e) {
      e.preventDefault();
      aboutSection.classList.add('visible');
      clearTimeout(aboutTimer);
      aboutTimer = setTimeout(function() {
        aboutSection.classList.remove('visible');
      }, 60000);
    };
    aboutSection.onclick = function() {
      aboutSection.classList.remove('visible');
      clearTimeout(aboutTimer);
    };
  }
}, 1000);

// ========== MUSIQUE DE FOND ==========
var bgMusic = document.getElementById('bg-music');
var musicToggle = document.getElementById('music-toggle');
var musicOn = false;

if (musicToggle && bgMusic) {
  musicToggle.onclick = function() {
    if (musicOn) {
      bgMusic.pause();
      musicToggle.textContent = '🔇';
    } else {
      bgMusic.play();
      musicToggle.textContent = '🔊';
    }
    musicOn = !musicOn;
  };
}

// ========== AFFICHER/MASQUER FORMULAIRE CONTACT ==========
var showContactBtn = document.getElementById('show-contact-btn');
var contactFormContainer = document.getElementById('contact-form-container');
if (showContactBtn && contactFormContainer) {
  showContactBtn.onclick = function() {
    if (contactFormContainer.style.display === 'none') {
      contactFormContainer.style.display = 'block';
      showContactBtn.textContent = '📩 Fermer le formulaire';
    } else {
      contactFormContainer.style.display = 'none';
      showContactBtn.textContent = '📩 Cliquez ici pour nous écrire';
    }
  };
}





// ========== BULLES FLOTTANTES (15 bulles réparties) ==========
(function() {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var bc = document.createElement('div');
  bc.classList.add('bubbles-container');
  hero.appendChild(bc);
  
  var couleurs = [
    'radial-gradient(circle, #C9A84C, #6B1D1D)',
    'radial-gradient(circle, #E8D48B, #0D0D0D)',
    'radial-gradient(circle, #F9F6F0, #6B1D1D)',
    'radial-gradient(circle, #C9A84C, #0D0D0D)',
    'radial-gradient(circle, #8B1A1A, #C9A84C)',
    'radial-gradient(circle, #E8D48B, #6B1D1D)'
  ];
  
  for (var i = 0; i < 15; i++) {
    var b = document.createElement('div');
    b.classList.add('bubble');
    var s = Math.random() * 60 + 30;
    var couleur = couleurs[Math.floor(Math.random() * couleurs.length)];
    var posX, posY;
    
    if (i < 4) {
      // 4 bulles en bas
      posX = Math.random() * 90;
      posY = 50 + Math.random() * 40;
    } else if (i < 7) {
      // 3 bulles à droite
      posX = 70 + Math.random() * 25;
      posY = Math.random() * 80;
    } else if (i < 10) {
      // 3 bulles à gauche
      posX = Math.random() * 25;
      posY = Math.random() * 80;
    } else {
      // 5 bulles partout
      posX = Math.random() * 90;
      posY = Math.random() * 80;
    }
    
    var vitesse = Math.random() * 8 + 10;
    var delai = Math.random() * 5;
    b.style.cssText = 'width:'+s+'px;height:'+s+'px;left:'+posX+'%;top:'+posY+'%;background:'+couleur+';animation-duration:'+vitesse+'s;animation-delay:'+delai+'s;';
    bc.appendChild(b);
  }
})();
