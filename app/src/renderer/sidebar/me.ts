import * as dialogs from "simple-dialogs";
import * as i18n from "../../shared/i18n";
import * as settings from "../settings";

const container = document.querySelector("body > .sidebar .me");
const nameElt = container.querySelector(".name") as HTMLDivElement;
const presenceElt = container.querySelector(".presence select") as HTMLInputElement;

const nicknamePattern = /^([A-Za-z][A-Za-z0-9_-]{1,15})$/;
const nicknamePatternString = nicknamePattern.toString().slice(1, -1);

export function start() {
  nameElt.textContent = settings.nickname;
  presenceElt.value = settings.presence;
}

export function updatePresenceFromSettings() {
  presenceElt.value = settings.presence;
}

nameElt.addEventListener("click", (event) => {
  const options: dialogs.PromptOptions = {
    title: i18n.t("sidebar:setNickname.title"),
    initialValue: nameElt.textContent,
    validationLabel: i18n.t("common:actions.update"),
    pattern: nicknamePatternString,
    required: true
  };

  new dialogs.PromptDialog("Enter a new nickname", options, (newNickname) => {
    if (newNickname != null) {
      nameElt.textContent = newNickname;
      settings.setNickname(newNickname);
      settings.scheduleSave();
    }
  });
});

presenceElt.addEventListener("change", (event) => {
  settings.setPresence(presenceElt.value as any);
  settings.scheduleSave();
});
