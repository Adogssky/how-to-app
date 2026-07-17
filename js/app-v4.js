// ===================== 程序库 =====================
const programLibrary = [
  {
    id: 'build-a-bike',
    title: 'build a bike',
    subtitle: 'Interactive bike anatomy with specs and shopping list.',
    icon: '🚲',
    screen: 'screen-bike-choose',
    gradient: 1
  },
  {
    id: 'workout-at-gym',
    title: 'workout at a gym',
    subtitle: 'Card-based workout logger with rest timer and history.',
    icon: '💪',
    screen: 'screen-workout',
    gradient: 2
  },
  {
    id: 'make-pour-over-coffee',
    title: 'make pour-over coffee',
    subtitle: 'Brew a clean cup with step-by-step timing.',
    icon: '☕',
    screen: 'screen-ugc',
    gradient: 3
  },
  {
    id: 'cook-perfect-eggs',
    title: 'cook perfect eggs',
    subtitle: 'Soft, medium, or hard-boiled every time.',
    icon: '🍳',
    screen: 'screen-ugc',
    gradient: 4
  },
  {
    id: 'change-a-tire',
    title: 'change a tire',
    subtitle: 'Roadside flat fix from jack to torque.',
    icon: '🔧',
    screen: 'screen-ugc',
    gradient: 5
  },
  {
    id: 'plant-a-succulent',
    title: 'plant a succulent',
    subtitle: 'Soil, pot, and watering basics for beginners.',
    icon: '🌵',
    screen: 'screen-ugc',
    gradient: 1
  },
  {
    id: 'tie-a-tie',
    title: 'tie a tie',
    subtitle: 'Four-in-hand knot made simple.',
    icon: '👔',
    screen: 'screen-ugc',
    gradient: 2
  },
  {
    id: 'make-a-smoothie',
    title: 'make a smoothie',
    subtitle: 'Fruit, greens, liquid, and blend ratios.',
    icon: '🥤',
    screen: 'screen-ugc',
    gradient: 3
  }
];

let currentPrograms = [];
let homeCardIndex = 0;
let homeSwipeMoved = false;

// ===================== 数据：自行车 =====================
const bikeData = {
  road: {
    title: 'Road bike',
    parts: {
      frame: {
        name: 'Frame',
        desc: 'The main structure of the bike. Road frames prioritize light weight and aerodynamics.',
        specs: [
          { name: 'Carbon', note: 'Light, stiff, dampens vibration' },
          { name: 'Aluminum', note: 'Affordable, stiff, responsive' },
          { name: 'Steel', note: 'Comfortable, durable, heavier' },
          { name: 'Titanium', note: 'Light, comfortable, expensive' }
        ],
        parts: [
          { name: 'Frame & fork set', spec: 'Matches frame material' },
          { name: 'Headset', spec: 'Integrated, frame-specific' }
        ]
      },
      bottomBracket: {
        name: 'Bottom bracket',
        desc: 'The interface between the crankset and the frame. The shell standard determines which crankset fits.',
        specs: [
          { name: 'BSA/ISO', note: 'Threaded, 68/73 mm wide' },
          { name: 'BB86/92', note: 'Press-fit, 86.5/91.5 mm' },
          { name: 'BB30/PF30', note: 'Press-fit, 68/73 mm, 30 mm axle' },
          { name: 'T47', note: 'Threaded, oversized 30 mm axle' },
          { name: 'DUB', note: 'SRAM 28.99 mm axle standard' }
        ],
        parts: [
          { name: 'Bottom bracket', spec: 'Match shell standard' },
          { name: 'Crankset', spec: 'Match BB axle standard' }
        ]
      },
      wheels: {
        name: 'Wheels',
        desc: 'Road wheels are usually 700c with narrow tires for low rolling resistance.',
        specs: [
          { name: '700c', note: 'Standard road diameter' },
          { name: '650b', note: 'Smaller, wider tire compatible' },
          { name: 'Rim brake', note: 'Brake track on rim' },
          { name: 'Disc brake', note: '6-bolt or center-lock rotor' }
        ],
        parts: [
          { name: 'Wheelset', spec: 'Rim or disc brake' },
          { name: 'Tires', spec: '23–32 mm width' },
          { name: 'Tubes / sealant', spec: 'Clincher or tubeless' }
        ]
      },
      drivetrain: {
        name: 'Drivetrain',
        desc: 'Converts pedaling into motion. Includes crankset, chain, cassette, and derailleurs.',
        specs: [
          { name: '2x', note: 'Two chainrings, wide gear range' },
          { name: '1x', note: 'Single chainring, simpler' },
          { name: '11-speed / 12-speed', note: 'Number of cassette cogs' },
          { name: 'Electronic', note: 'Di2, eTap, EPS' }
        ],
        parts: [
          { name: 'Groupset', spec: 'Shifters + derailleurs + brakes' },
          { name: 'Chain', spec: 'Match speed count' },
          { name: 'Cassette', spec: 'Match speed count' }
        ]
      },
      handlebar: {
        name: 'Handlebar',
        desc: 'Drop bars give multiple hand positions and an aero posture.',
        specs: [
          { name: 'Drop bar', note: 'Classic road shape' },
          { name: 'Aero bar', note: 'Flat top section' },
          { name: '31.8 mm clamp', note: 'Modern standard' },
          { name: '25.4 / 26.0 mm', note: 'Older standards' }
        ],
        parts: [
          { name: 'Handlebar', spec: 'Width = shoulder width' },
          { name: 'Bar tape', spec: 'Cork or synthetic' },
          { name: 'Stem', spec: 'Match bar clamp diameter' }
        ]
      },
      saddle: {
        name: 'Saddle',
        desc: 'Supports your sit bones. Width and shape matter more than padding.',
        specs: [
          { name: '145–155 mm', note: 'Common widths' },
          { name: 'Carbon rails', note: 'Light, limited clamp design' },
          { name: 'Steel rails', note: 'Durable, affordable' }
        ],
        parts: [
          { name: 'Saddle', spec: 'Match sit-bone width' },
          { name: 'Seatpost', spec: 'Match frame diameter' }
        ]
      },
      brakes: {
        name: 'Brakes',
        desc: 'Slows and stops the bike. Road bikes use rim or disc calipers.',
        specs: [
          { name: 'Rim caliper', note: 'Light, simple' },
          { name: 'Mechanical disc', note: 'Easier maintenance' },
          { name: 'Hydraulic disc', note: 'Best power and modulation' }
        ],
        parts: [
          { name: 'Brake calipers', spec: 'Rim or disc' },
          { name: 'Brake levers', spec: 'Integrated with shifters' },
          { name: 'Rotors / pads', spec: 'For disc systems' }
        ]
      }
    }
  },
  mtb: {
    title: 'Mountain bike',
    parts: {
      frame: {
        name: 'Frame',
        desc: 'Built to handle rough terrain. MTB frames are usually aluminum or carbon with slacker geometry.',
        specs: [
          { name: 'Hardtail', note: 'Front suspension only' },
          { name: 'Full suspension', note: 'Front + rear shock' },
          { name: 'Carbon', note: 'Light and stiff' },
          { name: 'Aluminum', note: 'Tough and affordable' }
        ],
        parts: [
          { name: 'Frame & rear shock', spec: 'Full-sus only' },
          { name: 'Headset', spec: 'Tapered common' }
        ]
      },
      bottomBracket: {
        name: 'Bottom bracket',
        desc: 'Like road bikes, but often sees more mud and impact so sealing matters.',
        specs: [
          { name: 'BSA/ISO', note: 'Threaded, reliable' },
          { name: 'PF92/BB92', note: 'Press-fit common on carbon' },
          { name: 'DUB', note: 'SRAM 28.99 mm axle' },
          { name: 'Boost 148', note: 'Rear hub spacing, not BB' }
        ],
        parts: [
          { name: 'Bottom bracket', spec: 'Match shell + axle' },
          { name: 'Crankset', spec: '1x or 2x' }
        ]
      },
      wheels: {
        name: 'Wheels',
        desc: 'MTB wheels are smaller diameter with wide, knobby tires for grip.',
        specs: [
          { name: '29"', note: 'Rolls over obstacles well' },
          { name: '27.5"', note: 'More playful, agile' },
          { name: 'Mullet', note: '29" front, 27.5" rear' },
          { name: 'Tubeless ready', note: 'Run lower pressures' }
        ],
        parts: [
          { name: 'Wheelset', spec: 'Match hub spacing' },
          { name: 'Tires', spec: 'Width 2.2–2.6"' },
          { name: 'Sealant', spec: 'Tubeless setup' }
        ]
      },
      drivetrain: {
        name: 'Drivetrain',
        desc: 'Modern mountain bikes mostly use wide-range 1x drivetrains.',
        specs: [
          { name: '1x10 / 1x11', note: 'Budget options' },
          { name: '1x12', note: 'Common modern range' },
          { name: 'Wide range cassette', note: '10–52t common' }
        ],
        parts: [
          { name: 'Shifter + derailleur', spec: 'Match brand/speed' },
          { name: 'Chain', spec: 'Match speed count' },
          { name: 'Cassette', spec: 'Match speed count' }
        ]
      },
      handlebar: {
        name: 'Handlebar',
        desc: 'Wide flat bars give leverage and control on technical trails.',
        specs: [
          { name: 'Flat bar', note: 'Standard MTB' },
          { name: 'Riser bar', note: 'Higher hand position' },
          { name: '31.8 / 35 mm clamp', note: 'Stiffness vs. comfort' },
          { name: '720–800 mm wide', note: 'Modern widths' }
        ],
        parts: [
          { name: 'Handlebar', spec: 'Width by preference' },
          { name: 'Grips', spec: 'Lock-on recommended' },
          { name: 'Stem', spec: '35–50 mm common' }
        ]
      },
      saddle: {
        name: 'Saddle',
        desc: 'Often slimmer and more durable than road saddles to allow body movement.',
        specs: [
          { name: 'Synthetic cover', note: 'Weather resistant' },
          { name: 'Reinforced rails', note: 'For drops and impacts' }
        ],
        parts: [
          { name: 'Saddle', spec: 'Personal fit' },
          { name: 'Dropper post', spec: 'Highly recommended' }
        ]
      },
      brakes: {
        name: 'Brakes',
        desc: 'Hydraulic disc brakes are essentially standard for mountain biking.',
        specs: [
          { name: 'Hydraulic disc', note: 'Best power and modulation' },
          { name: '2-piston', note: 'XC and trail' },
          { name: '4-piston', note: 'Enduro and downhill' }
        ],
        parts: [
          { name: 'Brake levers + calipers', spec: 'Hydraulic' },
          { name: 'Rotors', spec: '160–203 mm' },
          { name: 'Brake pads', spec: 'Metallic or organic' }
        ]
      }
    }
  }
};

const bikeSVGs = {
  road: `
    <svg viewBox="0 0 420 260">
      <g stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M130 180 L220 100 L190 180" class="bike-part" data-part="frame"/>
        <path d="M220 100 L310 100" class="bike-part" data-part="frame"/>
        <path d="M190 180 L310 100" class="bike-part" data-part="frame"/>
        <path d="M220 100 L190 180" class="bike-part" data-part="frame"/>
        <path d="M310 100 L325 185" class="bike-part" data-part="frame"/>
        <circle cx="85" cy="180" r="48" class="bike-part" data-part="wheels"/>
        <circle cx="85" cy="180" r="40" class="bike-part" data-part="wheels" stroke="#ccc" stroke-width="1"/>
        <circle cx="335" cy="180" r="48" class="bike-part" data-part="wheels"/>
        <circle cx="335" cy="180" r="40" class="bike-part" data-part="wheels" stroke="#ccc" stroke-width="1"/>
        <circle cx="190" cy="180" r="10" class="bike-part" data-part="bottomBracket" fill="#111"/>
        <circle cx="190" cy="180" r="22" class="bike-part" data-part="drivetrain"/>
        <path d="M190 180 L175 200" class="bike-part" data-part="drivetrain" stroke-width="3"/>
        <path d="M190 158 L190 145 L280 145 L280 158" class="bike-part" data-part="drivetrain" stroke-width="1.5"/>
        <path d="M190 202 L190 215 L280 215 L280 202" class="bike-part" data-part="drivetrain" stroke-width="1.5"/>
        <circle cx="280" cy="180" r="14" class="bike-part" data-part="drivetrain"/>
        <path d="M310 100 L325 70 L350 70" class="bike-part" data-part="handlebar"/>
        <path d="M345 70 L355 70" class="bike-part" data-part="handlebar" stroke-width="4"/>
        <path d="M220 100 L220 80 L205 80" class="bike-part" data-part="saddle"/>
        <path d="M198 78 L232 78" class="bike-part" data-part="saddle" stroke-width="5"/>
        <path d="M85 132 L85 180" class="bike-part" data-part="brakes"/>
        <path d="M335 132 L335 180" class="bike-part" data-part="brakes"/>
      </g>
    </svg>
  `,
  mtb: `
    <svg viewBox="0 0 420 260">
      <g stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M130 180 L210 100 L130 100 Z" class="bike-part" data-part="frame"/>
        <path d="M130 180 L120 130" class="bike-part" data-part="frame"/>
        <path d="M210 100 L310 110" class="bike-part" data-part="frame"/>
        <path d="M130 180 L310 110" class="bike-part" data-part="frame"/>
        <path d="M130 130 L170 150" class="bike-part" data-part="frame" stroke="#666"/>
        <path d="M310 110 L330 185" class="bike-part" data-part="frame" stroke-width="4"/>
        <circle cx="85" cy="180" r="50" class="bike-part" data-part="wheels"/>
        <circle cx="85" cy="180" r="42" class="bike-part" data-part="wheels" stroke="#ccc" stroke-width="1"/>
        <circle cx="340" cy="180" r="50" class="bike-part" data-part="wheels"/>
        <circle cx="340" cy="180" r="42" class="bike-part" data-part="wheels" stroke="#ccc" stroke-width="1"/>
        <circle cx="150" cy="180" r="10" class="bike-part" data-part="bottomBracket" fill="#111"/>
        <circle cx="150" cy="180" r="24" class="bike-part" data-part="drivetrain"/>
        <path d="M150 180 L135 205" class="bike-part" data-part="drivetrain" stroke-width="3"/>
        <path d="M150 156 L150 140 L250 140 L250 156" class="bike-part" data-part="drivetrain" stroke-width="1.5"/>
        <path d="M150 204 L150 220 L250 220 L250 204" class="bike-part" data-part="drivetrain" stroke-width="1.5"/>
        <circle cx="250" cy="180" r="16" class="bike-part" data-part="drivetrain"/>
        <path d="M310 110 L320 75 L290 75" class="bike-part" data-part="handlebar"/>
        <path d="M285 75 L295 75" class="bike-part" data-part="handlebar" stroke-width="4"/>
        <path d="M210 100 L205 75 L235 75" class="bike-part" data-part="saddle"/>
        <path d="M200 73 L240 73" class="bike-part" data-part="saddle" stroke-width="5"/>
        <path d="M85 130 L85 180" class="bike-part" data-part="brakes" stroke-width="3"/>
        <path d="M340 130 L340 180" class="bike-part" data-part="brakes" stroke-width="3"/>
      </g>
    </svg>
  `
};

// ===================== 数据：训练动作（内置 fallback）====================
const builtInExercises = [
  { id: 'b1', name: 'Squat', body_part: 'upper legs', equipment: 'barbell', category: 'strength' },
  { id: 'b2', name: 'Bench Press', body_part: 'chest', equipment: 'barbell', category: 'strength' },
  { id: 'b3', name: 'Deadlift', body_part: 'back', equipment: 'barbell', category: 'strength' },
  { id: 'b4', name: 'Overhead Press', body_part: 'shoulders', equipment: 'barbell', category: 'strength' },
  { id: 'b5', name: 'Barbell Row', body_part: 'back', equipment: 'barbell', category: 'strength' },
  { id: 'b6', name: 'Pull Up', body_part: 'back', equipment: 'body weight', category: 'strength' },
  { id: 'b7', name: 'Dumbbell Lunge', body_part: 'upper legs', equipment: 'dumbbell', category: 'strength' },
  { id: 'b8', name: 'Push Up', body_part: 'chest', equipment: 'body weight', category: 'strength' },
  { id: 'b9', name: 'Leg Press', body_part: 'upper legs', equipment: 'machine', category: 'strength' },
  { id: 'b10', name: 'Lat Pulldown', body_part: 'back', equipment: 'cable', category: 'strength' },
  { id: 'b11', name: 'Bicep Curl', body_part: 'upper arms', equipment: 'dumbbell', category: 'strength' },
  { id: 'b12', name: 'Tricep Extension', body_part: 'upper arms', equipment: 'cable', category: 'strength' },
  { id: 'b13', name: 'Plank', body_part: 'waist', equipment: 'body weight', category: 'strength' },
  { id: 'b14', name: 'Treadmill Run', body_part: 'cardio', equipment: 'machine', category: 'cardio' },
  { id: 'b15', name: 'Rowing Machine', body_part: 'cardio', equipment: 'machine', category: 'cardio' }
];

const exerciseImageBase = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/';

// ===================== IndexedDB 图片缓存 =====================
const DB_NAME = 'howto-images';
const DB_VERSION = 1;
let imageDB = null;

function initImageDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      imageDB = req.result;
      resolve(imageDB);
    };
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'url' });
      }
    };
  });
}

async function getCachedImage(url) {
  if (!imageDB) await initImageDB().catch(() => null);
  if (!imageDB) return null;
  return new Promise((resolve) => {
    const tx = imageDB.transaction('images', 'readonly');
    const store = tx.objectStore('images');
    const req = store.get(url);
    req.onsuccess = () => {
      if (req.result) {
        const blob = new Blob([req.result.data], { type: req.result.type || 'image/jpeg' });
        resolve(URL.createObjectURL(blob));
      } else {
        resolve(null);
      }
    };
    req.onerror = () => resolve(null);
  });
}

async function cacheImage(url, blob) {
  if (!imageDB) return;
  try {
    const buffer = await blob.arrayBuffer();
    const tx = imageDB.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    store.put({ url, data: buffer, type: blob.type });
  } catch (e) {
    console.warn('Cache image failed', e);
  }
}

async function loadExerciseImage(name) {
  const ex = findExerciseByName(name);
  if (!ex || !ex.image) return null;
  const filename = ex.image.split('/').pop();
  const url = exerciseImageBase + filename;

  // 1. Check IndexedDB cache
  const cached = await getCachedImage(url);
  if (cached) return cached;

  // 2. Fetch and cache
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    await cacheImage(url, blob);
    return URL.createObjectURL(blob);
  } catch (e) {
    console.log('Image load failed:', url);
    return null;
  }
}

// ===================== 状态 =====================
let currentBikeType = null;
let selectedSpec = null;
let exerciseLibrary = [];
let activeWorkout = null;
let currentCardIndex = 0;
let activeSetTimer = null;
let activeRestTimer = null;
let currentProgram = null;
let adjustmentsLeft = 3;
let createGenerationsLeft = 3;
let timerMode = 'idle';
let timerSeconds = 0;
let currentTimerSet = null;

// ===================== 工具函数 =====================
function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function todayKey() {
  return formatDate(new Date());
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ===================== 导航 =====================
let currentScreenId = 'screen-home';

function showScreen(id) {
  if (currentScreenId === 'screen-workout' && id !== 'screen-workout' && id !== 'screen-exercise-picker') {
    clearTimers();
    closeHistoryPanel();
    closeBodyPanel();
  }
  currentScreenId = id;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goHome() {
  closeHistoryPanel();
  closeBodyPanel();
  showScreen('screen-home');
  runHomeAnimation();
}

// ===================== 首页 =====================
function getProgramsToShow() {
  const approved = getApprovedPrograms().map(p => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    icon: p.icon,
    screen: p.screen,
    gradient: (Math.floor(Math.random() * 5) + 1)
  }));

  // 固定置顶两个核心程序
  const pinned = [
    programLibrary.find(p => p.id === 'build-a-bike'),
    programLibrary.find(p => p.id === 'workout-at-gym')
  ].filter(Boolean);

  // 其余程序随机补满到 5 个
  const restPool = programLibrary.filter(p => p.id !== 'build-a-bike' && p.id !== 'workout-at-gym');
  const others = shuffleArray([...restPool, ...approved]).slice(0, Math.max(0, 5 - pinned.length));

  return [...pinned, ...others];
}

function renderHomeCards() {
  currentPrograms = getProgramsToShow();
  homeCardIndex = 0;
  const container = document.getElementById('home-cards-container');
  container.innerHTML = currentPrograms.map((p, i) => `
    <div class="home-program-card card-gradient-${p.gradient} ${getHomeCardClass(i)}"
      data-index="${i}"
      onclick="onHomeCardClick('${p.screen}', '${p.id}')"
      ontouchstart="handleHomeTouchStart(event)"
      ontouchend="handleHomeTouchEnd(event)">
      <div class="card-icon">${p.icon}</div>
      <div>
        <h3>${p.title}</h3>
        <p>${p.subtitle}</p>
      </div>
      <div class="card-arrow">→</div>
    </div>
  `).join('');

  renderHomeDots();
}

function onHomeCardClick(screen, id) {
  if (homeSwipeMoved) return;
  openProgramCard(screen, id);
}

function getHomeCardClass(i) {
  if (i === homeCardIndex) return 'active';
  if (i === homeCardIndex - 1) return 'prev';
  if (i === homeCardIndex + 1) return 'next';
  return 'far';
}

function renderHomeDots() {
  const dots = document.getElementById('home-dots');
  if (!dots) return;
  dots.innerHTML = currentPrograms.map((_, i) => `
    <div class="home-dot ${i === homeCardIndex ? 'active' : ''}" onclick="goToHomeCard(${i})"></div>
  `).join('');
}

function goToHomeCard(i) {
  if (!currentPrograms.length || i < 0 || i >= currentPrograms.length) return;
  homeCardIndex = i;
  document.querySelectorAll('#home-cards-container .home-program-card').forEach((el, idx) => {
    el.className = `home-program-card card-gradient-${currentPrograms[idx].gradient} ${getHomeCardClass(idx)}`;
  });
  renderHomeDots();
}

function handleHomeTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  homeSwipeMoved = false;
}

function handleHomeTouchEnd(e) {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 30) {
    homeSwipeMoved = true;
    if (dx < -50) goToHomeCard(homeCardIndex + 1);
    if (dx > 50) goToHomeCard(homeCardIndex - 1);
  }
}

function openProgramCard(screen, id) {
  if (screen === 'screen-bike-choose') {
    showScreen('screen-bike-choose');
  } else if (screen === 'screen-workout') {
    initWorkout();
    showScreen('screen-workout');
  } else {
    openUGCProgram(id);
  }
}

function openUGCProgram(id) {
  const program = getApprovedPrograms().find(p => p.id === id);
  if (!program) return;
  alert(`Program preview:\n${program.title}\n\n${program.overview}\n\n(This demo only shows metadata.)`);
}

function runHomeAnimation() {
  document.querySelectorAll('.fade-item').forEach(el => el.classList.remove('show'));
  const more = document.getElementById('home-more');
  if (more) more.classList.remove('show');

  setTimeout(() => {
    document.querySelectorAll('.fade-item').forEach(el => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('show'), delay);
    });
    if (more) setTimeout(() => more.classList.add('show'), 1200);
  }, 50);
}

function refreshPrograms() {
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spin');
  const container = document.getElementById('home-cards-container');
  container.style.opacity = '0';
  container.style.transform = 'scale(0.96)';

  setTimeout(() => {
    renderHomeCards();
    container.style.opacity = '1';
    container.style.transform = 'scale(1)';
    btn.classList.remove('spin');
  }, 400);
}

// 绑定事件
document.addEventListener('DOMContentLoaded', () => {
  initImageDB().catch(() => {});

  const moreBtn = document.getElementById('more-btn');
  if (moreBtn) {
    moreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      goCreate();
    });
  }

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      refreshPrograms();
    });
  }

  renderHomeCards();
  runHomeAnimation();
});

// ===================== Bike =====================
function openBike(type) {
  currentBikeType = type;
  const data = bikeData[type];
  document.getElementById('bike-detail-title').textContent = data.title;
  document.getElementById('bike-svg-container').innerHTML = bikeSVGs[type];
  document.getElementById('bike-panel').classList.add('hidden');
  showScreen('screen-bike-detail');

  setTimeout(() => {
    document.querySelectorAll('#bike-svg-container .bike-part').forEach(part => {
      part.addEventListener('click', function() {
        showBikePart(this.dataset.part);
      });
    });
  }, 50);
}

function showBikePart(key) {
  const part = bikeData[currentBikeType].parts[key];
  if (!part) return;

  selectedSpec = null;
  document.getElementById('bike-part-name').textContent = part.name;
  document.getElementById('bike-part-desc').textContent = part.desc;

  document.getElementById('bike-specs').innerHTML = part.specs.map((s, i) => `
    <div class="spec-item" onclick="selectBikeSpec('${key}', ${i})">
      <span class="spec-name">${s.name}</span>
      <span class="spec-note">${s.note}</span>
    </div>
  `).join('');

  renderBikePartsList(part);
  document.getElementById('bike-panel').classList.remove('hidden');
}

function selectBikeSpec(partKey, specIndex) {
  const part = bikeData[currentBikeType].parts[partKey];
  selectedSpec = part.specs[specIndex];
  document.querySelectorAll('#bike-specs .spec-item').forEach((el, i) => el.classList.toggle('active', i === specIndex));
  renderBikePartsList(part, selectedSpec.name);
}

function renderBikePartsList(part, selectedSpecName) {
  document.getElementById('bike-parts-list').innerHTML = part.parts.map(p => {
    let specText = selectedSpecName ? `${p.spec} · ${selectedSpecName}` : p.spec;
    return `
      <li>
        <span>${p.name}</span>
        <span class="part-spec">${specText}</span>
      </li>
    `;
  }).join('');
}

function closeBikePanel() {
  document.getElementById('bike-panel').classList.add('hidden');
}

// ===================== Workout =====================
function initWorkout() {
  renderWorkoutToday();
  switchWorkoutTab('today');
}

function switchWorkoutTab(tab) {
  document.querySelectorAll('.workout-tabs button').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');

  if (tab === 'today') {
    closeHistoryPanel();
    closeBodyPanel();
  } else if (tab === 'history') {
    closeBodyPanel();
    openHistoryPanel();
  } else if (tab === 'body') {
    closeHistoryPanel();
    openBodyPanel();
  }
}

function renderWorkoutToday() {
  const today = todayKey();
  const workouts = storageGet('howto_workouts', {});
  const todayWorkout = workouts[today];

  if (todayWorkout && todayWorkout.exercises && todayWorkout.exercises.length > 0) {
    activeWorkout = JSON.parse(JSON.stringify(todayWorkout));
    currentCardIndex = 0;
    showActiveWorkout();
  } else {
    // Demo 首次进入自动创建默认训练
    startDefaultWorkout();
  }
}

function startDefaultWorkout() {
  activeWorkout = {
    date: todayKey(),
    exercises: [
      { name: 'Squat', sets: [{ weight: '', reps: '', completed: false }] },
      { name: 'Bench Press', sets: [{ weight: '', reps: '', completed: false }] },
      { name: 'Deadlift', sets: [{ weight: '', reps: '', completed: false }] }
    ]
  };
  saveActiveWorkout();
  currentCardIndex = 0;
  showActiveWorkout();
}

function startWorkout() {
  startDefaultWorkout();
}

function showActiveWorkout() {
  document.getElementById('workout-empty').classList.add('hidden');
  document.getElementById('workout-cards-area').classList.remove('hidden');
  renderCards();
}

function renderCards() {
  const carousel = document.getElementById('cards-carousel');
  const dots = document.getElementById('card-dots');

  if (!activeWorkout || activeWorkout.exercises.length === 0) {
    carousel.innerHTML = '';
    dots.innerHTML = '';
    return;
  }

  carousel.innerHTML = activeWorkout.exercises.map((ex, i) => {
    const setsHtml = ex.sets.map((set, si) => renderSetRow(ex, i, si)).join('');
    const total = ex.sets.length;
    const completed = ex.sets.filter(s => s.completed).length;

    return `
      <div class="exercise-card ${getCardClass(i)}" data-index="${i}"
        ontouchstart="handleTouchStart(event)"
        ontouchend="handleTouchEnd(event, ${i})">
        <div class="card-pattern"></div>
        <div class="card-image-area" id="card-img-${i}">
          <div class="card-image-placeholder">${getExerciseEmoji(ex.name)}</div>
        </div>
        <h3>${ex.name}</h3>
        <div class="card-sub">Set ${completed}/${total} completed</div>
        <div class="sets-list">${setsHtml}</div>
        <div class="card-actions">
          <button onclick="addSet(${i})">+ Add set</button>
          <button onclick="removeExercise(${i})">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  dots.innerHTML = activeWorkout.exercises.map((_, i) => `
    <div class="card-dot ${i === currentCardIndex ? 'active' : ''}" onclick="goToCard(${i})"></div>
  `).join('');

  // 异步加载当前和前/后卡片的图片
  [-1, 0, 1].forEach(offset => {
    const idx = currentCardIndex + offset;
    if (idx >= 0 && idx < activeWorkout.exercises.length) {
      loadCardImage(idx);
    }
  });
}

async function loadCardImage(idx) {
  const ex = activeWorkout.exercises[idx];
  const area = document.getElementById(`card-img-${idx}`);
  if (!area || area.dataset.loaded) return;

  const url = await loadExerciseImage(ex.name);
  if (url) {
    area.innerHTML = `<img src="${url}" alt="${ex.name}" class="card-image">`;
    area.dataset.loaded = 'true';
  }
}

function getCardClass(i) {
  if (i === currentCardIndex) return 'active';
  if (i === currentCardIndex - 1) return 'prev';
  if (i === currentCardIndex + 1) return 'next';
  return 'far';
}

function goToCard(i) {
  if (!activeWorkout || i < 0 || i >= activeWorkout.exercises.length) return;
  currentCardIndex = i;
  renderCards();
}

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e, i) {
  if (i !== currentCardIndex) return;
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    if (dx < -50) goToCard(currentCardIndex + 1);
    if (dx > 50) goToCard(currentCardIndex - 1);
  }
}

function getExerciseEmoji(name) {
  const n = name.toLowerCase();
  if (n.includes('squat') || n.includes('leg') || n.includes('lunge')) return '🦵';
  if (n.includes('bench') || n.includes('push') || n.includes('chest')) return '💪';
  if (n.includes('deadlift') || n.includes('row') || n.includes('back')) return '🏋️';
  if (n.includes('press') || n.includes('shoulder')) return '🙆';
  if (n.includes('curl') || n.includes('arm')) return '💪';
  if (n.includes('run') || n.includes('cardio')) return '🏃';
  if (n.includes('plank') || n.includes('abs')) return '🧘';
  return '🏋️';
}

function findExerciseByName(name) {
  return exerciseLibrary.find(ex => ex.name.toLowerCase() === name.toLowerCase());
}

function renderSetRow(ex, exIndex, setIndex) {
  const set = ex.sets[setIndex];
  const isCurrent = isCurrentSet(exIndex, setIndex);
  const isDone = set.completed;

  let btnClass = 'locked';
  let btnText = 'Locked';
  let onclick = '';

  if (isDone) {
    btnClass = 'done';
    btnText = 'Done';
  } else if (isCurrent) {
    if (set.timerMode === 'lifting') {
      btnClass = 'stop';
      btnText = 'Stop';
      onclick = `onclick="stopSet(${exIndex}, ${setIndex})"`;
    } else if (set.timerMode === 'rest') {
      btnClass = 'skip';
      btnText = 'Skip';
      onclick = `onclick="skipRest(${exIndex}, ${setIndex})"`;
    } else {
      btnClass = 'start';
      btnText = 'Start';
      onclick = `onclick="startSet(${exIndex}, ${setIndex})"`;
    }
  }

  return `
    <div class="set-item">
      <span class="set-label">Set ${setIndex + 1}</span>
      <input type="number" placeholder="kg" value="${set.weight || ''}"
        onchange="updateSet(${exIndex}, ${setIndex}, 'weight', this.value)"
        ${isDone ? 'disabled' : ''}>
      <input type="number" placeholder="reps" value="${set.reps || ''}"
        onchange="updateSet(${exIndex}, ${setIndex}, 'reps', this.value)"
        ${isDone ? 'disabled' : ''}>
      <button class="set-btn ${btnClass}" ${onclick}>${btnText}</button>
    </div>
  `;
}

function isCurrentSet(exIndex, setIndex) {
  for (let e = 0; e < activeWorkout.exercises.length; e++) {
    const ex = activeWorkout.exercises[e];
    for (let s = 0; s < ex.sets.length; s++) {
      if (!ex.sets[s].completed) {
        return e === exIndex && s === setIndex;
      }
    }
  }
  return false;
}

function startSet(exIndex, setIndex) {
  clearTimers();
  const set = activeWorkout.exercises[exIndex].sets[setIndex];
  set.timerMode = 'lifting';
  set.timerSeconds = 0;
  saveActiveWorkout();

  currentTimerSet = { exIndex, setIndex };
  timerMode = 'lifting';
  timerSeconds = 0;
  openTimerModal('Lifting', 'Stop', stopSetFromModal);

  activeSetTimer = setInterval(() => {
    timerSeconds++;
    set.timerSeconds = timerSeconds;
    updateTimerDisplay();
    saveActiveWorkout();
  }, 1000);
}

function stopSetFromModal() {
  if (!currentTimerSet) return;
  stopSet(currentTimerSet.exIndex, currentTimerSet.setIndex);
}

function stopSet(exIndex, setIndex) {
  clearTimers();
  const set = activeWorkout.exercises[exIndex].sets[setIndex];
  set.timerMode = 'rest';
  set.timerSeconds = 90;
  saveActiveWorkout();

  currentTimerSet = { exIndex, setIndex };
  timerMode = 'rest';
  timerSeconds = 90;
  openTimerModal('Rest', 'Skip', skipRestFromModal);

  activeRestTimer = setInterval(() => {
    timerSeconds--;
    set.timerSeconds = timerSeconds;
    updateTimerDisplay();
    saveActiveWorkout();
    if (timerSeconds <= 0) {
      completeSet(exIndex, setIndex);
    }
  }, 1000);
}

function skipRestFromModal() {
  if (!currentTimerSet) return;
  skipRest(currentTimerSet.exIndex, currentTimerSet.setIndex);
}

function skipRest(exIndex, setIndex) {
  clearTimers();
  closeTimerModal();
  completeSet(exIndex, setIndex);
}

function completeSet(exIndex, setIndex) {
  clearTimers();
  closeTimerModal();
  const set = activeWorkout.exercises[exIndex].sets[setIndex];
  set.completed = true;
  set.timerMode = 'idle';
  set.timerSeconds = 0;
  saveActiveWorkout();

  const ex = activeWorkout.exercises[exIndex];
  if (setIndex === ex.sets.length - 1 && exIndex < activeWorkout.exercises.length - 1) {
    currentCardIndex = exIndex + 1;
  }
  renderCards();
  updateBodyBig3();
}

function clearTimers() {
  if (activeSetTimer) clearInterval(activeSetTimer);
  if (activeRestTimer) clearInterval(activeRestTimer);
  activeSetTimer = null;
  activeRestTimer = null;
}

function openTimerModal(label, actionText, actionFn) {
  document.getElementById('timer-label').textContent = label;
  const actionBtn = document.getElementById('timer-action-btn');
  actionBtn.textContent = actionText;
  actionBtn.onclick = actionFn;
  document.getElementById('timer-skip-btn').style.display = label === 'Rest' ? 'inline-block' : 'none';
  updateTimerDisplay();
  document.getElementById('timer-modal').classList.add('active');
}

function closeTimerModal() {
  document.getElementById('timer-modal').classList.remove('active');
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const s = (timerSeconds % 60).toString().padStart(2, '0');
  document.getElementById('timer-big').textContent = `${m}:${s}`;
}

function updateSet(exIndex, setIndex, field, value) {
  activeWorkout.exercises[exIndex].sets[setIndex][field] = parseFloat(value) || 0;
  saveActiveWorkout();
}

function addSet(exIndex) {
  activeWorkout.exercises[exIndex].sets.push({ weight: '', reps: '', completed: false });
  saveActiveWorkout();
  renderCards();
}

function removeExercise(exIndex) {
  if (!confirm('Remove this exercise?')) return;
  activeWorkout.exercises.splice(exIndex, 1);
  if (currentCardIndex >= activeWorkout.exercises.length) {
    currentCardIndex = Math.max(0, activeWorkout.exercises.length - 1);
  }
  saveActiveWorkout();
  if (activeWorkout.exercises.length === 0) {
    document.getElementById('workout-empty').classList.remove('hidden');
    document.getElementById('workout-cards-area').classList.add('hidden');
  } else {
    renderCards();
  }
}

function saveActiveWorkout() {
  if (!activeWorkout) return;
  const workouts = storageGet('howto_workouts', {});
  workouts[activeWorkout.date] = JSON.parse(JSON.stringify(activeWorkout));
  storageSet('howto_workouts', workouts);
}

// ===================== Exercise Picker =====================
function addExercise() {
  document.getElementById('exercise-search').value = '';
  document.getElementById('exercise-results').innerHTML = '<div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  showScreen('screen-exercise-picker');
  loadExerciseLibrary();
}

function cancelExercisePicker() {
  showScreen('screen-workout');
}

function loadExerciseLibrary() {
  if (exerciseLibrary.length > 0) {
    renderExercisePicker();
    return;
  }

  exerciseLibrary = [...builtInExercises];
  renderExercisePicker();

  fetch('https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json')
    .then(r => r.json())
    .then(data => {
      const normalized = data.slice(0, 300).map(ex => ({
        id: ex.id,
        name: ex.name,
        body_part: ex.body_part || ex.category,
        equipment: ex.equipment,
        category: 'strength',
        image: ex.image
      }));
      exerciseLibrary = [...normalized, ...builtInExercises];
      const seen = new Set();
      exerciseLibrary = exerciseLibrary.filter(ex => {
        if (seen.has(ex.name.toLowerCase())) return false;
        seen.add(ex.name.toLowerCase());
        return true;
      });
      renderExercisePicker();
    })
    .catch(err => {
      console.log('External exercise dataset not loaded, using built-in fallback.');
    });
}

let selectedCategory = 'all';

function renderExercisePicker() {
  const categories = ['all', ...new Set(exerciseLibrary.map(ex => ex.body_part))];
  const chips = document.getElementById('exercise-categories');
  chips.innerHTML = categories.map(c => `
    <button class="category-chip ${selectedCategory === c ? 'active' : ''}" onclick="setCategory('${c}')">${c}</button>
  `).join('');
  filterExercises();
}

function setCategory(cat) {
  selectedCategory = cat;
  renderExercisePicker();
}

function filterExercises() {
  const q = document.getElementById('exercise-search').value.toLowerCase().trim();
  const filtered = exerciseLibrary.filter(ex => {
    const matchCat = selectedCategory === 'all' || ex.body_part === selectedCategory;
    const matchQ = ex.name.toLowerCase().includes(q) || ex.equipment.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const results = document.getElementById('exercise-results');
  if (filtered.length === 0) {
    results.innerHTML = '<div class="empty-state" style="padding:32px;">No exercises found.</div>';
    return;
  }

  results.innerHTML = filtered.slice(0, 50).map(ex => {
    const safeName = ex.name.replace(/"/g, '&quot;');
    return `
      <div class="exercise-result-item" onclick="selectExercise('${safeName}')">
        <span>${ex.name}</span>
        <span class="ex-meta">${ex.body_part} · ${ex.equipment}</span>
      </div>
    `;
  }).join('');
}

function selectExercise(name) {
  activeWorkout.exercises.push({
    name: name,
    sets: [{ weight: '', reps: '', completed: false }]
  });
  currentCardIndex = activeWorkout.exercises.length - 1;
  saveActiveWorkout();
  showScreen('screen-workout');
  showActiveWorkout();
  switchWorkoutTab('today');
}

// ===================== History Panel =====================
function openHistoryPanel() {
  renderCalendar();
  document.getElementById('history-overlay').classList.add('active');
  document.getElementById('history-panel').classList.add('active');
}

function closeHistoryPanel() {
  document.getElementById('history-overlay').classList.remove('active');
  document.getElementById('history-panel').classList.remove('active');
  if (currentScreenId === 'screen-workout') {
    document.getElementById('tab-history').classList.remove('active');
    document.getElementById('tab-today').classList.add('active');
  }
}

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('calendar-month').textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const workouts = storageGet('howto_workouts', {});

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  const headers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  headers.forEach(h => {
    const el = document.createElement('div');
    el.className = 'calendar-day-header';
    el.textContent = h;
    grid.appendChild(el);
  });

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'calendar-day empty';
    grid.appendChild(el);
  }

  const todayStr = todayKey();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDate(new Date(year, month, d));
    const el = document.createElement('div');
    el.className = 'calendar-day';
    if (workouts[dateStr]) el.classList.add('has-workout');
    if (dateStr === todayStr) el.classList.add('today');
    el.textContent = d;
    el.onclick = () => openHistoryDay(dateStr);
    grid.appendChild(el);
  }
}

function openHistoryDay(dateStr) {
  const workouts = storageGet('howto_workouts', {});
  const day = workouts[dateStr];
  if (!day) return;

  document.getElementById('history-detail-card').classList.remove('hidden');
  document.getElementById('history-date').textContent = new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });

  document.getElementById('history-exercises').innerHTML = day.exercises.map(ex => {
    const setsText = ex.sets.filter(s => s.completed).map(s => `${s.weight}kg × ${s.reps}`).join(', ');
    return `
      <div class="history-exercise">
        <h5>${ex.name}</h5>
        <div class="history-sets">${setsText || 'No completed sets'}</div>
      </div>
    `;
  }).join('');
}

// ===================== Body Panel =====================
function openBodyPanel() {
  renderBodyPanel();
  document.getElementById('body-overlay').classList.add('active');
  document.getElementById('body-panel').classList.add('active');
}

function closeBodyPanel() {
  document.getElementById('body-overlay').classList.remove('active');
  document.getElementById('body-panel').classList.remove('active');
  if (currentScreenId === 'screen-workout') {
    document.getElementById('tab-body').classList.remove('active');
    document.getElementById('tab-today').classList.add('active');
  }
}

function renderBodyPanel() {
  const profile = storageGet('howto_body_profile', null);
  document.getElementById('bp-gender').textContent = profile?.gender ? capitalize(profile.gender) : '—';
  document.getElementById('bp-height').textContent = profile?.height ? `${profile.height} cm` : '—';
  document.getElementById('bp-weight').textContent = profile?.weight ? `${profile.weight} kg` : '—';

  if (profile) {
    document.getElementById('edit-gender').value = profile.gender || 'male';
    document.getElementById('edit-height').value = profile.height || '';
    document.getElementById('edit-weight').value = profile.weight || '';
  }

  updateBodyBig3();
  updateHumanFigure();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toggleBodyForm() {
  const form = document.getElementById('body-form');
  form.classList.toggle('hidden');
  const btn = document.getElementById('body-edit-btn');
  btn.textContent = form.classList.contains('hidden') ? 'Edit profile' : 'Cancel';
}

function saveBodyProfile() {
  const profile = {
    gender: document.getElementById('edit-gender').value,
    height: parseFloat(document.getElementById('edit-height').value) || 0,
    weight: parseFloat(document.getElementById('edit-weight').value) || 0
  };
  storageSet('howto_body_profile', profile);
  renderBodyPanel();
  toggleBodyForm();
}

function updateBodyBig3() {
  const big3 = [
    { key: 'squat', name: 'Squat' },
    { key: 'bench', name: 'Bench Press' },
    { key: 'deadlift', name: 'Deadlift' }
  ];

  big3.forEach(({ key, name }) => {
    const rm = calculateBest1RM(name);
    const el = document.getElementById('big3-' + key);
    el.textContent = rm > 0 ? `${rm.toFixed(1)} kg` : '—';
    el.style.color = rm > 0 ? 'var(--text)' : 'var(--text-secondary)';
  });
}

function calculateBest1RM(exerciseName) {
  const workouts = storageGet('howto_workouts', {});
  let best = 0;
  Object.values(workouts).forEach(day => {
    day.exercises.forEach(ex => {
      if (ex.name.toLowerCase() !== exerciseName.toLowerCase()) return;
      ex.sets.forEach(set => {
        if (!set.weight || !set.reps || set.weight <= 0 || set.reps <= 0) return;
        const rm = set.weight * (1 + 0.033 * (set.reps - 1));
        if (rm > best) best = rm;
      });
    });
  });
  return best;
}

// ===================== 人体轮廓动态生成 =====================
function updateHumanFigure() {
  const bench = calculateBest1RM('Bench Press');
  const squat = calculateBest1RM('Squat');
  const deadlift = calculateBest1RM('Deadlift');
  const lower = (squat + deadlift) / 2;

  const profile = storageGet('howto_body_profile', {});
  const weight = profile?.weight || 70;

  // shoulder width based on bench; waist based on weight + lower strength
  const shoulderWidth = mapRange(bench, 0, 120, 34, 54);
  const waistWidth = mapRange(weight + lower * 0.3, 50, 180, 18, 32);

  const upperStyle = getStrengthStyle(bench, '#6b5ce7');
  const lowerStyle = getStrengthStyle(lower, '#5cb38f');

  document.getElementById('human-figure').innerHTML = generateHumanSVG(
    shoulderWidth, waistWidth, upperStyle, lowerStyle
  );
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  const clamped = Math.max(0, Math.min(1, t));
  return outMin + (outMax - outMin) * clamped;
}

function generateHumanSVG(shoulderW, waistW, upperStyle, lowerStyle) {
  const cx = 60;
  const headY = 18;
  const neckY = 30;
  const shoulderY = 38;
  const waistY = 75;
  const hipY = 85;
  const kneeY = 130;
  const ankleY = 175;

  const shoulderL = cx - shoulderW / 2;
  const shoulderR = cx + shoulderW / 2;
  const waistL = cx - waistW / 2;
  const waistR = cx + waistW / 2;
  const hipW = waistW + 6;
  const hipL = cx - hipW / 2;
  const hipR = cx + hipW / 2;

  const upperStroke = upperStyle.width;
  const upperColor = upperStyle.color;
  const lowerStroke = lowerStyle.width;
  const lowerColor = lowerStyle.color;

  return `
    <svg viewBox="0 0 120 200">
      <g id="figure-svg">
        <circle cx="${cx}" cy="${headY}" r="12" class="head"
          style="fill:#fff; stroke:${upperColor}; stroke-width:${upperStroke};" />
        <path d="M${cx} ${neckY} L${cx} ${shoulderY}"
          style="stroke:${upperColor}; stroke-width:${upperStroke}; fill:none; stroke-linecap:round;" />
        <path d="M${shoulderL} ${shoulderY} L${shoulderR} ${shoulderY}"
          style="stroke:${upperColor}; stroke-width:${upperStroke}; fill:none; stroke-linecap:round;" />
        <path d="M${shoulderL} ${shoulderY} L${waistL} ${waistY} L${hipL} ${hipY} L${hipR} ${hipY} L${waistR} ${waistY} L${shoulderR} ${shoulderY}"
          style="stroke:${upperColor}; stroke-width:${upperStroke}; fill:none; stroke-linejoin:round; stroke-linecap:round;" />
        <path d="M${shoulderL} ${shoulderY} L35 60 L30 88"
          style="stroke:${upperColor}; stroke-width:${upperStroke}; fill:none; stroke-linecap:round; stroke-linejoin:round;" />
        <path d="M${shoulderR} ${shoulderY} L85 60 L90 88"
          style="stroke:${upperColor}; stroke-width:${upperStroke}; fill:none; stroke-linecap:round; stroke-linejoin:round;" />
        <path d="M${hipL} ${hipY} L45 ${kneeY} L40 ${ankleY}"
          style="stroke:${lowerColor}; stroke-width:${lowerStroke}; fill:none; stroke-linecap:round; stroke-linejoin:round;" />
        <path d="M${hipR} ${hipY} L75 ${kneeY} L80 ${ankleY}"
          style="stroke:${lowerColor}; stroke-width:${lowerStroke}; fill:none; stroke-linecap:round; stroke-linejoin:round;" />
      </g>
    </svg>
  `;
}

function getStrengthStyle(value, activeColor) {
  const baseWidth = 2.8;
  const maxWidth = 6.5;
  const ref = 100;
  let ratio = Math.min(value / ref, 1.5);
  if (ratio < 0.1) ratio = 0.1;

  const width = baseWidth + (maxWidth - baseWidth) * Math.min(ratio, 1);
  const color = interpolateColor('#cccccc', activeColor, Math.min(ratio, 1));
  return { width, color };
}

function interpolateColor(a, b, t) {
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);
  const ar = (ah >> 16) & 255, ag = (ah >> 8) & 255, ab = ah & 255;
  const br = (bh >> 16) & 255, bg = (bh >> 8) & 255, bb = bh & 255;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `rgb(${rr}, ${rg}, ${rb})`;
}

// ===================== Create: I know how to... =====================
function goCreate() {
  resetCreator();
  showScreen('screen-create');
}

function resetCreator() {
  document.getElementById('create-title').value = '';
  document.getElementById('create-desc').value = '';
  document.getElementById('adjust-input').value = '';
  adjustmentsLeft = 3;
  currentProgram = null;
  updateAdjustCount();

  const saved = storageGet('howto_create_generations', 3);
  createGenerationsLeft = saved;
  updateCreateRemain();

  document.querySelectorAll('#create-flow .create-step').forEach((s, i) => s.classList.toggle('active', i === 0));
}

function updateCreateRemain() {
  const el = document.getElementById('create-remain');
  if (el) el.textContent = createGenerationsLeft;
  const btn = document.getElementById('create-generate-btn');
  if (btn) {
    btn.disabled = createGenerationsLeft <= 0;
    btn.style.opacity = createGenerationsLeft <= 0 ? '0.4' : '1';
    btn.textContent = createGenerationsLeft > 0 ? 'Generate' : 'No generations left';
  }
}

function createNext(step) {
  if (step === 2) {
    const title = document.getElementById('create-title').value.trim();
    if (!title) return alert('Please enter a title.');
  }
  document.querySelectorAll('#create-flow .create-step').forEach(s => s.classList.remove('active'));
  document.querySelector(`#create-flow .create-step[data-step="${step}"]`).classList.add('active');
}

function createPrev(step) {
  document.querySelectorAll('#create-flow .create-step').forEach(s => s.classList.remove('active'));
  document.querySelector(`#create-flow .create-step[data-step="${step}"]`).classList.add('active');
}

function generateProgram() {
  if (createGenerationsLeft <= 0) return;

  const title = document.getElementById('create-title').value.trim();
  const desc = document.getElementById('create-desc').value.trim();
  if (!title || !desc) return;

  createGenerationsLeft--;
  storageSet('howto_create_generations', createGenerationsLeft);
  updateCreateRemain();

  const preview = document.getElementById('preview-card');
  preview.innerHTML = '<div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  showScreen('screen-preview');

  setTimeout(() => {
    currentProgram = generateMockProgram(title, desc);
    renderPreview(currentProgram);
  }, 1200);
}

function generateMockProgram(name, desc) {
  const title = name.replace(/^how to\s*/i, '');
  return {
    id: 'ugc-' + Date.now(),
    title: name,
    overview: desc,
    type: 'guide',
    steps: [
      `Gather what you need to ${title}`,
      `Prepare your space`,
      `Follow the core steps`,
      `Check common mistakes`,
      `Practice and improve`
    ],
    createdAt: new Date().toISOString()
  };
}

function renderPreview(program) {
  const preview = document.getElementById('preview-card');
  preview.innerHTML = `
    <div class="generated-program-card">
      <div class="card-icon" style="font-size:40px; margin-bottom:12px;">✨</div>
      <h3>${program.title}</h3>
      <p>${program.overview}</p>
      <ul>
        ${program.steps.map((s, i) => `
          <li><span class="step-num" style="display:inline-flex; width:22px; height:22px; background:var(--text); color:#fff; border-radius:50%; align-items:center; justify-content:center; font-size:11px; font-weight:800;">${i + 1}</span><span>${s}</span></li>
        `).join('')}
      </ul>
    </div>
  `;
}

function updateAdjustCount() {
  document.getElementById('adjust-count').textContent = adjustmentsLeft;
  const btn = document.getElementById('adjust-btn');
  btn.disabled = adjustmentsLeft <= 0;
  btn.style.opacity = adjustmentsLeft <= 0 ? '0.4' : '1';
}

function adjustProgram() {
  const input = document.getElementById('adjust-input').value.trim();
  if (!input || adjustmentsLeft <= 0) return;

  adjustmentsLeft--;
  updateAdjustCount();

  const preview = document.getElementById('preview-card');
  preview.innerHTML = '<div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';

  setTimeout(() => {
    currentProgram.steps.push(`Adjustment: ${input}`);
    renderPreview(currentProgram);
    document.getElementById('adjust-input').value = '';
  }, 800);
}

function submitProgram() {
  if (!currentProgram) return;
  const submissions = storageGet('howto_submissions', []);
  currentProgram.status = 'pending';
  currentProgram.adjustmentsLeft = adjustmentsLeft;
  submissions.push(currentProgram);
  storageSet('howto_submissions', submissions);
  showScreen('screen-success');
}

function getApprovedPrograms() {
  const submissions = storageGet('howto_submissions', []);
  return submissions
    .filter(s => s.status === 'approved')
    .map(s => ({
      id: s.id,
      title: s.title.replace(/^how to\s*/i, ''),
      subtitle: s.overview.length > 50 ? s.overview.slice(0, 50) + '…' : s.overview,
      overview: s.overview,
      icon: '✨',
      screen: 'screen-ugc'
    }));
}
