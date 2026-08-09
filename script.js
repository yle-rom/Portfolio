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

  const startStatic = () => {
    staticAudio.play().catch(() => {});
    document.removeEventListener("mousemove", startStatic);
    document.removeEventListener("click", startStatic);
  };

  staticAudio.play().catch(() => {
    document.addEventListener("mousemove", startStatic);
    document.addEventListener("click", startStatic);
  });

  tvContainer.addEventListener("click", () => {
    if (isZooming) return;
    isZooming = true;

    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    staticAudio.pause();
    tvContainer.classList.add("zoom-in");

    setTimeout(() => {
      flash.classList.add("flash-active");

      setTimeout(() => {
        document.getElementById("room").style.display = "none";
        document.getElementById("inside-tv").style.display = "flex";
        document.getElementById("osd-nav").style.display = "flex";
        flash.classList.remove("flash-active");
        staticAudio.volume = 0.2;
        staticAudio.play();
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
        contact: "CH 04",
      };

      osdToggle.innerHTML = `<span class="osd-prompt">SELECT</span> ▶ [ ${channelDisplayMap[channelId] || "CH ??"} ]`;
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
> ROLE: BACKEND_SYSTEMS_ENGINEER
> BASE: IOANNINA_GREECE
> STATUS: CURRENTLY ACCEPTING NEW MISSIONS

> HIGH PROFICIENCY IN BACKEND & SYSTEMS LOGIC.
> READY TO DEPLOY...`;

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
    }, 40);
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
    java: {
      name: "JAVA",
      class: "HEAVY BACKEND",
      rank: "S-TIER",
      exp: "EXPERT",
      icon: "devicon-java-plain",
    },
    python: {
      name: "PYTHON",
      class: "SCRIPTING / AI",
      rank: "B-TIER",
      exp: "PROFICIENT",
      icon: "devicon-python-plain",
    },
    rust: {
      name: "RUST",
      class: "SYSTEMS BRAWLER",
      rank: "C-TIER",
      exp: "NOVICE",
      icon: "devicon-rust-plain",
    },
    sql: {
      name: "SQL",
      class: "DATA JUGGERNAUT",
      rank: "A-TIER",
      exp: "ADVANCED",
      icon: "devicon-mysql-plain",
    },

    // SYSTEM & DEPLOY
    arch: {
      name: "ARCH LINUX",
      class: "DISTRO GRANDMASTER (BTW)",
      rank: "S-TIER",
      exp: "EXPERT",
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
      icon: "devicon-nodejs-plain",
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

  document.querySelectorAll(".fighter-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", (e) => {
      const data = fighterData[e.target.getAttribute("data-fighter")];
      if (data) {
        fName.innerText = data.name;
        fClass.innerText = `CLASS: ${data.class}`;
        fRank.innerText = data.rank;
        fExp.innerText = data.exp;
        fIcon.className = data.icon;
      }
    });
  });
  // Projects Memory Card Logic
  const projectData = {
    lsm: `<h1 class="rm-h1"># Multithreaded_LSM_Engine</h1><p class="rm-p">> High-performance, concurrent LSM-tree storage engine in C.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Extended a single-threaded baseline (Kiwi) into a thread-safe architecture.</p><p class="rm-p">- Implements POSIX Threads (mutexes and semaphores) for safe concurrency.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Multithreaded_LSM_Engine" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    compiler: `<h1 class="rm-h1"># CutePy_Translator</h1><p class="rm-p">> A complete compiler for a custom Python-like language, built from scratch in Python.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- <b>Lexer:</b> Utilizes a deterministic finite automaton (DFA) state machine.</p><p class="rm-p">- <b>Parser:</b> Custom Recursive Descent Parser validating Context-Free Grammar.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Translator" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    bookstore: `<h1 class="rm-h1"># Social_Bookstore</h1><p class="rm-p">> Enterprise-level Spring Boot web application for free book exchanges.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Architected using strict MVC patterns.</p><p class="rm-p">- Employs GoF Strategy and Template Method design patterns.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Social_Bookstore" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    complex_data: `<h1 class="rm-h1"># Handling_Complex_Data</h1><p class="rm-p">> Java implementations of advanced data management and spatial indexing.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Built external Merge Sort and Natural Join processing algorithms.</p><p class="rm-p">- Implemented STR bulk-loading for R-Trees.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Handling_Complex_Data" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    ai: `<h1 class="rm-h1"># Artificial_Intelligence</h1><p class="rm-p">> Foundational AI search algorithms modeled for state-space environments.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Solves physical cube-arrangement puzzles via Uniform Cost Search (UCS).</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Artificial_Intelligence" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    comp_intel: `<h1 class="rm-h1"># Computational_Intelligence</h1><p class="rm-p">> Artificial neural networks and unsupervised learning algorithms from scratch.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- <b>MLP Classifiers:</b> Custom backpropagation and activation functions.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Computational_Intelligence" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    data_structs: `<h1 class="rm-h1"># Data_Structures</h1><p class="rm-p">> Core computer science data structures implemented from the ground up in Java.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Includes Union-Find, dynamic Stacks, and BFS graph traversal.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Data_Structures" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    info_retrieval: `<h1 class="rm-h1"># Information_Retrieval</h1><p class="rm-p">> Java-based Information Retrieval system for indexing and searching musical metadata.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Utilizes Apache Lucene for in-memory indexing and tokenization.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/Information_Retrieval" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
    javagames: `<h1 class="rm-h1"># javaGames</h1><p class="rm-p">> A collection of interactive terminal games written in Java.</p><h2 class="rm-h2">## Key Features</h2><p class="rm-p">- Includes MemoryGame and PrisonerGame terminal interfaces.</p><h2 class="rm-h2">## Links</h2><p class="rm-p">> <a href="https://github.com/yle-rom/javaGames" target="_blank" style="color: #0f0;">[ EXTRACT SOURCE ]</a></p>`,
  };

  const tvScreen = document.getElementById("proj-screen");

  document.querySelectorAll(".save-block").forEach((block) => {
    block.addEventListener("mouseenter", (e) => {
      document
        .querySelectorAll(".save-block")
        .forEach((b) => b.classList.remove("active-save"));
      const currentBlock = e.currentTarget;
      currentBlock.classList.add("active-save");

      const projId = currentBlock.getAttribute("data-proj");
      if (projectData[projId]) {
        tvScreen.innerHTML = projectData[projId];
      }
    });
  });
});
