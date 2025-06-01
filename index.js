const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const joinDateInput = document.getElementById("joinDateInput");
const leaveDateInput = document.getElementById("leaveDateInput");
const profileImageInput = document.getElementById("profileImageInput");
const profileImageUrlInput = document.getElementById("profileImageUrlInput");
const cardDiscordInput = document.getElementById("cardDiscordInput");
const bgSelect = document.getElementById("bgSelect");
const bannerUpload = document.getElementById("bannerUpload");
const cardName = document.getElementById("cardName");
const cardRole = document.getElementById("cardRole");
const roleIcon = document.getElementById("roleIcon");
const cardDates = document.getElementById("cardDates");
const cardImage = document.getElementById("cardImage");
const cardId = document.getElementById("cardId");
const cardFooter = document.getElementById("cardFooter");
const cardBanner = document.getElementById("cardBanner");
const saveBtn = document.getElementById("saveBtn");
const downloadLink = document.getElementById("downloadLink");
const roleIcons = {
  BugHunter: "assets/icons/bug_hunter.png",
  Helper: "assets/icons/helper.png",
  Designer: "assets/icons/designer.png",
  Developer: "assets/icons/developer.png",
};
const roleColors = {
  BugHunter: "#d3bb23",
  Helper: "#3afc30",
  Designer: "#3498db",
  Developer: "#a1dde0",
};
function updateRoleUI(role) {
  cardRole.textContent = role;
  cardName.style.color = roleColors[role];
  roleIcon.innerHTML = "";
  const icon = lucide.createElement(roleIcons[role]);
  icon.setAttribute("color", roleColors[role]);
  roleIcon.appendChild(icon);
}
nameInput.addEventListener("input", () => {
  cardName.textContent = nameInput.value || "SirKnubble";
});
roleInput.addEventListener("change", () => {
  const role = roleInput.value;
  updateRoleUI(role);
});
cardDiscordInput.addEventListener("input", () => {
  cardId.textContent = cardDiscordInput.value || "@sirknubble";
});
joinDateInput.addEventListener("input", updateDates);
leaveDateInput.addEventListener("input", updateDates);
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE");
}
function updateDates() {
  const join = joinDateInput.value
    ? formatDate(joinDateInput.value)
    : "??.??.????";
  const leave = leaveDateInput.value
    ? formatDate(leaveDateInput.value)
    : "??.??.????";
  cardDates.textContent = `${join} – ${leave}`;
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
      profileImageUrlInput.value || url("assets/icons/default.png");
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
  html2canvas(document.getElementById("card")).then((canvas) => {
    const dataURL = canvas.toDataURL("image/png");
    downloadLink.href = dataURL;
    downloadLink.style.display = "inline-block";
    downloadLink.click();
  });
});
// Initial role setup
updateRoleUI(roleInput.value);