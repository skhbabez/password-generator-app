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

const chars = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "‘~!@#$%^&*()-_=+[]{}|;:‘“,<>/?.",
};

const calculateStrength = (length, conditions) => {
  const characterRange = conditions.reduce(
    (acc, cur) => acc + chars[cur].length,
    0
  );
  const entropy = length * Math.log2(characterRange);
  console.log(entropy);

  if (entropy < 36) {
    return 0;
  }
  if (entropy < 60) {
    return 1;
  }
  if (entropy < 120) {
    return 2;
  }
  return 3;
};

const generatePassword = (length = 1, conditions = []) => {
  if (conditions.length === 0 || length < 1) {
    return "";
  }
  const selectedChars = conditions.reduce((acc, cur) => acc + chars[cur], "");
  console.log(selectedChars);
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
  const strengthValues = ["too weak!", "weak", "medium", "strong"];
  strengthBars.dataset.strength = strength;
  strengthLabel.textContent = strengthValues[strength];
};

const updatePasswordDisplay = (password) => {
  passwordDisplay.textContent = password;
};

const updateCopyLabel = (active = false) => {
  copyLabel.classList.toggle("active", active);
};

function updateSliderProgress(event) {
  // https://stackoverflow.com/questions/18389224/how-to-style-html5-range-input-to-have-different-color-before-and-after-slider
  const slider = event.currentTarget;
  const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  this.style.background =
    "linear-gradient(to right, #a4ffaf 0%, #a4ffaf " +
    value +
    "%, #18171f " +
    value +
    "%, #18171f 100%)";
}

const handleFormChange = (event) => {
  const { length, conditions } = extractValues(event.currentTarget);
  console.log(conditions);
  updateLengthIndicator(length);
  const strength = calculateStrength(length, conditions);
  updateStrengthDisplay(strength);
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const { length, conditions } = extractValues(event.currentTarget);
  const password = generatePassword(length, conditions);
  updatePasswordDisplay(password);
  updateCopyLabel(false);
};

const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
  updateCopyLabel(true);
};

const handleCopyClick = () => {
  const password = passwordDisplay.textContent;
  copyToClipboard(password);
};

form.addEventListener("change", handleFormChange);
form.addEventListener("submit", handleFormSubmit);
copyButton.addEventListener("click", handleCopyClick);
slider.addEventListener("input", updateSliderProgress);
