(function(){
 var st=document.createElement('style');st.textContent="#prex-reviews{--b:#a96b0d;--bg:#fcf8f4;--t:#2b2118;--m:#8a8178;font-family:inherit;max-width:1200px;margin:0 auto;padding:8px}\n#prex-reviews *{box-sizing:border-box}\n#prex-reviews .pr-head{background:var(--bg);border-radius:20px;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}\n#prex-reviews .pr-score{display:flex;align-items:center;gap:10px;font-size:28px;font-weight:600;color:var(--t)}\n#prex-reviews .pr-stars{color:#fbbc04;letter-spacing:2px;font-size:22px;line-height:1}\n#prex-reviews .pr-g{font-size:28px;font-weight:600;letter-spacing:-1px}\n#prex-reviews .pr-btn{background:var(--b);color:#fff!important;text-decoration:none!important;padding:12px 26px;border-radius:999px;font-weight:600;font-size:15px}\n#prex-reviews .pr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:16px}\n#prex-reviews .pr-card{background:var(--bg);border-radius:20px;padding:24px 28px}\n#prex-reviews .pr-who{display:flex;align-items:center;gap:14px}\n#prex-reviews .pr-av{width:48px;height:48px;border-radius:50%;background:#b0185a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden;flex:none}\n#prex-reviews .pr-avw{position:relative;flex:none}#prex-reviews .pr-gb{position:absolute;right:-6px;bottom:-4px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;font:700 13px Arial,sans-serif;color:#4285f4}#prex-reviews .pr-ok{color:var(--b);font-size:15px;margin-left:4px}#prex-reviews .pr-av img{width:100%;height:100%;object-fit:cover}\n#prex-reviews .pr-name{font-weight:600;color:var(--t);font-size:17px}\n#prex-reviews .pr-when{color:var(--m);font-size:14px}\n#prex-reviews .pr-card .pr-stars{font-size:18px;margin:14px 0 8px}\n#prex-reviews .pr-txt{color:var(--t);font-size:16px;line-height:1.55;margin:0}\n#prex-reviews .pr-more{color:var(--b);cursor:pointer;background:none;border:0;padding:0;font:inherit;margin-top:6px}\n#prex-reviews .pr-clamp{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}";document.head.appendChild(st);
 function run(){
  var el=document.getElementById('prex-reviews');if(!el)return;
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function stars(n){return '★★★★★'.slice(0,Math.round(n||5))}
  function ago(iso){var d=(Date.now()-new Date(iso))/864e5;if(isNaN(d))return '';
    if(d<1)return 'bugün';if(d<30)return Math.floor(d)+' gün önce';
    if(d<365)return Math.floor(d/30)+' ay önce';return Math.floor(d/365)+' yıl önce'}
  fetch((el.getAttribute('data-src')||'https://cdn.jsdelivr.net/gh/prextour/prex-reviews@main/reviews.json'),{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){
    var h='<div class="pr-head"><div class="pr-score">'+String(d.rating||5).replace('.',',')+
      (String(d.rating).indexOf('.')<0?',0':'')+' <span class="pr-stars">'+stars(d.rating)+'</span> <span class="pr-g">Google</span></div>'+
      (d.writeUri?'<a class="pr-btn" target="_blank" rel="noopener" href="'+esc(d.writeUri)+'">Bizi Google üzerinde değerlendirin</a>':'')+'</div><div class="pr-grid">';
    var minR=+(el.getAttribute('data-min-rating')||0),maxN=+(el.getAttribute('data-max')||5),hide=(el.getAttribute('data-hide')||'').toLowerCase().split(',').map(function(x){return x.trim()}).filter(Boolean);
    (d.reviews||[]).filter(function(r){return (r.rating||0)>=minR&&hide.indexOf((r.name||'').toLowerCase())<0}).slice(0,maxN).forEach(function(r){
      var av=r.photo?'<img src="'+esc(r.photo)+'" alt="" referrerpolicy="no-referrer">':esc((r.name||'?').charAt(0).toUpperCase());
      var long=(r.text||'').length>150;
      h+='<div class="pr-card"><div class="pr-who"><div class="pr-avw"><div class="pr-av">'+av+'</div><span class="pr-gb">G</span></div><div><div class="pr-name">'+esc(r.name)+'<span class="pr-ok">✔</span>'+
        '</div><div class="pr-when">'+ago(r.time)+'</div></div></div><div class="pr-stars">'+stars(r.rating)+
        '</div><p class="pr-txt'+(long?' pr-clamp':'')+'">'+esc(r.text)+'</p>'+(long?'<button class="pr-more">Daha fazla oku</button>':'')+'</div>';
    });
    el.innerHTML=h+'</div>';
    el.addEventListener('click',function(e){var b=e.target.closest('.pr-more');if(!b)return;
      var p=b.previousElementSibling;p.classList.toggle('pr-clamp');b.textContent=p.classList.contains('pr-clamp')?'Daha fazla oku':'Daha az göster'});
  }).catch(function(){el.style.display='none'});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
