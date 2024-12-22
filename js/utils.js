(()=>{window.debounce=function(t,{delay:a=300,leading:u=!1}={}){let l,e=!1;return(...i)=>{u&&!e&&(t(...i),e=!0),clearTimeout(l),l=setTimeout(()=>{e=!1,t(...i)},a)}};})();
