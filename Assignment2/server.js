/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Fairooz Juber   Student ID: 102907243 Date: 6/2/2025
*
********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");

const app = express();
const PORT = 8080; 

// Initialize data before starting the server
projectData.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize project data:", err);
    });

// Route: GET "/"
app.get("/", (req, res) => {
    res.send("Assignment 2: Fairooz Juber - 102907243");
});

// Route: GET "/solutions/projects"
app.get("/solutions/projects", (req, res) => {
    projectData.getAllProjects()
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});

// Route: GET "/solutions/projects/id-demo"
app.get("/solutions/projects/id-demo", (req, res) => {
    projectData.getProjectById(9) 
        .then(project => res.json(project))
        .catch(err => res.status(404).send(err));
});

// Route: GET "/solutions/projects/sector-demo"
app.get("/solutions/projects/sector-demo", (req, res) => {
    projectData.getProjectsBySector("agriculture") // use partial name in lower case
        .then(projects => res.json(projects))
        .catch(err => res.status(404).send(err));
});
