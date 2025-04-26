import { fetchJSON, renderProject } from "../global.js";

function renderProjects(projects, containerElement, headingLevel) {
    if (!(containerElement instanceof Element)) {
      console.error('Invalid container element');
      return;
    }
  
    containerElement.innerHTML = ''; // clear once!
  
    projects.forEach((project) => {
      renderProject(project, containerElement, headingLevel);
    });
  }
  
// Fetch the projects data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

