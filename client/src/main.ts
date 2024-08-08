import axios from 'axios';
import './style.css'

const address = "http://localhost:8080/"

const messages = ["Hi! 👋 It's great to hear from you. How can I help you today? 😊"];

const chatbotBody = document.getElementById("chatbot-body");
const sendButton = document.getElementById("send-button");
const chatbotInput = document.getElementById("chatbot-input") as HTMLInputElement;
const openChat = document.getElementById("open-chat");
const chatbot = document.getElementById("chatbot");
const submitButton = document.getElementById("submit-button");
const userName = (document.getElementById("name") as HTMLInputElement);

function getCheckedRating() {
    const checkedRadio = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;
    return checkedRadio ? parseInt(checkedRadio.value) : 0;
}

let isOpen = false;

function displayMessages(messages: string[]) {
  messages.forEach(message => {
    const el = document.createElement("div");
    el.className = "message p-4 bg-[#111827] rounded-md";
    el.textContent = message;
    chatbotBody?.appendChild(el)
  })
}

displayMessages(messages);

type Speaker = "bot" | "user";

function displayMessage(message: string, color: string, speaker: Speaker) {
  const el = document.createElement("div");
  el.className = `message p-4 bg-${color} rounded-md w-fit ${speaker == "user" ? "ml-auto" : ""}`;
  el.textContent = message;
  chatbotBody?.appendChild(el)

  chatbotInput.value = ""
}

sendButton?.addEventListener("click", async () => {
  const inputText = chatbotInput?.value!
  
  if (inputText != "") {
    displayMessage(inputText, "purple-600", "user")
    const reply = await sendMessage(inputText)
    displayMessage(reply, "[#111827]", "bot")
  }
})

openChat?.addEventListener("click", () => {
  const tmp = isOpen;
  isOpen = !tmp;

  if (isOpen) {
    chatbot?.classList.add("flex")
    chatbot?.classList.remove("hidden")
  } else {
    chatbot?.classList.remove("flex")
    chatbot?.classList.add("hidden")
  }
})

console.log(userName)

submitButton?.addEventListener("click", async (e) => {
  e.preventDefault()
  console.log(userName.value, getCheckedRating())
  const name = userName.value.toString();

  if (name == "") {
    userName.classList.add("placeholder-red-500")
    return
  }

  if (getCheckedRating() == null)
    return;

  await sendRating(name, getCheckedRating());

  submitButton.classList.add("bg-green-500")
  submitButton.innerHTML = `
  <div class="flex">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
    Submitted
  </div>
    `
})

async function sendMessage(message: string) {
  let reply = "";

  await axios.get(`${address}chat?message=${message}`)
  .then((response) => {
    reply = response.data.generation
  })
  .catch((err) => console.log(err))

  return reply;
}

async function sendRating(name: string, rating: number) {
  await axios.post(`${address}api/user`, {
    name: name,
    rating: rating
  })
  .then(() => {
    console.log("User created");
  })
  .catch((err) => console.log(err))
}