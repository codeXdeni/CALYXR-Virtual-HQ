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

CALYXR.activityFeed = [
  {
    department: "ARIES",
    action: "Upgraded HQ to v1.2",
    timestamp: "Today"
  },

  {
    department: "TAURUS",
    action: "Completed Development Wing v0.2",
    timestamp: "Today"
  },

  {
    department: "VIRGO",
    action: "Completed Grand Library v0.1",
    timestamp: "Today"
  },

  {
    department: "LIBRA",
    action: "Completed Financial Wing v0.1",
    timestamp: "Today"
  },

  {
    department: "SAGITTARIUS",
    action: "Completed Strategy Chamber v0.1",
    timestamp: "Today"
  }
];

CALYXR.executiveMetrics = [
  {
    title: "Organization Health",
    value: "78%"
  },
  {
    title: "Departments Online",
    value: "5"
  },
  {
    title: "Active Projects",
    value: "3"
  },
  {
    title: "Current Sprint",
    value: "#003"
  }
];

CALYXR.agents = [
  {
    name: "ARIES",
    role: "Chief Executive Officer",
    status: "Working",
    priority: "High",
    assignment: "Manage CALYXR HQ"
  },

  {
    name: "TAURUS",
    role: "Lead Software Engineer",
    status: "Working",
    priority: "High",
    assignment: "Build Budgeting App MVP"
  },

  {
    name: "VIRGO",
    role: "Knowledge Director",
    status: "Working",
    priority: "Medium",
    assignment: "Expand Research Library"
  },

  {
    name: "LIBRA",
    role: "Financial Director",
    status: "Standby",
    priority: "Medium",
    assignment: "Budget Planning"
  },

  {
    name: "SAGITTARIUS",
    role: "Growth Strategist",
    status: "Working",
    priority: "High",
    assignment: "Acquire First Client"
  }
];

CALYXR.tasks = {
  ARIES: [
    { task: "Upgrade HQ v0.2", completed: true },
    { task: "Build Executive Dashboard", completed: false },
    { task: "Generate Weekly Reports", completed: false }
  ],

  TAURUS: [
    { task: "Development Wing v0.1", completed: false },
    { task: "Budgeting App Frontend", completed: false },
    { task: "Learn React", completed: false }
  ],

  VIRGO: [
    { task: "Knowledge Vault", completed: false },
    { task: "Research Oregon Businesses", completed: false },
    { task: "Document AI Ecosystem", completed: false }
  ],

  LIBRA: [
    { task: "Budget Planning", completed: false },
    { task: "Emergency Fund Strategy", completed: false },
    { task: "Debt Reduction Plan", completed: false }
  ],

  SAGITTARIUS: [
    { task: "Career Roadmap", completed: false },
    { task: "Business Expansion Plan", completed: false },
    { task: "AI Ecosystem Strategy", completed: false }
  ]
};