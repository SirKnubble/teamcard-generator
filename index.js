Sentry.onLoad(function () {
  Sentry.init({
    dsn: "https://c37a5a77bf59871c783d66ee2a43abfa@o4509440993591296.ingest.de.sentry.io/4509555910377552",
    beforeSend(event, hint) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception && event.event_id) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }
      return event;
    },
    // Tracing
    tracesSampleRate: 1.0, // Capture 100% of the transactions (cuz im bad and boujee)
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0, // If not already sampling the entire session, change to 100% when sampling sessions where errors occur.
  });

  Sentry.lazyLoadIntegration("feedbackIntegration")
    .then((feedbackIntegration) => {
      Sentry.addIntegration(
        feedbackIntegration({
          //Config here or no? Hella confusing docs nowadays
          showBranding: false,
          triggerLabel: "Send Feedback",
          formTitle: "Send Feedback",
          submitButtonLabel: "Send Feedback",
          messagePlaceholder:
            "What doesn't work?\nWhere is room for improvement?",
          successMessageText: "Thank you for your feedback!",
        })
      );
    })
    .catch(() => {
      // this can happen if e.g. a network error occurs,
      // in this case User Feedback will not be enabled
    });
});

const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const joinDateInput = document.getElementById("joinDateInput");
const leaveDateInput = document.getElementById("leaveDateInput");
const profileImageInput = document.getElementById("profileImageInput");
const profileImageUrlInput = document.getElementById("profileImageUrlInput");
const discordInput = document.getElementById("discordInput");
const bgSelect = document.getElementById("bgSelect");
const bannerUpload = document.getElementById("bannerUpload");

const cardName = document.getElementById("cardName");
const cardRole = document.getElementById("cardRole");
const roleIcon = document.getElementById("roleIcon");
const cardDates = document.getElementById("cardDates");
const cardImage = document.getElementById("cardImage");
const cardDiscord = document.getElementById("cardDiscord");
const cardFooter = document.getElementById("cardFooter");
const cardBanner = document.getElementById("cardBanner");

const saveBtn = document.getElementById("saveBtn");
const downloadLink = document.getElementById("downloadLink");

const roleSettings = {
  BugHunter: {
    icon: "assets/icons/bughunter.png",
    color: "#d3bb23",
    bg: "assets/backgrounds/bughunter.png",
  },
  Helper: {
    icon: "assets/icons/helper.png",
    color: "#3afc30",
    bg: "assets/backgrounds/helper.png",
  },
  Designer: {
    icon: "assets/icons/designer.png",
    color: "#3498db",
    bg: "assets/backgrounds/designer.png",
  },
  Developer: {
    icon: "assets/icons/developer.png",
    color: "#a1dde0",
    bg: "assets/backgrounds/developer.png",
  },
};

function updateRoleUI(role) {
  cardRole.textContent = role;
  cardName.style.color = roleSettings[role].color;
  roleIcon.src = roleSettings[role].icon;
  cardBanner.style.backgroundImage = `url('${roleSettings[role].bg}')`;
}

nameInput.addEventListener("input", () => {
  cardName.textContent = nameInput.value || "Username";
});

roleInput.addEventListener("change", () => {
  const role = roleInput.value;
  updateRoleUI(role);
});

discordInput.addEventListener("input", () => {
  cardDiscord.textContent = discordInput.value || "@discord";
});

joinDateInput.addEventListener("input", updateDates);
leaveDateInput.addEventListener("input", updateDates);

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE");
}

function updateDates() {
  const join = joinDateInput.value ? new Date(joinDateInput.value) : null;
  const leave = leaveDateInput.value ? new Date(leaveDateInput.value) : null;

  const joinStr = join ? formatDate(join.toISOString()) : "??.??.????";
  const leaveStr = leave ? formatDate(leave.toISOString()) : "??.??.????";
  cardDates.textContent = `${joinStr} – ${leaveStr}`;

  const days =
    join && leave
      ? Math.max((0, Math.ceil((leave - join) / (1000 * 60 * 60 * 24))) + 1)
      : 0;
  document.getElementById("cardDays").textContent = `${days} Tage im Team`;
}

profileImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    cardImage.src = reader.result;
  };
  reader.readAsDataURL(file);
});

profileImageUrlInput.addEventListener("input", () => {
  if (!profileImageInput.files.length) {
    cardImage.src =
      profileImageUrlInput.value || "https://example.com/image.png";
  }
});

bgSelect.addEventListener("change", () => {
  cardBanner.style.backgroundImage = `url('${bgSelect.value}')`;
});

bannerUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    cardBanner.style.backgroundImage = `url('${reader.result}')`;
  };
  reader.readAsDataURL(file);
});

saveBtn.addEventListener("click", () => {
  const card = document.getElementById("card");
  const clone = card.cloneNode(true);
  const computedStyle = window.getComputedStyle(card);
  //Setup computed style
  clone.style.backgroundColor = computedStyle.backgroundColor;
  clone.style.borderRadius = computedStyle.borderRadius;
  clone.style.boxShadow = computedStyle.boxShadow;
  clone.style.overflow = "hidden";

  clone.style.position = "fixed";
  clone.style.left = "-9999px";

  document.body.appendChild(clone);

  html2canvas(clone, { backgroundColor: null }).then((canvas) => {
    const link = document.createElement("a");
    downloadLink.download = "nrc-team.png";
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.style.display = "inline-block";
    downloadLink.click();
    document.body.removeChild(clone);
  });
});

updateRoleUI(roleInput.value);
