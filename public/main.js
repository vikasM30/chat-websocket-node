const socket = io();

const clientsTotal = document.getElementById("clients-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const msgForm = document.getElementById("message-form");
const msgInput = document.getElementById("message-input");

const msgTone = new Audio('./notification.mp3')

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMesage();
});

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`;
});

function sendMesage() {
  if (msgInput.value == "") return;
  const data = {
    name: nameInput.value,
    msg: msgInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  msgInput.value = "";
}

socket.on("chat-message", (data) => {
    msgTone.play()
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `            
  <li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
        ${data.msg}
        <span>${data.name} 🔯 ${moment(data.dateTime).fromNow()}</span>
    </p>
</li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

msgInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `🖋️ ${nameInput.value} is typing a message`,
  });
});

msgInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `🖋️ ${nameInput.value} is typing a message`,
  });
});

msgInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("chat-feedback", (data) => {
  clearFeedback();
  const element = `
    <li class="message-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback}
    </p>
</li>`;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
