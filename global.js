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

// Set the initial value based on the current color scheme
let currentScheme = getComputedStyle(document.documentElement).getPropertyValue('color-scheme').trim();
themeSelector.value = currentScheme === 'dark' ? 'dark' : currentScheme === 'light' ? 'light' : 'system';
document.documentElement.style.setProperty('color-scheme', themeSelector.value);

// Listen for changes to the theme selector and update the color scheme accordingly
themeSelector.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value
});

// Check if a color scheme preference exists in localStorage
if ("colorScheme" in localStorage) {
  let savedScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedScheme);
  themeSelector.value = savedScheme;
}

themeLabel.appendChild(themeSelector);
document.body.prepend(themeLabel);

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } 
  catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProject(project, containerElement, headingLevel = 'h2') {
  // Your code will go here
  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadings.includes(headingLevel)) {
        console.warn(`Invalid headingLevel "${headingLevel}" provided. Defaulting to h2.`);
        headingLevel = 'h2'; // Default to h2 if invalid heading level is provided
    }
  
  const article = document.createElement('article');
  article.innerHTML = `
    <${headingLevel}>${project.title}</${headingLevel}>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
    <p style="font-family: Baskerville; color: gray; font-variant-numeric: oldstyle-nums">${project.year}</p> 
  `;

  if (containerElement) {
    containerElement.appendChild(article);
  } else {
      console.warn('Warning: containerElement is null. Cannot append article.');
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!(containerElement instanceof Element)) {
    console.error('Invalid container element');
    return;
  }

  containerElement.innerHTML = ''; // Clear existing content

  projects.forEach((project) => {
    renderProject(project, containerElement, headingLevel);
  });
}

export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);

}


