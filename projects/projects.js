import { fetchJSON, renderProjects } from "../global.js";
  
// Fetch the projects data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

// Append a heading to the body
const nav = document.querySelector('nav');
const heading = document.createElement('h1');
heading.textContent = projects.length + ' Projects';

if (nav && nav.parentNode) {
  nav.parentNode.insertBefore(heading, nav.nextSibling);
}

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
