/********************************************************************************
*  WEB322 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Fairooz Juber   Student ID: 102907243   Date: 8/4/2025
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
const authData = require("./modules/auth-service");
const clientSessions = require("client-sessions");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Client Sessions config
app.use(clientSessions({
  cookieName: "session",
  secret: "climateSecretSession123",
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60
}));

// Make session available to views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Auth guard
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// Routes

// Home page
app.get("/", async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.render("home", { projects, page: "/" });
  } catch (err) {
    res.render("500", { message: `Failed to load homepage: ${err}`, page: "" });
  }
});

// About
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// Projects
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

// Project Details
app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.render("project", { project, page: "" });
  } catch (err) {
    res.status(404).render("404", { message: err, page: "" });
  }
});

// Add Project
app.get("/solutions/addProject", ensureLogin, async (req, res) => {
  try {
    const sectors = await projectService.getAllSectors();
    res.render("addProject", { sectors, page: "/solutions/addProject" });
  } catch (err) {
    res.render("500", { message: `Error loading form: ${err}`, page: "" });
  }
});

app.post("/solutions/addProject", ensureLogin, async (req, res) => {
  try {
    await projectService.addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error adding project: ${err}`, page: "" });
  }
});

// Edit Project
app.get("/solutions/editProject/:id", ensureLogin, async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    const sectors = await projectService.getAllSectors();
    res.render("editProject", { project, sectors, page: "" });
  } catch (err) {
    res.status(404).render("404", { message: err, page: "" });
  }
});

app.post("/solutions/editProject", ensureLogin, async (req, res) => {
  try {
    await projectService.editProject(req.body.id, req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error editing project: ${err}`, page: "" });
  }
});

// Delete Project
app.get("/solutions/deleteProject/:id", ensureLogin, async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error deleting project: ${err}`, page: "" });
  }
});

// User Registration
app.get("/register", (req, res) => {
  res.render("register", { errorMessage: "", successMessage: "", userName: "" });
});

app.post("/register", (req, res) => {
  authData.registerUser(req.body)
    .then(() => {
      res.render("register", {
        successMessage: "User created",
        errorMessage: "",
        userName: ""
      });
    })
    .catch(err => {
      res.render("register", {
        successMessage: "",
        errorMessage: err,
        userName: req.body.userName
      });
    });
});

// User Login
app.get("/login", (req, res) => {
  res.render("login", { errorMessage: "", userName: "" });
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");

  authData.checkUser(req.body)
    .then(user => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      };
      res.redirect("/solutions/projects");
    })
    .catch(err => {
      res.render("login", {
        errorMessage: err,
        userName: req.body.userName
      });
    });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

// User History
app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory");
});

// 404
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Sorry, the page you're looking for doesn't exist.",
    page: ""
  });
});

// Initialize DBs and start server
projectService.initialize()
  .then(authData.initialize)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log("Failed to start server:", err);
  });
