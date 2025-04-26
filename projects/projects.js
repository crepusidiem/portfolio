import { fetchJSON, renderProject } from "../global.js";

function renderProjects(projects, containerElement, headingLevel) {
    if (!(containerElement instanceof Element)) {
      console.error('Invalid container element');
      return;
    }
  
    containerElement.innerHTML = ''; // Clear existing content
  
    projects.forEach((project) => {
      renderProject(project, containerElement, headingLevel);
    });
  }
  
// Fetch the projects data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

// Append a heading to the body
console.log(projects.length + ' Projects');
const heading = document.createElement('h1');
heading.textContent = projects.length + ' Projects';
document.body.append(heading);

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
