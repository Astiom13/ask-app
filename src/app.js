import { Question } from "./question";
import { createModal, isValid } from "./utils";
import { authWithEmailAndPassword, getAuthForm } from "./auth";
import "./styles.css";

const form = document.querySelector("#form");
const modalBtn = document.querySelector("#modal-btn");
const input = form.querySelector("#question-input");
const submitBtn = form.querySelector("#submit");

window.addEventListener("load", Question.renderList);
form.addEventListener("submit", submitFormHendler);
modalBtn.addEventListener("click", openModal);
input.addEventListener("input", () => {
  submitBtn.disabled = !isValid(input.value);
});

function submitFormHendler(event) {
  event.preventDefault();

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON(),
    };
    submitBtn.desables = true;

    //Async requst to server to save question
    Question.create(question).then(() => {
      input.value = "";
      input.className = "";
      submitBtn.disabled = false;
    });
    console.log("Question", question);
  }
}

function openModal() {
  createModal("Autoraize", getAuthForm());
  document
    .getElementById("auth-form")
    .addEventListener("submit", authFormHendler, { once: true });
}

function authFormHendler(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button')
  const email = event.target.querySelector("#email").value;
  const password = event.target.querySelector("#password").value;

  btn.disabled = true

  authWithEmailAndPassword(email, password)
  .then(Question.fetch)
  .then(renderModalAfterAurh)
  .then(() => btn.disabled = false)
}

function renderModalAfterAurh(content) {
    if(typeof content === 'string') {
        createModal('Error', content)
    }else{
        createModal('ask list', Question.listToHtml(content))
    }
}
