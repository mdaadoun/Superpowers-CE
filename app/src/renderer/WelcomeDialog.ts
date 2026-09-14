import * as dialogs from "simple-dialogs";
import * as i18n from "../shared/i18n";

const nicknamePattern = /^([A-Za-z][A-Za-z0-9_-]{1,15})$/;
const nicknamePatternString = nicknamePattern.toString().slice(1, -1);

type WelcomeResult = {
  nickname: string;
};

export default class WelcomeDialog extends dialogs.BaseDialog<WelcomeResult> {
  nicknameField: HTMLInputElement;

  constructor(callback: (result: WelcomeResult) => void) {
    super(callback);

    const header = document.createElement("header");
    header.textContent = i18n.t("welcome:title");
    this.formElt.appendChild(header);

    const promptElt = document.createElement("div");
    promptElt.className = "group";
    promptElt.textContent = i18n.t("welcome:prompt");
    this.formElt.appendChild(promptElt);

    // Nickname
    const nicknameGroup = document.createElement("div");
    nicknameGroup.className = "group";
    nicknameGroup.style.display = "flex";
    this.formElt.appendChild(nicknameGroup);

    this.nicknameField = document.createElement("input");
    this.nicknameField.id = "nickname-field";
    this.nicknameField.type = "text";
    this.nicknameField.placeholder = i18n.t("welcome:nickname");
    this.nicknameField.required = true;
    this.nicknameField.maxLength = 16;
    this.nicknameField.pattern = nicknamePatternString;
    nicknameGroup.appendChild(this.nicknameField);
    this.nicknameField.style.flex = "1 1 0";

    // Buttons
    const buttonsElt = document.createElement("div");
    buttonsElt.className = "buttons";
    this.formElt.appendChild(buttonsElt);

    const validateButton = document.createElement("button");
    validateButton.type = "submit";
    validateButton.textContent = i18n.t("common:actions.next");
    buttonsElt.appendChild(validateButton);

    this.nicknameField.focus();
  }

  submit() {
    super.submit({
      nickname: this.nicknameField.value
    });
  }
}
