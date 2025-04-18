console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$('nav a');
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );
  
// currentLink?.classList.add('current');

let pages = [
    { url: '/portfolio/', title: 'Home' },
    { url: '/portfolio/projects/', title: 'Projects' },
    { url: '/portfolio/resume/', title: 'Resume' },
    { url: '/portfolio/contact/', title: 'Contact' },
    { url: 'https://github.com/crepusidiem/', title: 'Github' },
  ];
  
let nav = document.createElement('nav');
let ul = document.createElement('ul');
nav.appendChild(ul);
document.body.prepend(nav);
  
for (let p of pages) {
    let url = p.url;
    let title = p.title;

    let li = document.createElement('li');
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (url.startsWith('http')) {
        a.setAttribute('target', '_blank');
    }

    li.appendChild(a);
    ul.appendChild(li);
  }
  
  const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/website/";         // GitHub Pages repo name
