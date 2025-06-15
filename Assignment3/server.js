/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Fairooz Juber   Student ID: 102907243 Date: 6/16/2025
*
********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Initialize data first
projectData.initialize().then(() => {

  // Route: Home Page
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/home.html"));
  });

  // Route: About Page
  app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views/about.html"));
  });

  // Route: Get all projects or filter by sector
  app.get("/solutions/projects", (req, res) => {
    const sector = req.query.sector;

    if (sector) {
      projectData.getProjectsBySector(sector)
        .then(data => res.json(data))
        .catch(err => res.status(404).send(err));
    } else {
      projectData.getAllProjects()
        .then(data => res.json(data))
        .catch(err => res.status(404).send(err));
    }
  });

  // Route: Get project by ID
  app.get("/solutions/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);
    projectData.getProjectById(id)
      .then(project => res.json(project))
      .catch(err => res.status(404).send(err));
  });

  // Custom 404 error for unmatched routes
  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views/404.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error("Failed to initialize data:", err);
});
