console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$('nav a');
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );
  
// currentLink?.classList.add('current');

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "/"                  // Local server
: "https://crepusidiem.github.io/portfolio/";         // GitHub Pages repo name

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/crepusidiem/', title: 'Github' },
  ];
  
let nav = document.createElement('nav');
let ul = document.createElement('ul');
nav.appendChild(ul);
document.body.prepend(nav);
  
for (let p of pages) {
    let url = p.url;
    let title = p.title;

    let target = url.startsWith('http');
    
    url = !url.startsWith('http') ? BASE_PATH + url : url;


    let li = document.createElement('li');
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (target) {
        a.target = '_blank';
    }

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
      

    li.appendChild(a);
    ul.appendChild(li);
  }
  


if (!url.startsWith('http')) {
url = BASE_PATH + url;
}
  