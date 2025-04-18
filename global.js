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
    let title = p.title;

    let target = p.url.startsWith('http');
    
    let url = !p.url.startsWith('http') ? BASE_PATH + p.url : p.url;


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
  

// Add a theme selector to the top of the page
let themeLabel = document.createElement('label');
themeLabel.textContent = 'Theme: ';
themeLabel.classList.add('color-scheme');

let themeSelector = document.createElement('select');
let themes = [
  { value: 'light', text: 'Light' },
  { value: 'dark', text: 'Dark' },
  { value: 'system', text: 'System Default' }
];

for (let theme of themes) {
  let option = document.createElement('option');
  option.value = theme.value;
  option.textContent = theme.text;
  themeSelector.appendChild(option);
}

themeSelector.addEventListener('change', (event) => {
  let selectedTheme = event.target.value;
  document.documentElement.setAttribute('data-theme', selectedTheme);
  localStorage.setItem('theme', selectedTheme);
});

// Load saved theme from localStorage
let savedTheme = localStorage.getItem('theme') || 'system';
themeSelector.value = savedTheme;
document.documentElement.setAttribute('data-theme', savedTheme);

themeLabel.appendChild(themeSelector);
document.body.prepend(themeLabel);
  