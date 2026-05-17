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
        9: {
          lesson: "Growth Mindset",
          question: "What is your toughest subject in school and how can you get better?",
        },
      },

      middle: {
        9: {
          lesson: "Growth Mindset",
          question:
            "What is one challenge you are working through, and what is your plan to improve?",
        },
      },

      high: {
        9: {
          lesson: "Growth Mindset",
          question:
            "What is a weakness you are actively developing into a strength?",
        },
      },
    };

    const session = config.session || 1;
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




