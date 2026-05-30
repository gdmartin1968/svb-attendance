(function () {
  function injectStyles() {
    if (document.getElementById("svbProgramInfoStyles")) return;

    const style = document.createElement("style");
    style.id = "svbProgramInfoStyles";

    style.textContent = `
      .programInfoCard {
        margin-top: 12px;
        padding: 14px 16px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.08);
        color: #eaf2ff;
        box-shadow: 0 8px 22px rgba(0,0,0,0.25);
      }

      .programInfoTop {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .programInfoSession {
        font-weight: 900;
        font-size: 15px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #9ff3dc;
      }

      .programInfoLesson {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
      }

      .programInfoQuestion {
        margin-top: 8px;
        font-size: 18px;
        line-height: 1.35;
        font-weight: 800;
      }

      .programInfoLabel {
        display: block;
        margin-bottom: 3px;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #b7c7de;
      }

      .programInfoMeta {
        margin-top: 10px;
        font-size: 14px;
        color: #cfe;
      }

      .programInfoScheduleNotice {
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 193, 7, 0.16);
        border: 1px solid rgba(255, 193, 7, 0.35);
        color: #fff7d6;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.35;
      }

      .programInfoAssistantRow {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }

      .programInfoAssistantChip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 9px 12px;
        border-radius: 12px;
        border: 2px solid rgba(255,255,255,0.15);
        background: rgba(255,255,255,0.08);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
        user-select: none;
      }

      .programInfoAssistantChip.present {
        background: linear-gradient(135deg, #3498db, #21618c);
        border-color: #5dade2;
        box-shadow: 0 0 14px rgba(93,173,226,0.45);
      }

      .programInfoAssistantDot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: rgba(255,255,255,0.35);
      }

      .programInfoAssistantChip.present .programInfoAssistantDot {
        background: #fff;
      }
    `;

    document.head.appendChild(style);
  }

  function renderProgramInfo() {
    const config = window.SVB_PROGRAM_INFO || {};
    const target = document.getElementById("svbProgramInfoMount");

    if (!target) return;

    const QUESTION_BANKS = {
      elementary: {
        1: {
          lesson: "The 5 Pillars for Success",
          question:
            "Which pillar is your biggest strength right now?",
        },

        2: {
          lesson: "Parts of the Court",
          question:
            "What part of tennis do you want to improve most?",
        },

        3: {
          lesson: "Citizenship",
          question:
            "What does being a good citizen mean to you?",
        },

        4: {
          lesson: "Champion Mindset",
          question:
            "What is one way you can think more positively?",
        },

        5: {
          lesson: "Responsibility",
          question:
            "What responsibility do you handle well already?",
        },

        6: {
          lesson: "Purpose & Focus",
          question:
            "Why is focus important when learning something difficult?",
        },

        7: {
          lesson: "Tennis Scoring",
          question:
            "What part of tennis scoring is easiest for you?",
        },

        8: {
          lesson: "Goal Setting",
          question:
            "What is one goal you want to accomplish this year?",
        },

        9: {
          lesson: "Trustworthiness",
          question:
            "Why is trust important in friendships and teamwork?",
        },

        10: {
          lesson: "Leadership",
          question:
            "What qualities make someone a good leader?",
        },

        11: {
          lesson: "Tennis Racquet Parts",
          question:
            "What part of the racquet helps you control the ball?",
        },

        12: {
          lesson: "100 Tennis Facts",
          question:
            "What is one interesting thing you learned about tennis?",
        },

        13: {
          lesson: "Reflection",
          question:
            "What are you most proud of learning this season?",
        },

        14: {
          lesson: "Perseverance",
          question:
            "What is something difficult you kept working on?",
        },

        15: {
          lesson: "Confidence",
          question:
            "What helps you feel confident?",
        },

        16: {
          lesson: "Celebration",
          question:
            "What achievement are you proudest of this year?",
        },
      },

      middle: {},

      high: {},
    };

    const PROGRAM_SCHEDULES = {
      stewart_tennis: {
        programName: "Stewart Tennis",
        startDate: "2026-04-13",
        meetingDays: [1, 3],
        time: "1:45 - 3:45pm",
        totalSessions: 16,
      },

      watergrass: {
        programName: "Watergrass Elementary Tennis",
        startDate: "2026-04-13",
        meetingDays: [1, 3],
        time: "3:45 - 5:45pm",
        totalSessions: 16,
      },

      woodland_tiny_tennis: {
        programName: "Woodland Tiny Tennis",
        startDate: "2026-04-14",
        meetingDays: [2, 4],
        time: "2:40 - 4:10pm",
        totalSessions: 16,
      },

      weschapel: {
        programName: "Wesley Chapel Elementary",
        startDate: "2026-08-10",
        meetingDays: [1, 3],
        time: "Time TBD",
        totalSessions: 16,
      },

      woodland: {
        programName: "Woodland Elementary",
        startDate: "2026-08-11",
        meetingDays: [2, 4],
        time: "Time TBD",
        totalSessions: 16,
      },
      westzephyrhills: {
        programName: "West Zephyrhills Elementary Tennis",
        startDate: "2026-04-14",
        meetingDays: [2, 4],
        time: "4:15 - 5:45pm",
        totalSessions: 16,
      },
    };

    function parseLocalDate(dateString) {
      const [year, month, day] = dateString
        .split("-")
        .map(Number);

      return new Date(year, month - 1, day);
    }

    function formatLocalDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    function addDays(date, days) {
      const next = new Date(date);
      next.setDate(next.getDate() + days);
      return next;
    }

    function nthWeekdayOfMonth(year, monthIndex, weekday, nth) {
      const date = new Date(year, monthIndex, 1);

      while (date.getDay() !== weekday) {
        date.setDate(date.getDate() + 1);
      }

      date.setDate(date.getDate() + (nth - 1) * 7);
      return date;
    }

    function lastWeekdayOfMonth(year, monthIndex, weekday) {
      const date = new Date(year, monthIndex + 1, 0);

      while (date.getDay() !== weekday) {
        date.setDate(date.getDate() - 1);
      }

      return date;
    }

    function getUSHolidays(year) {
      const holidays = {};

      function add(date, name) {
        holidays[formatLocalDate(date)] = name;
      }

      add(new Date(year, 0, 1), "New Year's Day");
      add(nthWeekdayOfMonth(year, 0, 1, 3), "Martin Luther King Jr. Day");
      add(nthWeekdayOfMonth(year, 1, 1, 3), "Presidents' Day");
      add(lastWeekdayOfMonth(year, 4, 1), "Memorial Day");
      add(new Date(year, 5, 19), "Juneteenth");
      add(new Date(year, 6, 4), "Independence Day");
      add(nthWeekdayOfMonth(year, 8, 1, 1), "Labor Day");
      add(nthWeekdayOfMonth(year, 9, 1, 2), "Columbus Day / Indigenous Peoples' Day");
      add(new Date(year, 10, 11), "Veterans Day");
      add(nthWeekdayOfMonth(year, 10, 4, 4), "Thanksgiving Day");
      add(new Date(year, 11, 25), "Christmas Day");

      return holidays;
    }

    function getHolidayName(date) {
      const year = date.getFullYear();
      const holidays = {
        ...getUSHolidays(year - 1),
        ...getUSHolidays(year),
        ...getUSHolidays(year + 1),
      };

      return holidays[formatLocalDate(date)] || "";
    }

    function generateSessionSchedule(rosterId) {
      const program = PROGRAM_SCHEDULES[rosterId];

      if (!program) return [];

      const schedule = [];
      let date = parseLocalDate(program.startDate);
      let sessionNumber = 1;
      let safetyCounter = 0;

      while (
        sessionNumber <= program.totalSessions &&
        safetyCounter < 180
      ) {
        const isMeetingDay =
          program.meetingDays.includes(date.getDay());

        if (isMeetingDay) {
          const holidayName = getHolidayName(date);

          if (holidayName) {
            schedule.push({
              date: formatLocalDate(date),
              displayDate: date.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              holidayName,
              skipped: true,
              note: "No session proposed - holiday",
            });
          } else {
            schedule.push({
              session: sessionNumber,
              date: formatLocalDate(date),
              displayDate: date.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              holidayName: "",
              skipped: false,
              time: program.time,
            });

            sessionNumber += 1;
          }
        }

        date = addDays(date, 1);
        safetyCounter += 1;
      }

      return schedule;
    }

    function getScheduleMeta(rosterId) {
      const program = PROGRAM_SCHEDULES[rosterId];
      const schedule = generateSessionSchedule(rosterId);

      if (!program || !schedule.length) {
        return {
          schedule,
          notice: "",
          currentSession: config.session || 1,
        };
      }

      const today = new Date();
      const todayKey = formatLocalDate(today);

      const completedSessions = schedule.filter((item) => {
        return !item.skipped && item.date <= todayKey;
      });

      const current =
        completedSessions[completedSessions.length - 1] ||
        schedule.find((item) => !item.skipped);

      const next =
        schedule.find((item) => {
          return !item.skipped && item.date >= todayKey;
        }) || null;

      const upcomingHoliday =
        schedule.find((item) => {
          return item.skipped && item.date >= todayKey;
        }) || null;

      let notice = "";

      if (upcomingHoliday) {
        notice =
          `Holiday flag: ${upcomingHoliday.displayDate} is ${upcomingHoliday.holidayName}. ` +
          "That date is skipped and the next class session is pushed forward.";
      }

      window.SVB_PROGRAM_GENERATED_SCHEDULE = schedule;

      return {
        schedule,
        notice,
        currentSession: current?.session || config.session || 1,
        currentDate: current?.displayDate || "",
        nextSession: next,
        upcomingHoliday,
      };
    }

    function calculateSession(rosterId) {
      return getScheduleMeta(rosterId).currentSession;
    }

    const scheduleMeta = getScheduleMeta(config.rosterId);
    const session = scheduleMeta.currentSession;
    const totalSessions = config.totalSessions || 16;

    const ageGroup = config.ageGroup || "elementary";

    const bankItem = QUESTION_BANKS[ageGroup]?.[session] || {};

    const lesson = config.lesson || bankItem.lesson || "";
    const question = config.question || bankItem.question || "";

    const assistantLabel =
      config.assistantLabel || "Teacher Assistant";

    const assistantNames = Array.isArray(config.assistantNames)
      ? config.assistantNames
      : [config.assistantName || "Other"];

    const today =
      config.dateValue ||
      new Date().toISOString().slice(0, 10);

    const assistantStorageKey =
      "svb_program_assistants_" +
      (config.rosterId || config.programName || "default") +
      "_" +
      today;

    function loadAssistantStatus() {
      try {
        return JSON.parse(
          localStorage.getItem(assistantStorageKey) || "{}"
        );
      } catch {
        return {};
      }
    }

    function saveAssistantStatus(map) {
      localStorage.setItem(
        assistantStorageKey,
        JSON.stringify(map)
      );
    }

    function getAssistantsPresent() {
      const statusMap = loadAssistantStatus();

      return assistantNames.filter(
        (assistantName) => !!statusMap[assistantName]
      );
    }

    function renderAssistantChips() {
      const statusMap = loadAssistantStatus();

      return assistantNames
        .map((name) => {
          const safeName = String(name).replace(/"/g, "&quot;");
          const isPresent = !!statusMap[name];

          return `
            <button
              type="button"
              class="programInfoAssistantChip${isPresent ? " present" : ""}"
              data-assistant-name="${safeName}"
            >
              <span class="programInfoAssistantDot"></span>
              <span>${name}</span>
            </button>
          `;
        })
        .join("");
    }

    window.SVB_PROGRAM_ASSISTANTS_PRESENT =
      getAssistantsPresent();

    target.innerHTML = `
      <section class="programInfoCard">

        <div class="programInfoTop">
          <div class="programInfoSession">
            Session ${session} of ${totalSessions}
          </div>

          ${
            lesson
              ? `<div class="programInfoLesson">${lesson}</div>`
              : ""
          }
        </div>

        <div class="programInfoQuestion">
          <span class="programInfoLabel">
            Question of the Day
          </span>

          ${
            question ||
            "What is one thing you want to improve today?"
          }
        </div>

        ${assistantNames.length ? `
        ${assistantNames.length ? `
        <div class="programInfoMeta">
          <strong>${assistantLabel}:</strong>
          <div class="programInfoAssistantRow">
            ${renderAssistantChips()}
          </div>
        </div>` : ""}
        ` : ""}

      </section>
    `;

    target
      .querySelectorAll(".programInfoAssistantChip")
      .forEach((chip) => {
        chip.addEventListener("click", () => {
          const name = chip.dataset.assistantName;

          const statusMap = loadAssistantStatus();

          statusMap[name] = !statusMap[name];

          saveAssistantStatus(statusMap);

          window.SVB_PROGRAM_ASSISTANTS_PRESENT =
            getAssistantsPresent();

          renderProgramInfo();

          if (
            typeof window.SVB_PROGRAM_INFO_UPDATED ===
            "function"
          ) {
            window.SVB_PROGRAM_INFO_UPDATED();
          }
        });
      });
  }

  function init() {
    injectStyles();
    renderProgramInfo();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }
})();




