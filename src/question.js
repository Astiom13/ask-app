export class Question {
  static create(question) {
    return fetch(
      "https://ask-question-f0277-default-rtdb.firebaseio.com/question.json",
      {
        method: "POST",
        body: JSON.stringify(question),
        headers: {
          "content-type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorege)
      .then(Question.renderList);
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">You dont have token</p> ');
    }
    return fetch(
      `https://ask-question-f0277-default-rtdb.firebaseio.com/question.json?auth=${token}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p> `;
        }

        return response
          ? Object.keys(response).map((key) => ({
              ...response[key],
              id: key,
            }))
          : [];
      });
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorege();

    const html = questions.length
      ? questions.map(toCard).join("")
      : `<div class="mui--text-headline">you don't have question</div>`;

    const list = document.getElementById("list");

    list.innerHTML = html;
  }

  static listToHtml(questions) {
    return questions.length
      ? `<ol>${questions
          .map((question) => `<li>${question.text}</li>`)
          .join(" ")}</ol>`
      : "<p>you dont have question</p>";
  }
}

function addToLocalStorege(question) {
  const all = getQuestionsFromLocalStorege();
  all.push(question);
  localStorage.setItem("questions", JSON.stringify(all));
}

function getQuestionsFromLocalStorege() {
  return JSON.parse(localStorage.getItem("questions") || "[]");
}

function toCard(question) {
  return `
    <div class="mui--text-black-54">By
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}
    </div>
   <div>${question.text}</div>
   <br>
    `;
}
