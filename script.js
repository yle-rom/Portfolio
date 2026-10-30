document.addEventListener("DOMContentLoaded", () => {
  const tvContainer = document.getElementById("tv-container");
  const clickSound = document.getElementById("tv-click-sound");
  const staticAudio = document.getElementById("static-audio");
  const zapSound = document.getElementById("zap-sound");
  const osdToggle = document.getElementById("osd-toggle");
  const osdDropdown = document.getElementById("osd-dropdown");

  staticAudio.volume = 0.1;
  clickSound.volume = 0.3;

  const flash = document.createElement("div");
  flash.id = "flash";
  document.body.appendChild(flash);

  let isZooming = false;

  // Phase-lock all 1s blinks to the page clock so every blinking text flashes together.
  // A CSS animation restarts whenever its element is shown, so channels opened later drift.
  const BLINKS = ["blink", "slow-blink", "rapid-flash-green"];
  const syncBlinks = () => {
    requestAnimationFrame(() => {
      document.getAnimations().forEach((a) => {
        if (
          BLINKS.includes(a.animationName) &&
          a.effect.getTiming().duration === 1000
        ) {
          a.startTime = 0;
        }
      });
    });
  };
  syncBlinks();

  // --- MUTE & VOLUME LOGIC ---
  const muteBtn = document.getElementById("mute-btn");
  const volumeOsd = document.getElementById("volume-osd");
  const volBars = document.getElementById("vol-bars");
  let isMuted = false;
  let volumeTimeout;

  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;

    staticAudio.muted = isMuted;
    clickSound.muted = isMuted;
    zapSound.muted = isMuted;

    // Massively long strings. CSS will naturally cut them off at the edge of the screen!
    const barsOn =
      " |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| ";
    const barsOff =
      " -------------------------------------------------------------------------------------------------------------------------- ";

    if (isMuted) {
      muteBtn.classList.add("is-muted");
      volBars.innerText = barsOff;
    } else {
      muteBtn.classList.remove("is-muted");
      volBars.innerText = barsOn;
    }

    volumeOsd.classList.add("volume-visible");
    clearTimeout(volumeTimeout);
    volumeTimeout = setTimeout(() => {
      volumeOsd.classList.remove("volume-visible");
    }, 2000);
  });

  // Static audio starts only once the visitor clicks the TV (no sound before consent)
  tvContainer.addEventListener("click", () => {
    if (isZooming) return;
    isZooming = true;

    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    document.getElementById("tune-hint").style.display = "none";
    tvContainer.classList.add("zoom-in");

    setTimeout(() => {
      flash.classList.add("flash-active");

      setTimeout(() => {
        document.getElementById("room").style.display = "none";
        document.getElementById("inside-tv").style.display = "flex";
        document.getElementById("osd-nav").style.display = "flex";
        syncBlinks();
        flash.classList.remove("flash-active");
        staticAudio.volume = 0.2;
        staticAudio.play().catch(() => {});
      }, 500);
    }, 1200);
  });

  osdToggle.addEventListener("click", () => {
    osdDropdown.style.display =
      osdDropdown.style.display === "flex" ? "none" : "flex";
  });

  const changeChannel = (channelId) => {
    zapSound.currentTime = 0;
    zapSound.play().catch(() => {});

    const innerStatic = document.getElementById("inner-static");
    innerStatic.style.opacity = "0.8";
    osdDropdown.style.display = "none";

    setTimeout(() => {
      innerStatic.style.opacity = "0.15";

      document.querySelectorAll(".program").forEach((prog) => {
        prog.classList.remove("active-program");
      });

      const targetProgram = document.getElementById(`ch-${channelId}`);
      if (targetProgram) {
        targetProgram.classList.add("active-program");
      }

      if (channelId === "info") {
        startTypewriter();
      }

      const channelDisplayMap = {
        "main-menu": "CH 00",
        info: "CH 01",
        skills: "CH 02",
        projects: "CH 03",
        agent: "CH 04",
        contact: "CH 05",
      };

      osdToggle.innerHTML = `<span class="osd-prompt">SELECT</span> ▶ [ ${channelDisplayMap[channelId] || "CH ??"} ]`;
      syncBlinks();
    }, 300);
  };

  document.querySelectorAll(".channel-btn, .osd-option").forEach((el) => {
    el.addEventListener("click", (e) => {
      const target = e.currentTarget.getAttribute("data-channel");
      if (target) changeChannel(target);
    });
  });

  // Typewriter Logic
  const bioText = `> INITIALIZING...
> LOADING DATA... SUCCESS.

> NAME: ROMANOS_KOTSIS
> ROLE: BACKEND_ENGINEER // PYTHON · JAVA
> BASE: IOANNINA_GR // REMOTE
> NOW: KEYVOTO_DATA_CRAWLING
> EDU: M.ENG_CSE_UOI
> STATUS: OPEN_TO_BACKEND_ROLES`;

  const typewriterElement = document.getElementById("typewriter-text");
  let typeInterval;

  const startTypewriter = () => {
    clearInterval(typeInterval);
    typewriterElement.innerHTML = "";
    let i = 0;
    typeInterval = setInterval(() => {
      if (i < bioText.length) {
        typewriterElement.innerHTML += bioText.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 20);
  };

  // Contact Timer Logic
  const contactTimerElement = document.getElementById("contact-timer");
  let countdown = 300;

  setInterval(() => {
    countdown--;
    if (countdown < 0) countdown = 300;

    let minutes = Math.floor(countdown / 60)
      .toString()
      .padStart(2, "0");
    let seconds = (countdown % 60).toString().padStart(2, "0");

    if (contactTimerElement) {
      contactTimerElement.innerText = `${minutes}:${seconds}`;
    }
  }, 1000);

  // --- SKILLS FIGHTER ROSTER LOGIC ---
  const fighterData = {
    // BACKEND
    python: {
      name: "PYTHON",
      class: "SCRIPTING / DATA",
      rank: "S-TIER",
      exp: "EXPERT",
      icon: "devicon-python-plain",
    },
    java: {
      name: "JAVA",
      class: "HEAVY BACKEND",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-java-plain",
    },
    c: {
      name: "C",
      class: "LOW-LEVEL DUELIST",
      rank: "B-TIER",
      exp: "PROFICIENT",
      icon: "devicon-c-plain",
    },
    spring: {
      name: "SPRING BOOT",
      class: "BOOT · SECURITY · DATA",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-spring-plain",
    },
    mongo: {
      name: "MONGODB",
      class: "DOCUMENT HOARDER",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-mongodb-plain",
    },
    postgres: {
      name: "POSTGRESQL",
      class: "VECTOR SEEKER (PGVECTOR)",
      rank: "B-TIER",
      exp: "PROFICIENT",
      icon: "devicon-postgresql-plain",
    },
    mysql: {
      name: "MYSQL",
      class: "RELATIONAL VETERAN",
      rank: "B-TIER",
      exp: "PROFICIENT",
      icon: "devicon-mysql-plain",
    },
    crawl: {
      name: "WEB CRAWLING",
      class: "APIS · BEAUTIFULSOUP · SELENIUM · PLAYWRIGHT",
      rank: "S-TIER",
      exp: "EXPERT",
      icon: "devicon-selenium-plain",
    },
    ai: {
      name: "LOCAL AI",
      class: "RAG · OLLAMA · PGVECTOR",
      rank: "B-TIER",
      exp: "PROFICIENT",
      icon: "devicon-ollama-plain",
    },

    // SYSTEM & DEPLOY
    arch: {
      name: "ARCH LINUX",
      class: "DISTRO GRANDMASTER (BTW)",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-archlinux-plain",
    },
    docker: {
      name: "DOCKER",
      class: "CONTAINER MAGE",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-docker-plain",
    },
    bash: {
      name: "BASH",
      class: "SHELL AUTOMATOR",
      rank: "B-TIER",
      exp: "PROFICIENT",
      icon: "devicon-bash-plain",
    },
    git: {
      name: "GIT",
      class: "TIMELINE WARPER",
      rank: "S-TIER",
      exp: "EXPERT",
      icon: "devicon-git-plain",
    },
    ssh: {
      name: "SSH / VPS",
      class: "REMOTE INFILTRATOR",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-ssh-original-wordmark",
    },
    nginx: {
      name: "NGINX",
      class: "TRAFFIC CONTROLLER",
      rank: "B-TIER",
      exp: "PROFICIENT",
      icon: "devicon-nginx-original",
    },
    pm2: {
      name: "PM2",
      class: "PROCESS NECROMANCER",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-pm2-plain",
    },
    systemd: {
      name: "SYSTEMD",
      class: "DAEMON CONTROLLER",
      rank: "B-TIER",
      exp: "PROFICIENT",
      icon: "devicon-linux-plain",
    },
    cicd: {
      name: "CI/CD PIPELINES",
      class: "AUTOMATION ARCHITECT",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-githubactions-plain",
    },
  };

  const fName = document.getElementById("f-name");
  const fClass = document.getElementById("f-class");
  const fRank = document.getElementById("f-rank");
  const fExp = document.getElementById("f-exp");
  const fIcon = document.getElementById("f-icon");

  const showFighter = (e) => {
    const data = fighterData[e.currentTarget.getAttribute("data-fighter")];
    if (data) {
      fName.innerText = data.name;
      fClass.innerText = `CLASS: ${data.class}`;
      fRank.innerText = data.rank;
      fExp.innerText = data.exp;
      fIcon.className = data.icon;
    }
  };

  // Hover for mouse, click for touch, focus for keyboard
  document.querySelectorAll(".fighter-btn").forEach((btn) => {
    ["mouseenter", "click", "focus"].forEach((evt) =>
      btn.addEventListener(evt, showFighter),
    );
  });
  // Projects Memory Card Logic
  const projectData = {
    magi: `<h1 class="rm-h1"># MAGI_AI</h1><p class="rm-p">> Private local assistant on one model (qwen3.5:9b via Ollama), with a CLI and an Electron UI.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- <b>Memory:</b> RAG (pgvector) over past chats, plus saved fact files for global and per-project context.</p><p class="rm-p">- <b>Tools:</b> web search via self-hosted SearXNG, file edits shown as diffs, approved terminal commands, secret files fenced off.</p><p class="rm-p">- <b>Sandbox:</b> code runs under bubblewrap with no network, no $HOME and a 15s timeout.</p><p class="rm-p">- <b>/vote:</b> three MAGI judges give verdicts with reasoning, then a tally.</p><p class="rm-p">- <b>/news:</b> RSS from many outlets, clustered into stories by embeddings, summarized per section and split by outlet lean.</p><p class="rm-p">- <b>Stack:</b> Node/Express, PostgreSQL + pgvector, Docker Compose, Ollama.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/magi_AI" target="_blank" rel="noopener noreferrer" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    magips: `<h1 class="rm-h1"># MagiPs</h1><p class="rm-p">> What's running on my machine, and how do I stop it? The ~30 things that matter instead of 500 processes.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Groups processes into apps, services, dev servers, databases, containers and open ports by parsing /proc.</p><p class="rm-p">- Explains what each thing is, with the right way to stop it built in.</p><p class="rm-p">- Zero dependencies beyond libc, with a unit test suite and JSON output for scripting.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/MagiPs" target="_blank" rel="noopener noreferrer" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    magicc: `<h1 class="rm-h1"># MagiCC</h1><p class="rm-p">> What is Docker keeping on my disk, and what can I delete? An explained alternative to docker system prune.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Rates every image, container, volume, network and cache entry as safe, check or keep, and explains why.</p><p class="rm-p">- Interactive picker with confirmations by risk: deleting a volume with data means typing part of its name.</p><p class="rm-p">- Reports measured disk space freed, not an estimate. No root needed.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/MagiCC" target="_blank" rel="noopener noreferrer" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    waygo: `<h1 class="rm-h1"># WayGo</h1><p class="rm-p">> Master's thesis: intercity bus route and booking platform for Greece.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Selenium scrapers aggregate real-time routes and prices from fragmented operator sites.</p><p class="rm-p">- Spring Boot REST APIs + MySQL, deployed to a VPS with GitHub Actions.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://waygotickets.com" target="_blank" rel="noopener noreferrer" style="color: #0f0;">[ LIVE SITE ]</a></p><p class="rm-p">> <a href="https://github.com/vabasda/WayGo" target="_blank" rel="noopener noreferrer" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    dotfiles: `<h1 class="rm-h1"># dotfiles</h1><p class="rm-p">> My Arch Linux desktop: Hyprland, Waybar, Alacritty, Zsh, Neovim.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Tracked with a bare git repo against $HOME, no symlink manager needed.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/dotfiles" target="_blank" rel="noopener noreferrer" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    bash_scripts: `<h1 class="rm-h1"># Bash_Scripts</h1><p class="rm-p">> Scripts for my Arch/Hyprland desktop, symlinked into ~/.local/bin.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- MAGI/NERV terminal dashboard that opens inside the Waybar frame.</p><p class="rm-p">- Rofi power and power-profile menus, pywal/custom theme toggle, keyboard RGB, battery notifier as a systemd user service.</p><p class="rm-p">- Small tools: image recoloring (gowall), OverTheWire SSH helper, Wayland launchers for Compass and wireguird.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Bash_Scripts" target="_blank" rel="noopener noreferrer" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    archive: `<h1 class="rm-h1"># Archive</h1><p class="rm-p">> University projects (M.Eng CS&amp;E, Univ. of Ioannina).</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Multithreaded LSM storage engine (C, pthreads)</p><p class="rm-p">- Compiler for a Python-like language (Python)</p><p class="rm-p">- Social Bookstore (Spring Boot)</p><p class="rm-p">- External sort &amp; R-tree indexing, neural networks from scratch, AI search algorithms, Lucene search engine, data structures, terminal games (Java)</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom" target="_blank" rel="noopener noreferrer" style="color: #0f0;">[ BROWSE PROFILE ]</a></p>`,
  };

  // --- PROJECTS: CARTRIDGE CONSOLE LOGIC ---
  const tvScreen = document.getElementById("proj-screen");
  const crtBezel = document.getElementById("crt-bezel");
  const consoleSlot = document.getElementById("console-slot");
  const slotCart = document.getElementById("slot-cart");
  const consoleLed = document.getElementById("console-led");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let loadedCart = null;
  let isLoading = false;

  // Fly a copy of the cartridge from the shelf into the console slot
  const flyToSlot = (cart) =>
    new Promise((resolve) => {
      if (reduceMotion) return resolve();
      const from = cart.getBoundingClientRect();
      const to = consoleSlot.getBoundingClientRect();
      const ghost = cart.cloneNode(true);
      ghost.classList.add("cart-ghost");
      Object.assign(ghost.style, {
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
      });
      document.body.appendChild(ghost);
      ghost.getBoundingClientRect(); // commit the start position before animating
      ghost.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})`;
      ghost.style.opacity = "0.4";
      setTimeout(() => {
        ghost.remove();
        resolve();
      }, 450);
    });

  const loadCartridge = async (cart) => {
    if (isLoading || cart === loadedCart) return;
    isLoading = true;

    // Eject the current cartridge back to the shelf
    if (loadedCart) loadedCart.classList.remove("in-console");
    consoleSlot.classList.remove("loaded");
    consoleLed.classList.remove("on");

    const flight = flyToSlot(cart);
    cart.classList.add("in-console");
    await flight;

    slotCart.innerText = cart.querySelector(".cart-title").innerText;
    consoleSlot.classList.add("loaded");
    loadedCart = cart;

    // Boot: click sound and a static burst, then the README appears
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
    consoleLed.classList.add("busy");
    crtBezel.classList.add("tuning");

    setTimeout(() => {
      tvScreen.innerHTML = projectData[cart.getAttribute("data-proj")];
      tvScreen.scrollTop = 0;
      crtBezel.classList.remove("tuning");
      consoleLed.classList.remove("busy");
      consoleLed.classList.add("on");
      isLoading = false;
    }, 400);
  };

  // Buttons, so click covers mouse, touch and keyboard (Enter/Space)
  document.querySelectorAll(".cartridge").forEach((cart) => {
    cart.addEventListener("click", (e) => loadCartridge(e.currentTarget));
  });

  // --- AGENT HOW-TO SHOW LOGIC ---
  const agentSteps = [
    {
      name: "INITIALIZE",
      points: [
        "WRITE THE BRIEF BEFORE THE FIRST PROMPT: THE GOAL, WHAT DONE LOOKS LIKE, AND THE HARD RULES.",
        "RULES LIVE IN A CLAUDE.MD FILE THE AGENT READS EVERY SESSION: HOW TO TALK TO ME, WHAT IT MUST NEVER TOUCH, AND HOW I WANT WORK DELIVERED.",
      ],
    },
    {
      name: "ROLES",
      points: [
        "I AM THE ARCHITECT AND ORCHESTRATOR: I OWN THE DESIGN, THE SCOPE AND THE TRADE-OFFS.",
        "CLAUDE CODE IS THE BUILDER: IT PROPOSES OPTIONS, WRITES THE CODE AND EXPLAINS THE WHY. DESIGN CALLS COME BACK TO ME.",
      ],
    },
    {
      name: "WORKFLOW",
      points: [
        "PLAN → APPROVE → BUILD IN SMALL STEPS → RUN IT TO VERIFY → ONE COMMIT PER CHANGE.",
        "ANALYZE BEFORE BUILDING. ONE STEP AT A TIME.",
        "A SHORT STATUS LINE TRACKS WHAT IS DONE, WHAT IS IN PROGRESS AND WHAT IS PARKED.",
      ],
    },
    {
      name: "GUARDRAILS",
      points: [
        "IT ASKS BEFORE EDITING AND SHOWS WHAT A CHANGE AFFECTS FIRST.",
        "NOTHING IS DONE UNTIL IT IS RUN AND CHECKED: A REAL TEST, A DATABASE QUERY, A RENDERED PAGE.",
        "CONFIGS ARE BACKED UP BEFORE ANY CHANGE. ONE COMMIT PER CHANGE, SO ANY STEP REVERTS IN ONE COMMAND.",
        "PRODUCTION IS OFF-LIMITS: IT PREPARES THE FILES AND EXACT COMMANDS, I RUN THEM.",
      ],
    },
    {
      name: "OPTIMIZE",
      points: [
        "IT KEEPS MEMORY FILES ON HOW I WORK AND UPDATES THEM AS I USE IT.",
        "CORRECT IT TWICE AND THE CORRECTION BECOMES A PERMANENT RULE.",
        "PERIODICALLY ASK FOR FOUND PATTERNS ON MY WORKFLOW AND HOW TO IMPROVE IT",
        "HANDOFF NOTES LET A NEW SESSION PICK UP WHERE THE LAST ONE STOPPED.",
      ],
    },
  ];

  const stepCount = document.getElementById("step-count");
  const stepName = document.getElementById("step-name");
  const stepBody = document.getElementById("step-body");
  const stepButtons = document.querySelectorAll(".step-btn");
  let currentStep = 0;

  const showStep = (index) => {
    currentStep = index;
    const step = agentSteps[index];
    stepCount.innerText = `STEP ${index + 1}/${agentSteps.length}`;
    stepName.innerText = step.name;
    stepBody.innerHTML = step.points.map((p) => `<li>${p}</li>`).join("");
    stepButtons.forEach((b) => b.classList.remove("active-step"));
    stepButtons[index].classList.add("active-step");
  };

  stepButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      showStep(Number(e.currentTarget.getAttribute("data-step")));
    });
  });

  document.getElementById("step-next").addEventListener("click", () => {
    showStep((currentStep + 1) % agentSteps.length);
  });

  showStep(0);
});
