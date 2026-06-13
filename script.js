const metrics = {
  departments: 5,
  projects: 3
};

function calculateDepartmentPerformance(tasks) {
  const completedTasks = tasks.filter(task => task.completed).length;

  return Math.round((completedTasks / tasks.length) * 100);
}

function getDepartmentRankings() {
  return Object.keys(agentTasks)
    .map(agent => {
      const performance = calculateDepartmentPerformance(agentTasks[agent]);

      return {
        name: agent,
        performance: performance
      };
    })
    .sort((a, b) => b.performance - a.performance);
}

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
})

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

  const dynamicFeed = [
    ...CALYXR.activityFeed
  ];

  getDepartmentRankings().forEach(department => {
    if (department.performance < 25) {
      dynamicFeed.unshift({
        department: department.name,
        action: `${department.name} requires support`,
        timestamp: "Auto"
      });
    }
  });

  CALYXR.projects.forEach(project => {
    if (project.progress === 100) {
      dynamicFeed.unshift({
        department: project.owner,
        action: `${project.name} reached 100% completion`,
        timestamp: "Auto"
      });
    }
  });

  dynamicFeed.forEach(activity => {

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

let agentTasks = CALYXR.tasks;

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

function calculateOrganizationHealth() {
  const departmentRankings = getDepartmentRankings();

  return Math.round(
    departmentRankings.reduce((sum, dept) => sum + dept.performance, 0) /
      departmentRankings.length
  );
}

function renderMetrics() {
  const container = document.getElementById("metrics-container");

  if (!container) {
    return;
  }

  const organizationHealth = calculateOrganizationHealth();

  const dynamicMetrics = [
    {
      title: "Organization Health",
      value: `${organizationHealth}%`
    },
    {
      title: "Departments Online",
      value: CALYXR.metrics.departmentsOnline
    },
    {
      title: "Active Projects",
      value: CALYXR.metrics.projectsActive
    },
    {
      title: "Current Sprint",
      value: CALYXR.metrics.sprint
    }
  ];

  container.innerHTML = "";

  dynamicMetrics.forEach(metric => {
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

function getDepartmentStatus(performance) {
  if (performance >= 80) {
    return { text: "Excellent", className: "excellent" };
  }

  if (performance >= 60) {
    return { text: "Operational", className: "operational" };
  }

  if (performance >= 30) {
    return { text: "Warning", className: "warning" };
  }

  return { text: "Critical", className: "critical" };
}

function renderRankings() {
  if (!rankingsContainer) {
    return;
  }

  const departmentRankings = getDepartmentRankings();

  rankingsContainer.innerHTML = "";

  departmentRankings.forEach((department, index) => {
    const rankingCard = document.createElement("div");

    rankingCard.classList.add("ranking-card");
    rankingCard.style.cursor = "pointer";

    const status = getDepartmentStatus(department.performance);
    
    rankingCard.innerHTML = `
      <div class="ranking-info">
        <strong>${index + 1}. ${department.name}</strong>
        <span>${department.performance}%</span>
        <span class="rank-badge ${status.className}">
          ${status.text}
        </span>
      </div>

      <div class="mini-progress-bar">
        <div
          class="mini-progress-fill"
          style="width: ${department.performance}%;">
        </div>
      </div>
    `;

    rankingsContainer.appendChild(rankingCard);

    rankingCard.addEventListener("click", () => {

        document
          .querySelectorAll(".ranking-card")
          .forEach(card => card.classList.remove("active"));

        rankingCard.classList.add("active");

        renderDepartmentDetails(department.name);
    });
  });
}

function renderDepartmentDetails(departmentName) {

    const container =
        document.getElementById("department-details");

    if (!container) return;

    const tasks =
        agentTasks[departmentName] || [];

    const completedTasks =
        tasks.filter(task => task.completed).length;

    const performance =
        calculateDepartmentPerformance(tasks);

    const status =
        getDepartmentStatus(performance);

    container.innerHTML = `
        <h3>${departmentName}</h3>

        <p>
            <strong>Performance:</strong>
            ${performance}%
        </p>

        <p>
            <strong>Status:</strong>
            ${status.text}
        </p>

        <p>
            <strong>Completed Tasks:</strong>
            ${completedTasks}/${tasks.length}
        </p>

        <h4>Tasks</h4>

        <ul>
            ${tasks.map(task => `
                <li>
                    ${task.completed ? "✓" : "□"}
                    ${task.task}
                </li>
            `).join("")}
        </ul>
    `;
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
  const container = document.getElementById("department-status-container");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  CALYXR.departments.forEach(department => {
    const performance = calculateDepartmentPerformance(
      agentTasks[department.name]
    );

    let statusText;
    let statusClass;

    if (performance >= 80) {
      statusText = "Excellent";
      statusClass = "excellent";
    } else if (performance >= 50) {
      statusText = "Operational";
      statusClass = "operational";
    } else if (performance >= 25) {
      statusText = "Warning";
      statusClass = "warning";
    } else {
      statusText = "Critical";
      statusClass = "critical";
    }

    const card = document.createElement("div");
    card.classList.add("department-status-card");

    card.innerHTML = `
      <h3>${department.name}</h3>

      <p>Version: ${department.version}</p>

      <span class="status ${statusClass}">
        ${statusText}
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

function renderExecutiveBrief() {
  const container = document.getElementById("executive-brief-container");

  if (!container) {
    return;
  }

  const departmentRankings = getDepartmentRankings();

  const organizationHealth = calculateOrganizationHealth();

  const criticalDepartments = departmentRankings.filter(
    department => department.performance < 25
  );

  const highestPrioritySupport =
    criticalDepartments.length > 0
      ? criticalDepartments[0]
      : null;

  const priorityProject = CALYXR.projects.find(project => project.priority === "High");
  const activeProjects = CALYXR.metrics.projectsActive;
  const departmentsOnline = CALYXR.metrics.departmentsOnline;

  const highestPriorityProject = CALYXR.projects.find(
    project => project.priority === "High"
  );

  container.innerHTML = `
    <div class="brief-card">
      <h3>Organization Health</h3>
      <p>${organizationHealth}%</p>
    </div>

    <div class="brief-card">
      <h3>Departments Online</h3>
      <p>${departmentsOnline}</p>
    </div>

    <div class="brief-card">
      <h3>Active Projects</h3>
      <p>${activeProjects}</p>
    </div>

    <div class="brief-card">
      <h3>Priority Focus</h3>
      <p>${highestPriorityProject.name}</p>
      <small>Owner: ${priorityProject.owner} • ${priorityProject.progress}%</small>
    </div>

    <div class="brief-card wide-brief">
      <h3>Recommended Action</h3>
      <p>
        ${criticalDepartments.length} departments require assistance.
        Highest priority support:
        ${highestPrioritySupport ? highestPrioritySupport.name : "None"}.
        Continue progress on ${priorityProject.name}.
      </p>
    </div>
  `;
}

function renderExecutiveAlerts() {
    const container = document.getElementById("alerts-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const rankings = getDepartmentRankings();

    rankings.forEach(department => {
        if (department.performance < 25) {
            const alert = document.createElement("div");

            alert.classList.add("alert-card", "warning");

            alert.textContent =
                `⚠ ${department.name} performance below 25%`;

            container.appendChild(alert);
        }
    });

    CALYXR.projects.forEach(project => {
        if (project.progress === 100) {
            const alert = document.createElement("div");

            alert.classList.add("alert-card", "success");

            alert.textContent =
                `✓ ${project.name} completed`;

            container.appendChild(alert);
        }
    });

    const onlineAlert = document.createElement("div");

    onlineAlert.classList.add("alert-card", "info");

    onlineAlert.textContent =
        `✓ ${CALYXR.metrics.departmentsOnline} departments online`;

    container.appendChild(onlineAlert);
}

loadData();

renderTopMetrics();
renderProjectTracker();
renderDepartments();
renderRoadmap();
renderExecutiveBrief();
renderTaskBoard();
renderMetrics();
renderRankings();
renderActivityFeed();
renderAgentStatus();
renderExecutiveAlerts();