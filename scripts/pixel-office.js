const OFFICE_ROOMS = {
  lobby: { id: "lobby", label: "Lobby", top: 260, left: 340, owner: null },
  aries: { id: "aries", label: "Executive Tower", top: 20, left: 340, owner: "ARIES" },
  virgo: { id: "virgo", label: "Grand Library", top: 260, left: 40, owner: "VIRGO" },
  taurus: { id: "taurus", label: "Development Wing", top: 260, left: 640, owner: "TAURUS" },
  libra: { id: "libra", label: "Treasury Hall", top: 480, left: 40, owner: "LIBRA" },
  sagittarius: { id: "sagittarius", label: "Strategy Chamber", top: 480, left: 640, owner: "SAGITTARIUS" }
};

let officeAgents = [];
let officeSimulationStarted = false;
let officeTickInterval = null;
let officeMeetingPairs = new Set();
let officeActiveTooltip = null;

function findHomeRoomId(agentName) {
  return Object.keys(OFFICE_ROOMS).find(
    roomId => OFFICE_ROOMS[roomId].owner === agentName
  );
}

function buildOfficeMap() {
  const container = document.getElementById("pixel-office");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  Object.values(OFFICE_ROOMS).forEach(room => {
    const roomEl = document.createElement("div");

    roomEl.classList.add("office-room", `office-room-${room.id}`);
    roomEl.style.top = `${room.top}px`;
    roomEl.style.left = `${room.left}px`;

    roomEl.innerHTML = `<span class="office-room-label">${room.label}</span>`;

    container.appendChild(roomEl);
  });

  const agentLayer = document.createElement("div");
  agentLayer.classList.add("office-agent-layer");
  agentLayer.id = "office-agent-layer";

  container.appendChild(agentLayer);
}

function initializeOfficeAgents() {
  officeAgents = Object.keys(agentTasks).map(name => {
    const homeRoom = findHomeRoomId(name);

    return {
      name: name,
      home: homeRoom,
      room: homeRoom,
      target: homeRoom,
      visitTicks: 0
    };
  });
}

function getOfficeRoomOccupants() {
  const roomOccupants = {};

  officeAgents.forEach(agent => {
    if (!roomOccupants[agent.room]) {
      roomOccupants[agent.room] = [];
    }

    roomOccupants[agent.room].push(agent.name);
  });

  return roomOccupants;
}

function renderOfficeAgents() {
  const layer = document.getElementById("office-agent-layer");

  if (!layer) {
    return;
  }

  const roomOccupants = getOfficeRoomOccupants();

  officeAgents.forEach(agent => {
    let sprite = document.getElementById(`office-agent-${agent.name}`);

    if (!sprite) {
      sprite = document.createElement("div");
      sprite.id = `office-agent-${agent.name}`;
      sprite.classList.add(
        "office-agent",
        `office-agent-${agent.name.toLowerCase()}`
      );
      sprite.textContent = agent.name.slice(0, 2);
      sprite.title = agent.name;

      sprite.addEventListener("click", event => {
        event.stopPropagation();
        showOfficeAgentInfo(agent.name, sprite);
      });

      layer.appendChild(sprite);
    }

    const room = OFFICE_ROOMS[agent.room];
    const occupants = roomOccupants[agent.room];
    const slot = occupants.indexOf(agent.name);

    const offsetX = 20 + (slot % 3) * 36;
    const offsetY = 50 + Math.floor(slot / 3) * 36;

    sprite.style.left = `${room.left + offsetX}px`;
    sprite.style.top = `${room.top + offsetY}px`;

    sprite.classList.toggle("meeting", occupants.length > 1);
  });
}

function showOfficeAgentInfo(name, sprite) {
  closeOfficeTooltip();

  const status = agentStatus[name];
  const tasks = agentTasks[name] || [];
  const nextTask = tasks.find(t => !t.completed);

  const tooltip = document.createElement("div");
  tooltip.classList.add("office-tooltip");

  tooltip.innerHTML = `
    <h4>${name}</h4>
    <p><strong>Role:</strong> ${status ? status.role : "—"}</p>
    <p><strong>Status:</strong> ${status ? status.status : "—"}</p>
    <p><strong>Task:</strong> ${nextTask ? nextTask.task : "All caught up"}</p>
  `;

  tooltip.addEventListener("click", event => event.stopPropagation());

  const container = document.getElementById("pixel-office");
  container.appendChild(tooltip);

  tooltip.style.left = sprite.style.left;
  tooltip.style.top = `${parseInt(sprite.style.top, 10) - 10}px`;

  officeActiveTooltip = tooltip;
}

function closeOfficeTooltip() {
  if (officeActiveTooltip) {
    officeActiveTooltip.remove();
    officeActiveTooltip = null;
  }
}

function logOfficeMeeting(nameA, nameB, roomId) {
  const room = OFFICE_ROOMS[roomId];

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

  activityFeed.unshift({
    agent: nameA,
    message: `Crossed paths with ${nameB} in the ${room.label}`,
    time: currentTime
  });

  if (activityFeed.length > 15) {
    activityFeed.pop();
  }

  saveData();
  renderActivityFeed();
}

function updateOfficeMeetings() {
  const roomOccupants = getOfficeRoomOccupants();
  const currentPairs = new Set();

  Object.keys(roomOccupants).forEach(roomId => {
    const names = roomOccupants[roomId];

    if (names.length < 2) {
      return;
    }

    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const pairKey = [names[i], names[j]].sort().join("-");
        currentPairs.add(pairKey);

        if (!officeMeetingPairs.has(pairKey)) {
          logOfficeMeeting(names[i], names[j], roomId);
        }
      }
    }
  });

  officeMeetingPairs = currentPairs;
}

function updateOfficeSimulation() {
  // generateCollaborations() is defined in script.js, loaded before this file
  const collaborations = generateCollaborations();

  officeAgents.forEach(agent => {
    if (agent.room === agent.home && agent.visitTicks === 0) {
      const collaboration = collaborations.find(c => c.from === agent.name);

      if (collaboration) {
        const targetRoom = findHomeRoomId(collaboration.to);

        if (targetRoom) {
          agent.target = targetRoom;
          agent.visitTicks = 2 + Math.floor(Math.random() * 2);
        }
      }
    } else if (agent.room !== agent.home) {
      agent.visitTicks -= 1;

      if (agent.visitTicks <= 0) {
        agent.target = agent.home;
        agent.visitTicks = 0;
      }
    }

    agent.room = agent.target;
  });

  updateOfficeMeetings();
  renderOfficeAgents();
}

function startOfficeSimulation() {
  if (officeSimulationStarted) {
    return;
  }

  officeSimulationStarted = true;

  buildOfficeMap();
  initializeOfficeAgents();
  renderOfficeAgents();
  updateOfficeSimulation();

  officeTickInterval = setInterval(updateOfficeSimulation, 4000);
}

function initializeOfficeTab() {
  const officeButton = document.querySelector(
    '.tab-button[data-tab="office"]'
  );

  if (officeButton) {
    officeButton.addEventListener("click", startOfficeSimulation);

    if (officeButton.classList.contains("active")) {
      startOfficeSimulation();
    }
  }

  document.addEventListener("click", closeOfficeTooltip);
}

initializeOfficeTab();
