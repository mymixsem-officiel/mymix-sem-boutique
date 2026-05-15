function getCart(){ try { return JSON.parse(localStorage.getItem('mymix-cart')||'[]').filter(function(i){ return i&&i.nom&&typeof i.prix==='number'&&i.quantite>0; }); } catch(e){ return[]; } }
function saveCart(c){ localStorage.setItem('mymix-cart',JSON.stringify(c)); afficherPanier(); }
function afficherPanier(){
  var c=document.getElementById('panier-contenu'); if(!c)return;
  var cart=getCart();
  if(cart.length===0){ c.innerHTML='<p class="panier-vide">🛒 Votre panier est vide.</p><a href="index.html" class="btn btn-retour">⬅ Retour à la boutique</a>'; } else {
    var h='<table><tr><th>Produit</th><th>Prix</th><th>Qté</th><th>Total</th><th></th></tr>', t=0;
    cart.forEach(function(i,x){ var s=i.prix*i.quantite; t+=s; h+='<tr><td>'+i.nom+'</td><td>'+i.prix+' F</td><td><button class="qte-btn" onclick="changerQuantite('+x+',-1)">-</button> '+i.quantite+' <button class="qte-btn" onclick="changerQuantite('+x+',1)">+</button></td><td>'+s+' F</td><td><button class="suppr-btn" onclick="supprimer('+x+')">🗑</button></td></tr>'; });
    h+='</table><div class="total">Total : '+t+' FCFA</div><div class="actions"><a href="index.html" class="btn btn-retour">⬅ Boutique</a><button class="btn btn-vider" onclick="viderPanier()">🗑 Vider</button></div><button class="btn btn-whatsapp" onclick="commander()">📱 Commander sur WhatsApp</button>';
    c.innerHTML=h;
  }
  afficherSuggestions();
}
function changerQuantite(i,d){ var cart=getCart(); if(!cart[i])return; cart[i].quantite+=d; if(cart[i].quantite<1)cart.splice(i,1); saveCart(cart); }
function supprimer(i){ var cart=getCart(); cart.splice(i,1); saveCart(cart); }
function viderPanier(){ if(confirm('Vider tout le panier ?')){ localStorage.removeItem('mymix-cart'); afficherPanier(); } }
function commander(){  var user = JSON.parse(localStorage.getItem('mymix-user'));
  var cart=getCart();
  if(cart.length===0)return;
  var m='Bonjour Mymix Sem ! Je souhaite commander :%0A%0A',t=0;
  cart.forEach(function(i){ m+='- '+i.nom+' x'+i.quantite+' : '+(i.prix*i.quantite)+' FCFA%0A'; t+=i.prix*i.quantite; });
  m+='%0ATotal : '+t+' FCFA%0A%0AMerci !';
  
  // Enregistrer la commande
  var commandes = JSON.parse(localStorage.getItem('mymix-commandes')||'[]');
  commandes.push({
    date: new Date().toLocaleString('fr-FR'),
    total: t,
    produits: cart.map(function(i){ return i.nom+' x'+i.quantite; }).join(', ')
  });
  localStorage.setItem('mymix-commandes', JSON.stringify(commandes));
  
  window.open('https://wa.me/2290166682765?text='+m,'_blank');
}

// Suggestions
var tousProduits = [
  { nom:'Wax Miss Africa 01', prix:15000, img:'assets/images/wax/wax-miss-africa-01.jpg' },
  { nom:'Wax Miss Africa 03', prix:15000, img:'assets/images/wax/wax-miss-africa-03.jpg' },
  { nom:'Wax Miss Africa 05', prix:15000, img:'assets/images/wax/wax-miss-africa-05.jpg' },
  { nom:'Parfum Oriental 03', prix:2000, img:'assets/images/parfums/parfum-03.jpeg' },
  { nom:'Parfum Oriental 07', prix:2000, img:'assets/images/parfums/parfum-07.jpeg' },
  { nom:'Parfum Oriental 12', prix:2000, img:'assets/images/parfums/parfum-12.jpeg' },
  { nom:'Chaussures Stylion 04', prix:25000, img:'assets/images/chaussures/chaussure-04.jpeg' },
  { nom:'Chaussures Stylion 08', prix:25000, img:'assets/images/chaussures/chaussure-08.jpeg' },
  { nom:'Sac Stylion Dellanear 03', prix:18000, img:'assets/images/accessoires/sac-3-stylion-dellanear.jpg' },
  { nom:'Sac Stylion Dellanear 05', prix:18000, img:'assets/images/accessoires/sac-5-stylion-dellanear.jpg' }
];

function afficherSuggestions() {
  var suggDiv = document.getElementById('suggestions');
  if (!suggDiv) return;
  var cart = getCart();
  var nomsDansPanier = cart.map(function(i) { return i.nom; });
  var disponibles = tousProduits.filter(function(p) { return nomsDansPanier.indexOf(p.nom) === -1; });
  disponibles.sort(function() { return Math.random() - 0.5; });
  var selection = disponibles.slice(0, 4);
  suggDiv.innerHTML = '';
  selection.forEach(function(s) {
    var div = document.createElement('div'); div.className = 'sugg-card';
    div.innerHTML = '<img src="'+s.img+'" alt="'+s.nom+'"><p>'+s.nom+'</p><p style="color:#C9A84C;">'+s.prix+' FCFA</p><button onclick="ajouterSuggestion(\''+s.nom+'\','+s.prix+')">+ Ajouter</button>';
    suggDiv.appendChild(div);
  });
}

function ajouterSuggestion(nom, prix) {
  var cart = getCart();
  var ex = cart.find(function(i) { return i.nom === nom; });
  if (ex) ex.quantite += 1;
  else cart.push({ id: 'sugg-'+Date.now(), nom: nom, prix: prix, quantite: 1 });
  saveCart(cart);
}

afficherPanier();
