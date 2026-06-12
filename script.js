const metrics = {
  departments: 5,
  projects: 3
};

function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleString();
}

updateClock();

setInterval(updateClock, 1000);

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  const progress = card.dataset.progress;
  const progressNumber = card.querySelector(".progress-number");
  const progressFill = card.querySelector(".progress-fill");

  progressNumber.textContent = progress + "%";
  progressFill.style.width = progress + "%";
});

const activityLog = [
  {
    time: "3:45 PM",
    department: "TAURUS",
    message: "Completed Project Tracker System"
  },
  {
    time: "3:10 PM",
    department: "VIRGO",
    message: "Updated Research Queue"
  },
  {
    time: "2:30 PM",
    department: "ARIES",
    message: "Approved HQ v0.2 Upgrade"
  },
  {
    time: "1:45 PM",
    department: "LIBRA",
    message: "Reviewed Budgeting App Goals"
  }
];

const activityContainer =
  document.getElementById(
    "activity-container"
  );

function renderActivityFeed() {

  const container =
    document.getElementById("activity-container");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  CALYXR.activityFeed.forEach(activity => {

    const card = document.createElement("div");

    card.classList.add("activity-card");

    card.innerHTML = `
      <h4>${activity.department}</h4>

      <p>${activity.action}</p>

      <small>${activity.timestamp}</small>
    `;

    container.appendChild(card);

  });

}

let agentStatus = {
  ARIES: {
    role: "Chief Executive Officer",
    status: "Working",
    priority: "High",
    assignment: "Build Executive Dashboard"
  },

  TAURUS: {
    role: "Lead Software Engineer",
    status: "Working",
    priority: "High",
    assignment: "Budgeting App Frontend"
  },

  VIRGO: {
    role: "Research Director",
    status: "Research",
    priority: "Medium",
    assignment: "Research Oregon Businesses"
  },

  LIBRA: {
    role: "Chief Financial Officer",
    status: "Planning",
    priority: "Medium",
    assignment: "Debt Reduction Strategy"
  },

  SAGITTARIUS: {
    role: "Chief Strategy Officer",
    status: "Planning",
    priority: "High",
    assignment: "Business Expansion Plan"
  }
};

const agentTasks = {
  ARIES: [
    {
      task: "Upgrade HQ v0.2",
      completed: true
    },
    {
      task: "Build Executive Dashboard",
      completed: true
    },
    {
      task: "Generate Weekly Reports",
      completed: false
    }
  ],

  TAURUS: [
    {
      task: "Development Wing v0.1",
      completed: true
    },
    {
      task: "Budgeting App Frontend",
      completed: true
    },
    {
      task: "Learn React",
      completed: false
    }
  ],

  VIRGO: [
    {
      task: "Knowledge Vault",
      completed: true
    },
    {
      task: "Research Oregon Businesses",
      completed: false
    },
    {
      task: "Document AI Ecosystem",
      completed: false
    }
  ],

  LIBRA: [
    {
      task: "Budget Planning",
      completed: true
    },
    {
      task: "Emergency Fund Strategy",
      completed: true
    },
    {
      task: "Debt Reduction Plan",
      completed: false
    }
  ],

  SAGITTARIUS: [
    {
      task: "Career Roadmap",
      completed: true
    },
    {
      task: "Business Expansion Plan",
      completed: true
    },
    {
      task: "AI Ecosystem Strategy",
      completed: true
    }
  ]
};

let activityFeed = [
  {
    agent: "TAURUS",
    message: "Completed Project Tracker System",
    time: "3:45 PM"
  },

  {
    agent: "VIRGO",
    message: "Updated Research Queue",
    time: "3:10 PM"
  },

  {
    agent: "ARIES",
    message: "Approved HQ v0.2 Upgrade",
    time: "2:30 PM"
  },

  {
    agent: "LIBRA",
    message: "Reviewed Budgeting App Goals",
    time: "1:45 PM"
  }
];

function saveData() {
  localStorage.setItem(
    "agentTasks",
    JSON.stringify(agentTasks)
  );

  localStorage.setItem(
    "activityFeed",
    JSON.stringify(activityFeed)
  );
}

function loadData() {
  
  const savedTasks =
    localStorage.getItem("agentTasks");

  if (savedTasks) {
    Object.assign(
      agentTasks,
      JSON.parse(savedTasks)
    );
  }

  const savedFeed =
    localStorage.getItem("activityFeed");

  if (savedFeed) {
    activityFeed =
      JSON.parse(savedFeed);
  }
}

let totalTasks = 0;
let completedTasks = 0;

for (const agent in agentTasks) {

  totalTasks += agentTasks[agent].length;

  completedTasks +=
    agentTasks[agent].filter(
      task => task.completed
    ).length;
}

const completionRate =
  Math.round(
    (completedTasks / totalTasks) * 100
  );

const taskContainer =
  document.getElementById("task-container");

function renderTaskBoard() {
  taskContainer.innerHTML = "";

  for (const agent in agentTasks) {
    
    const completedTasks =
        agentTasks[agent].filter(
          task => task.completed
        ).length;

      const totalTasks =
        agentTasks[agent].length;

      const progressPercent =
        Math.round(
          (completedTasks / totalTasks) * 100
        );

    const card =
      document.createElement("div");

    card.classList.add("task-card");

    let tasksHTML = "";

    agentTasks[agent].forEach((task, index) => {

      tasksHTML += `
        <li 
          class="task-item"
          data-agent="${agent}"
          data-task-index="${index}"
        >
          ${task.completed ? "✅" : "⬜"}
          ${task.task}
        </li>
      `;
    });

    card.innerHTML = `
      <h3>${agent}</h3>

      <div class="agent-progress">

        <span>${progressPercent}% Complete</span>

        <div class="mini-progress-bar">
          <div
            class="mini-progress-fill"
            style="width:${progressPercent}%">
          </div>
        </div>

      </div>

      <ul>
        ${tasksHTML}
      </ul>
    `;

    taskContainer.appendChild(card);

  }

  document.querySelectorAll(".task-item").forEach(item => {
    item.addEventListener("click", () => {
      const agent = item.dataset.agent;
      const taskIndex = item.dataset.taskIndex;

      agentTasks[agent][taskIndex].completed =
        !agentTasks[agent][taskIndex].completed;
      
      const taskName =
        agentTasks[agent][taskIndex].task;

      const currentTime =
        new Date().toLocaleTimeString(
          [],
          {
            hour: "numeric",
            minute: "2-digit"
          }
        );
      
      activityFeed.unshift({

        agent: agent,

        message:
          agentTasks[agent][taskIndex].completed
            ? `Completed ${taskName}`
            : `Reopened ${taskName}`,

        time: currentTime

      });

      if (activityFeed.length > 15) {
        activityFeed.pop();
      }

      saveData();

      renderTaskBoard();
      renderMetrics();
      renderRankings();
      renderActivityFeed();
    });
  });
}

renderTaskBoard();

const metricsContainer = document.getElementById("metrics-container");

function renderMetrics() {
  const container = document.getElementById("metrics-container");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  CALYXR.executiveMetrics.forEach(metric => {
    const card = document.createElement("div");

    card.classList.add("metric-card");

    card.innerHTML = `
      <h3>${metric.value}</h3>
      <p>${metric.title}</p>
    `;

    container.appendChild(card);
  });
}

const rankingsContainer = document.getElementById("rankings-container");

function renderRankings() {
  rankingsContainer.innerHTML = "";

  const departmentRankings = [];

  for (const agent in agentTasks) {
    const completedTasks = agentTasks[agent].filter(
      task => task.completed
    ).length;

    const totalTasks = agentTasks[agent].length;

    const score = Math.round(
      (completedTasks / totalTasks) * 100
    );

    departmentRankings.push({
      name: agent,
      score: score
    });
  }

  departmentRankings.sort((a, b) => b.score - a.score);

  departmentRankings.forEach((department, index) => {
    const rankingCard = document.createElement("div");

    rankingCard.classList.add("ranking-card");

    rankingCard.innerHTML = `
      <div class="ranking-info">
        <strong>${index + 1}. ${department.name}</strong>
        <span>${department.score}%</span>
      </div>

      <div class="mini-progress-bar">
        <div
          class="mini-progress-fill"
          style="width: ${department.score}%;">
        </div>
      </div>
    `;

    rankingsContainer.appendChild(rankingCard);
  });
}

const agentStatusContainer =
  document.getElementById(
    "agent-status-container"
  );

function renderAgentStatus() {
  const container =
    document.getElementById("agent-status-container");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  CALYXR.agents.forEach(agent => {
    const card = document.createElement("div");

    card.classList.add("agent-card");

    card.innerHTML = `
      <h3>${agent.name}</h3>
      <p>${agent.role}</p>
      <p>Status: ${agent.status}</p>
      <p>Priority: ${agent.priority}</p>
      <p>${agent.assignment}</p>
    `;

    container.appendChild(card);
  });
}

function renderTopMetrics() {
  const departmentsCount = document.getElementById("departments-count");
  const projectsCount = document.getElementById("projects-count");
  const agentsCount = document.getElementById("agents-count");
  const hqVersion = document.getElementById("hq-version");

  if (!departmentsCount || !projectsCount || !agentsCount || !hqVersion) {
    return;
  }

  departmentsCount.textContent = CALYXR.metrics.departmentsOnline;
  projectsCount.textContent = CALYXR.metrics.projectsActive;
  agentsCount.textContent = CALYXR.departments.length;
  hqVersion.textContent = "v1.1";
}

function renderProjectTracker() {
  const container = document.getElementById("project-tracker-container");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  CALYXR.projects.forEach(project => {
    const card = document.createElement("div");
    card.classList.add("project-card");

    card.innerHTML = `
      <div class="project-header">
        <h3>${project.name}</h3>
        <span>${project.progress}%</span>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width: ${project.progress}%"></div>
      </div>

      <p>Status: ${project.priority} Priority</p>
      <p>Owner: ${project.owner}</p>
    `;

    container.appendChild(card);
  });
}



function renderDepartments() {
  const container = document.getElementById(
    "department-status-container"
  );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  CALYXR.departments.forEach(department => {

    const card = document.createElement("div");
    card.classList.add("department-status-card");

    card.innerHTML = `
      <h3>${department.name}</h3>

      <p>Version: ${department.version}</p>

      <span class="status online">
        ${department.status}
      </span>
    `;

    container.appendChild(card);

  });
}

function renderRoadmap() {
  const container = document.getElementById("roadmap-container");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  CALYXR.roadmap.forEach(roadmapItem => {
    const item = document.createElement("li");

    let icon = "🟪";

    if (roadmapItem.status === "complete") {
      icon = "✅";
    }

    if (roadmapItem.status === "in-progress") {
      icon = "🔄";
    }

    item.textContent = `${icon} ${roadmapItem.item}`;

    container.appendChild(item);
  });
}

renderTopMetrics();
renderProjectTracker();
renderDepartments();
renderRoadmap();

loadData();

renderTaskBoard();
renderMetrics();
renderRankings();
renderActivityFeed();
renderAgentStatus();