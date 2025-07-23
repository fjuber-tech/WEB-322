/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Fairooz Juber   Student ID: 102907243   Date: 7/23/2025
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/


require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

const projectService = require("./modules/projects");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Set EJS and views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home page
app.get("/", async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.render("home", { projects, page: "/" });
  } catch (err) {
    res.render("500", { message: `Failed to load homepage: ${err}`, page: "" });
  }
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// All Projects
app.get("/solutions/projects", async (req, res) => {
  try {
    const sector = req.query.sector;
    const projects = sector
      ? await projectService.getProjectsBySector(sector)
      : await projectService.getAllProjects();

    res.render("projects", { projects, page: "/solutions/projects" });
  } catch (err) {
    res.status(404).render("404", { message: err, page: "" });
  }
});

// Single Project
app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.render("project", { project, page: "" });
  } catch (err) {
    res.status(404).render("404", { message: err, page: "" });
  }
});

// Add Project - View
app.get("/solutions/addProject", async (req, res) => {
  try {
    const sectors = await projectService.getAllSectors();
    res.render("addProject", { sectors, page: "/solutions/addProject" });
  } catch (err) {
    res.render("500", { message: `Error loading form: ${err}`, page: "" });
  }
});

// Add Project - Submit
app.post("/solutions/addProject", async (req, res) => {
  try {
    await projectService.addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we encountered an error: ${err}`, page: "" });
  }
});

// Edit Project - View
app.get("/solutions/editProject/:id", async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    const sectors = await projectService.getAllSectors();
    res.render("editProject", { project, sectors, page: "" });
  } catch (err) {
    res.status(404).render("404", { message: err, page: "" });
  }
});

// Edit Project - Submit
app.post("/solutions/editProject", async (req, res) => {
  try {
    await projectService.editProject(req.body.id, req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}`, page: "" });
  }
});

// Delete Project
app.get("/solutions/deleteProject/:id", async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}`, page: "" });
  }
});

// 404 Catch-All
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Sorry, the page you're looking for doesn't exist.",
    page: ""
  });
});

// Initialize DB and Start Server
projectService.initialize().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}).catch(err => {
  console.log("Failed to start server:", err);
});
