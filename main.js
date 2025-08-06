"use strict";
const generator = document.getElementById("password-generator");
const form = generator.querySelector("form");
const lengthIndicator = document.getElementById("char-length-indicator");
const strengthIndicator = document.getElementById("strength-indicator");
const strengthLabel = strengthIndicator.querySelector("p");
const strengthBars = strengthIndicator.querySelector("[data-strength]");
const passwordDisplay = document.getElementById("gen-password-label");
const copyLabel = document.getElementById("copy-status");
const copyButton = copyLabel.querySelector("button");
const slider = generator.querySelector("input[type='range']");
const submitButton = form.querySelector("button[type='submit']");

const chars = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "‘~!@#$%^&*()-_=+[]{}|;:‘“,<>/?.",
};

const calculateStrength = (password = "") => {
  if (password < 1) {
    return 0;
  }
  const length = password.length;
  const characterRange = Object.entries(chars).reduce(
    (acc, [key, value]) =>
      acc +
      (value.split("").some((element) => password.includes(element))
        ? value.length
        : 0),

    0
  );
  const entropy = length * Math.log2(characterRange);

  if (entropy < 36) {
    return 1;
  }
  if (entropy < 60) {
    return 2;
  }
  if (entropy < 120) {
    return 3;
  }
  return 4;
};

const generatePassword = (length = 1, conditions = []) => {
  if (conditions.length === 0 || length < 1) {
    return "";
  }
  const selectedChars = conditions.reduce((acc, cur) => acc + chars[cur], "");
  let password = "";
  for (let i = 0; i < length; i++) {
    password += selectedChars.charAt(
      Math.floor(Math.random() * selectedChars.length)
    );
  }
  return password;
};

const extractValues = (form) => {
  const formData = new FormData(form);
  const length = formData.get("length");
  const conditions = formData.getAll("conditions");
  return { length, conditions };
};

const updateLengthIndicator = (length) => {
  lengthIndicator.textContent = length;
};

const updateStrengthDisplay = (strength) => {
  const strengthValues = ["", "too weak!", "weak", "medium", "strong"];
  strengthBars.dataset.strength = strength;
  strengthLabel.textContent = strengthValues[strength];
};

const updatePasswordDisplay = (password = "") => {
  passwordDisplay.classList.toggle("muted", password.length === 0);
  passwordDisplay.textContent = password || "P4$5W0rD!";
};

const updateCopyLabel = (active = false) => {
  copyLabel.classList.toggle("active", active);
};

function updateSliderProgress(sliderValue) {
  // https://stackoverflow.com/questions/18389224/how-to-style-html5-range-input-to-have-different-color-before-and-after-slider
  const value = ((sliderValue - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background =
    "linear-gradient(to right, #a4ffaf 0%, #a4ffaf " +
    value +
    "%, #18171f " +
    value +
    "%, #18171f 100%)";
}

const handleSliderInput = (event) => {
  const sliderValue = event.currentTarget.value;
  updateSliderProgress(sliderValue);
  updateLengthIndicator(sliderValue);
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const { length, conditions } = extractValues(event.currentTarget);
  const password = generatePassword(length, conditions);
  const strength = calculateStrength(password);
  updateStrengthDisplay(strength);
  updatePasswordDisplay(password);
  updateCopyLabel(false);
};

const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

const handleCopyClick = () => {
  const password = passwordDisplay.textContent;
  copyToClipboard(password).then(() => updateCopyLabel(true));
};

const init = () => {
  const length = 10;
  const conditions = [];
  const password = generatePassword(length, conditions);
  updateCopyLabel(false);
  updatePasswordDisplay(password);
  slider.value = length;
  updateLengthIndicator(length);
  updateSliderProgress(length);
  const strength = calculateStrength(password);
  const checkboxes = form.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((box) => (box.checked = conditions.includes(box.value)));
  updateStrengthDisplay(strength);
};

init();
form.addEventListener("submit", handleFormSubmit);
copyButton.addEventListener("click", handleCopyClick);
slider.addEventListener("input", handleSliderInput);
