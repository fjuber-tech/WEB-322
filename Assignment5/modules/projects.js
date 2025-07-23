require('dotenv').config();
require('pg');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

// Define Sector model
const Sector = sequelize.define('Sector', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sector_name: Sequelize.STRING
}, {
  createdAt: false,
  updatedAt: false
});

// Define Project model
const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: Sequelize.STRING,
  feature_img_url: Sequelize.STRING,
  summary_short: Sequelize.TEXT,
  intro_short: Sequelize.TEXT,
  impact: Sequelize.TEXT,
  original_source_url: Sequelize.STRING,
  sector_id: Sequelize.INTEGER
}, {
  createdAt: false,
  updatedAt: false
});

// Association
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// Initialize DB
function initialize() {
  return sequelize.sync();
}

// Get all projects
function getAllProjects() {
  return Project.findAll({ include: [Sector] });
}

// Get project by ID
function getProjectById(id) {
  return Project.findAll({
    include: [Sector],
    where: { id: id }
  }).then(data => {
    if (data.length > 0) return data[0];
    else throw "Unable to find requested project";
  });
}

// Get projects by sector name
function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      '$Sector.sector_name$': {
        [Sequelize.Op.iLike]: `%${sector}%`
      }
    }
  }).then(data => {
    if (data.length > 0) return data;
    else throw "Unable to find requested projects";
  });
}

// Get all sectors
function getAllSectors() {
  return Sector.findAll();
}

// Add new project
function addProject(projectData) {
  return Project.create(projectData)
    .then(() => {})
    .catch(err => {
      throw err.errors[0].message;
    });
}

// Edit existing project
function editProject(id, projectData) {
  return Project.update(projectData, { where: { id: parseInt(id) } })
    .then(() => {})
    .catch(err => {
      throw err.errors ? err.errors[0].message : err.message;
    });
}


// Delete a project
function deleteProject(id) {
  return Project.destroy({ where: { id: parseInt(id) } })
    .then(() => {})
    .catch(err => {
      throw err.errors ? err.errors[0].message : err.message;
    });
}


// Export functions
module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors,
  addProject,
  editProject,
  deleteProject
};



