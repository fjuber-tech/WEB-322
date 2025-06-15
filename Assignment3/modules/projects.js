const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projects = projectData.map((proj) => {
                const sector = sectorData.find(sec => sec.id === proj.sector_id);
                return {
                    ...proj,
                    sector: sector ? sector.sector_name : "Unknown"
                };
            });
            resolve();
        } catch (err) {
            reject("Failed to initialize project data");
        }
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length > 0) {
            resolve(projects);
        } else {
            reject("No projects available");
        }
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const found = projects.find(proj => proj.id === projectId);
        if (found) {
            resolve(found);
        } else {
            reject(`Unable to find project with id: ${projectId}`);
        }
    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const match = sector.toLowerCase();
        const filtered = projects.filter(p => p.sector.toLowerCase().includes(match));
        if (filtered.length > 0) {
            resolve(filtered);
        } else {
            reject(`No projects found for sector: ${sector}`);
        }
    });
}

module.exports = {
    initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector
};

