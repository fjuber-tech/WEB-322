/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Fairooz Juber   Student ID: 102907243   Date: 7/6/2025
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

const projectService = require("./modules/projects");

app.use(express.static(path.join(__dirname, "public")));

// Set EJS as template engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home page
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// Projects listing
app.get("/solutions/projects", async (req, res) => {
  try {
    const sector = req.query.sector;
    let projects;

    if (sector) {
      projects = await projectService.getProjectsBySector(sector);
      if (projects.length === 0) {
        return res.status(404).render("404", {
          message: `No projects found for sector: ${sector}`,
          page: ""
        });
      }
    } else {
      projects = await projectService.getAllProjects();
    }

    res.render("projects", { projects, page: "/solutions/projects" });
  } catch (err) {
    res.status(404).render("404", { message: err, page: "" });
  }
});

// Project details by ID
app.get("/solutions/projects/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const project = await projectService.getProjectById(id);
    res.render("project", { project, page: "" });
  } catch (err) {
    res.status(404).render("404", { message: err, page: "" });
  }
});

// 404 for all other routes
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Sorry, the page you're looking for doesn't exist.",
    page: ""
  });
});

// Initialize data then start server
projectService.initialize().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}).catch(err => {
  console.log("Failed to start server:", err);
});
