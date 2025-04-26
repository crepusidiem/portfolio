import { fetchJSON, renderProjects } from "../global.js";

// Fetch the projects data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
