"use strict";
const generator = document.getElementById("password-generator");
const form = generator.querySelector("form");
const lengthIndicator = document.getElementById("char-length-indicator");
const strengthIndicator = document.getElementById("strength-indicator");
const strengthLabel = strengthIndicator.querySelector("p");
const strengthBars = strengthIndicator.querySelector("[data-strength]");
const chars = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "‘~!@#$%^&*()-_=+[]{}|;:‘“,<>/?.",
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
};

form.addEventListener("change", handleFormChange);
form.addEventListener("submit", handleFormSubmit);
