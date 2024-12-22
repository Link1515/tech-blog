(()=>{var a=document.querySelector("#searchModal"),l=document.querySelector("#searchInput"),r=document.querySelector("#searchResults"),u=document.querySelector("#searchNoResult"),i=document.querySelector("#logo");a.addEventListener("shown.bs.modal",()=>l.focus());var h=i.href;fetch(`${h}search.json`).then(e=>e.json()).then(e=>{let n=new window.Fuse(e,{keys:["title"]});l.addEventListener("input",window.debounce(t=>{f();let s=t.target.value;if(!s){c();return}let o=n.search(s);if(o.length===0){c(),m();return}d(o)},{leading:!0}))});function c(){r.innerHTML=""}function d(e){let n=e.map(t=>`
        <a href="${t.item.link}" class="list-group-item list-group-item-action">
          ${t.item.title}
        </a>
      `).join("");r.innerHTML=n}function m(){u.style.display="block"}function f(){u.style.display="none"}})();
