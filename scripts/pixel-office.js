const OFFICE_FLOORS = [
  { id: "executive", label: "Executive Floor", rooms: ["aries", "libra"] },
  { id: "operations", label: "Operations Floor", rooms: ["taurus", "sagittarius", "breakroom"] },
  { id: "ground", label: "Ground Floor", rooms: ["lobby", "virgo"] }
];

const OFFICE_ROOMS = {
  lobby: { id: "lobby", label: "Lobby", floor: "ground", owner: null },
  virgo: { id: "virgo", label: "Grand Library", floor: "ground", owner: "VIRGO" },
  taurus: { id: "taurus", label: "Development Wing", floor: "operations", owner: "TAURUS" },
  sagittarius: { id: "sagittarius", label: "Strategy Chamber", floor: "operations", owner: "SAGITTARIUS" },
  breakroom: { id: "breakroom", label: "Break Room", floor: "operations", owner: null },
  aries: { id: "aries", label: "Executive Tower", floor: "executive", owner: "ARIES" },
  libra: { id: "libra", label: "Treasury Hall", floor: "executive", owner: "LIBRA" }
};

// Best-guess role archetype per agent, used to pick sprite art at
// assets/sprites/<jobType>/. Swap these freely in one place if a different
// mapping fits better.
const AGENT_JOB_TYPES = {
  ARIES: "pm",
  TAURUS: "dev",
  VIRGO: "qa",
  LIBRA: "design",
  SAGITTARIUS: "intern"
};

const AGENT_JOB_LABELS = {
  pm: "PM_Agent",
  dev: "Dev_Agent",
  qa: "QA_Agent",
  design: "Design_Agent",
  intern: "Intern_Agent"
};

const AGENT_COLORS = {
  ARIES: "#2d6a4f",
  TAURUS: "#3a6ea5",
  VIRGO: "#7c5cbf",
  LIBRA: "#b8860b",
  SAGITTARIUS: "#c0562f"
};

const OFFICE_ANIM_FRAME_COUNT = 6;
const OFFICE_ANIM_INTERVAL_MS = 150;

let officeAgents = [];
let officeSimulationStarted = false;
let officeTickInterval = null;
let officeAnimInterval = null;
let officeMeetingPairs = new Set();

let officeView = "building";
let officeCurrentFloor = null;
let officeCurrentRoom = null;
let officeClickZones = [];
let officeAnimState = {};
let officeImageCache = {};
let officeCanvas = null;
let officeCtx = null;

function findHomeRoomId(agentName) {
  return Object.keys(OFFICE_ROOMS).find(
    roomId => OFFICE_ROOMS[roomId].owner === agentName
  );
}

function getOfficeImage(src) {
  if (officeImageCache[src]) {
    return officeImageCache[src];
  }

  const img = new Image();
  img.src = src;
  img.onload = () => {
    if (officeView === "room") {
      renderOfficeCanvas();
    }
  };

  officeImageCache[src] = img;
  return img;
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

  officeAgents.forEach(agent => {
    officeAnimState[agent.name] = { frameIndex: 0 };
  });
}

function getOfficeRoomOccupants(roomId) {
  return officeAgents.filter(agent => agent.room === roomId).map(a => a.name);
}

function getOfficeFloorOccupants(floorId) {
  const roomIds = OFFICE_FLOORS.find(f => f.id === floorId).rooms;
  return officeAgents.filter(agent => roomIds.includes(agent.room)).map(a => a.name);
}

function enterOfficeView(view, options) {
  officeView = view;
  officeCurrentFloor = (options && options.floor) || null;
  officeCurrentRoom = (options && options.room) || null;

  if (officeAnimInterval) {
    clearInterval(officeAnimInterval);
    officeAnimInterval = null;
  }

  if (view === "room") {
    officeAnimInterval = setInterval(advanceOfficeAnimationFrames, OFFICE_ANIM_INTERVAL_MS);
  } else {
    document.getElementById("office-info-panel").innerHTML =
      "<p class=\"office-info-hint\">Click an agent to inspect them.</p>";
  }

  renderOfficeCanvas();
}

function advanceOfficeAnimationFrames() {
  if (!officeCurrentRoom) {
    return;
  }

  getOfficeRoomOccupants(officeCurrentRoom).forEach(name => {
    const state = officeAnimState[name];
    state.frameIndex = (state.frameIndex + 1) % OFFICE_ANIM_FRAME_COUNT;
  });

  renderOfficeCanvas();
}

function getOfficeAgentFrameSrc(name) {
  const jobType = AGENT_JOB_TYPES[name];
  const status = agentStatus[name] ? agentStatus[name].status : "Idle";
  const state = status === "Working" ? "work" : "idle";
  const frameIndex = officeAnimState[name].frameIndex;

  return `assets/sprites/${jobType}/${state}-${frameIndex}.png`;
}

function addOfficeClickZone(x, y, w, h, onClick) {
  officeClickZones.push({ x, y, w, h, onClick });
}

function clearOfficeCanvas() {
  officeCtx.fillStyle = "#2b2f36";
  officeCtx.fillRect(0, 0, officeCanvas.width, officeCanvas.height);
}

function drawOfficeBackButton(label, onClick) {
  officeCtx.fillStyle = "#14161a";
  officeCtx.fillRect(16, 16, 120, 32);
  officeCtx.strokeStyle = "#6b7280";
  officeCtx.strokeRect(16, 16, 120, 32);

  officeCtx.fillStyle = "#d1d5db";
  officeCtx.font = "12px 'Courier New', monospace";
  officeCtx.textBaseline = "middle";
  officeCtx.fillText(label, 26, 32);

  addOfficeClickZone(16, 16, 120, 32, onClick);
}

function renderOfficeCanvas() {
  if (!officeCtx) {
    return;
  }

  officeClickZones = [];
  clearOfficeCanvas();

  if (officeView === "building") {
    renderOfficeBuildingView();
  } else if (officeView === "floor") {
    renderOfficeFloorView();
  } else if (officeView === "room") {
    renderOfficeRoomView();
  }
}

function renderOfficeBuildingView() {
  officeCtx.fillStyle = "#d1d5db";
  officeCtx.font = "16px 'Courier New', monospace";
  officeCtx.textBaseline = "top";
  officeCtx.fillText("CALYXR Tower — click a floor", 20, 20);

  const buildingX = 200;
  const buildingWidth = 400;
  const floorHeight = 150;
  const startY = 70;

  OFFICE_FLOORS.forEach((floor, index) => {
    const y = startY + index * floorHeight;

    officeCtx.fillStyle = "#3a3f47";
    officeCtx.fillRect(buildingX, y, buildingWidth, floorHeight - 6);
    officeCtx.strokeStyle = "#14161a";
    officeCtx.lineWidth = 3;
    officeCtx.strokeRect(buildingX, y, buildingWidth, floorHeight - 6);

    for (let w = 0; w < 5; w++) {
      officeCtx.fillStyle = "#f5d78e";
      officeCtx.fillRect(buildingX + 30 + w * 70, y + 30, 40, 40);
    }

    officeCtx.fillStyle = "#f3f4f6";
    officeCtx.font = "14px 'Courier New', monospace";
    officeCtx.fillText(floor.label, buildingX + 12, y + 96);

    const occupants = getOfficeFloorOccupants(floor.id);
    occupants.forEach((name, occupantIndex) => {
      officeCtx.beginPath();
      officeCtx.fillStyle = AGENT_COLORS[name];
      officeCtx.arc(buildingX + 20 + occupantIndex * 16, y + 120, 6, 0, Math.PI * 2);
      officeCtx.fill();
      officeCtx.strokeStyle = "#14161a";
      officeCtx.lineWidth = 1;
      officeCtx.stroke();
    });

    addOfficeClickZone(buildingX, y, buildingWidth, floorHeight - 6, () => {
      enterOfficeView("floor", { floor: floor.id });
    });
  });

  officeCtx.fillStyle = "#3a3f47";
  officeCtx.fillRect(buildingX + buildingWidth / 2 - 30, startY + 3 * floorHeight - 6, 60, 40);
  officeCtx.strokeStyle = "#14161a";
  officeCtx.strokeRect(buildingX + buildingWidth / 2 - 30, startY + 3 * floorHeight - 6, 60, 40);
}

function renderOfficeFloorView() {
  const floor = OFFICE_FLOORS.find(f => f.id === officeCurrentFloor);

  drawOfficeBackButton("< Building", () => enterOfficeView("building"));

  officeCtx.fillStyle = "#d1d5db";
  officeCtx.font = "16px 'Courier New', monospace";
  officeCtx.textBaseline = "top";
  officeCtx.fillText(floor.label, 160, 22);

  const margin = 20;
  const top = 70;
  const roomHeight = officeCanvas.height - top - margin;
  const roomWidth = (officeCanvas.width - margin * (floor.rooms.length + 1)) / floor.rooms.length;

  floor.rooms.forEach((roomId, index) => {
    const room = OFFICE_ROOMS[roomId];
    const x = margin + index * (roomWidth + margin);

    officeCtx.fillStyle = "rgba(255,255,255,0.04)";
    officeCtx.fillRect(x, top, roomWidth, roomHeight);
    officeCtx.strokeStyle = AGENT_COLORS[room.owner] || "#6b7280";
    officeCtx.lineWidth = 3;
    officeCtx.strokeRect(x, top, roomWidth, roomHeight);

    officeCtx.fillStyle = "#d1d5db";
    officeCtx.font = "13px 'Courier New', monospace";
    officeCtx.fillText(room.label, x + 10, top + 10);

    drawOfficeDeskProps(x + roomWidth - 90, top + roomHeight - 70);

    const occupants = getOfficeRoomOccupants(roomId);
    occupants.forEach((name, occupantIndex) => {
      officeCtx.beginPath();
      officeCtx.fillStyle = AGENT_COLORS[name];
      officeCtx.arc(x + 20 + occupantIndex * 18, top + roomHeight - 20, 7, 0, Math.PI * 2);
      officeCtx.fill();
      officeCtx.strokeStyle = "#14161a";
      officeCtx.lineWidth = 1;
      officeCtx.stroke();
    });

    addOfficeClickZone(x, top, roomWidth, roomHeight, () => {
      enterOfficeView("room", { floor: floor.id, room: roomId });
    });
  });
}

function drawOfficeDeskProps(x, y) {
  officeCtx.fillStyle = "#6b4a2f";
  officeCtx.fillRect(x, y, 70, 26);
  officeCtx.strokeStyle = "#14161a";
  officeCtx.lineWidth = 2;
  officeCtx.strokeRect(x, y, 70, 26);

  officeCtx.fillStyle = "#14161a";
  officeCtx.fillRect(x + 8, y - 18, 22, 16);
  officeCtx.strokeStyle = "#3a3f47";
  officeCtx.strokeRect(x + 8, y - 18, 22, 16);

  officeCtx.fillStyle = "#2d6a4f";
  officeCtx.beginPath();
  officeCtx.ellipse(x - 20, y + 10, 10, 14, 0, 0, Math.PI * 2);
  officeCtx.fill();
  officeCtx.strokeStyle = "#14161a";
  officeCtx.stroke();
}

function renderOfficeRoomView() {
  const room = OFFICE_ROOMS[officeCurrentRoom];

  drawOfficeBackButton("< Floor", () => enterOfficeView("floor", { floor: officeCurrentFloor }));

  officeCtx.fillStyle = "#d1d5db";
  officeCtx.font = "18px 'Courier New', monospace";
  officeCtx.textBaseline = "top";
  officeCtx.fillText(room.label, 160, 22);

  const roomX = 20;
  const roomY = 70;
  const roomW = officeCanvas.width - 40;
  const roomH = officeCanvas.height - roomY - 20;

  officeCtx.fillStyle = "rgba(255,255,255,0.04)";
  officeCtx.fillRect(roomX, roomY, roomW, roomH);
  officeCtx.strokeStyle = AGENT_COLORS[room.owner] || "#6b7280";
  officeCtx.lineWidth = 4;
  officeCtx.strokeRect(roomX, roomY, roomW, roomH);

  drawOfficeDeskProps(roomX + roomW - 130, roomY + roomH - 110);

  const occupants = getOfficeRoomOccupants(officeCurrentRoom);

  if (occupants.length === 0) {
    officeCtx.fillStyle = "#6b7280";
    officeCtx.font = "14px 'Courier New', monospace";
    officeCtx.fillText("No one here right now.", roomX + 30, roomY + 30);
    return;
  }

  const spriteSize = 120;
  const spacing = roomW / (occupants.length + 1);

  occupants.forEach((name, index) => {
    const cx = roomX + spacing * (index + 1);
    const cy = roomY + roomH / 2;

    const img = getOfficeImage(getOfficeAgentFrameSrc(name));

    if (img.complete && img.naturalWidth > 0) {
      const scale = Math.min(spriteSize / img.naturalWidth, spriteSize / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      officeCtx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
    } else {
      officeCtx.fillStyle = AGENT_COLORS[name];
      officeCtx.fillRect(cx - spriteSize / 2, cy - spriteSize / 2, spriteSize, spriteSize);
    }

    officeCtx.fillStyle = "#f3f4f6";
    officeCtx.font = "12px 'Courier New', monospace";
    officeCtx.textAlign = "center";
    officeCtx.fillText(AGENT_JOB_LABELS[AGENT_JOB_TYPES[name]], cx, cy - spriteSize / 2 - 16);
    officeCtx.textAlign = "left";

    addOfficeClickZone(cx - spriteSize / 2, cy - spriteSize / 2, spriteSize, spriteSize, () => {
      showOfficeAgentInfo(name);
    });
  });
}

function showOfficeAgentInfo(name) {
  const status = agentStatus[name];
  const tasks = agentTasks[name] || [];
  const nextTask = tasks.find(t => !t.completed);
  const jobLabel = AGENT_JOB_LABELS[AGENT_JOB_TYPES[name]];

  const panel = document.getElementById("office-info-panel");

  panel.innerHTML = `
    <h4>${name} <span class="office-info-job">${jobLabel}</span></h4>
    <p><strong>Role:</strong> ${status ? status.role : "—"}</p>
    <p><strong>Status:</strong> ${status ? status.status : "—"}</p>
    <p><strong>Task:</strong> ${nextTask ? nextTask.task : "All caught up"}</p>
  `;
}

function handleOfficeCanvasClick(event) {
  const rect = officeCanvas.getBoundingClientRect();
  const scaleX = officeCanvas.width / rect.width;
  const scaleY = officeCanvas.height / rect.height;

  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  const zone = officeClickZones.find(z =>
    x >= z.x && x <= z.x + z.w &&
    y >= z.y && y <= z.y + z.h
  );

  if (zone) {
    zone.onClick();
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
  const currentPairs = new Set();

  Object.keys(OFFICE_ROOMS).forEach(roomId => {
    const names = getOfficeRoomOccupants(roomId);

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
  renderOfficeCanvas();
}

function startOfficeSimulation() {
  if (officeSimulationStarted) {
    return;
  }

  officeSimulationStarted = true;

  officeCanvas = document.getElementById("office-canvas");
  officeCtx = officeCanvas.getContext("2d");
  officeCanvas.addEventListener("click", handleOfficeCanvasClick);

  initializeOfficeAgents();
  enterOfficeView("building");
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
}

initializeOfficeTab();
