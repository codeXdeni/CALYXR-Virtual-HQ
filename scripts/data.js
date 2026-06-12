const CALYXR = {
  departments: [
    {
      id: "aries",
      name: "ARIES",
      status: "Operational",
      version: "v0.2"
    },

    {
      id: "taurus",
      name: "TAURUS",
      status: "Operational",
      version: "v0.2"
    },

    {
      id: "virgo",
      name: "VIRGO",
      status: "Operational",
      version: "v0.1"
    },

    {
      id: "libra",
      name: "LIBRA",
      status: "Operational",
      version: "v0.1"
    },

    {
      id: "sagittarius",
      name: "SAGITTARIUS",
      status: "Operational",
      version: "v0.1"
    }
  ]
};

CALYXR.projects = [
  {
    name: "CALYXR HQ",
    progress: 100,
    owner: "ARIES",
    priority: "High"
  },

  {
    name: "Budgeting App MVP",
    progress: 20,
    owner: "TAURUS",
    priority: "High"
  },

  {
    name: "ARIES AI Ecosystem",
    progress: 15,
    owner: "TAURUS",
    priority: "Medium"
  }
];

CALYXR.metrics = {
  departmentsOnline: 5,
  projectsActive: 3,
  organizationHealth: 78,
  sprint: "#003"
};

CALYXR.roadmap = [
  {
    item: "Headquarters District",
    status: "complete"
  },
  {
    item: "Founding Agent Offices",
    status: "complete"
  },
  {
    item: "Command Center v0.2",
    status: "complete"
  },
  {
    item: "Budgeting App MVP",
    status: "in-progress"
  },
  {
    item: "First Client",
    status: "planned"
  },
  {
    item: "ARIES Ecosystem",
    status: "planned"
  }
];