const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatContainer = document.getElementById("chatContainer");

function createMessage(text, sender = "bot") {

  const message = document.createElement("div");

  message.classList.add("message");
  message.classList.add(sender);


  const bubble = document.createElement("div");

  bubble.classList.add("bubble");

  bubble.innerHTML = `
    <p>${text}</p>
  `;

  message.appendChild(bubble);

  chatContainer.appendChild(message);

  scrollBottom();

}


function createTyping() {

  const typing = document.createElement("div");

  typing.classList.add("message", "bot");

  typing.id = "typing";

  typing.innerHTML = `
    <div class="bubble">
      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;

  chatContainer.appendChild(typing);

  scrollBottom();

}


function removeTyping() {

  const typing = document.getElementById("typing");

  if (typing) {
    typing.remove();
  }

}


function scrollBottom() {

  chatContainer.scrollTop = chatContainer.scrollHeight;

}


async function getBotResponse(userMessage) {
  try {
    const data = await fetch('/system/chat', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  message: userMessage })
    })
    
    const res = await data.json();
    
    if(res)
    {
      return res.messageAgent;
    }
    else
    {
      return "Erro no servidor! "
    }
  }
    catch(err)
    {
      console.log("Erro ao enviar! ",err.message);
      return err.message;
    }

}


chatForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const text = messageInput.value.trim();

  if (!text) return;


  createMessage(text, "user");

  messageInput.value = "";


  createTyping();


  try {

    const response = await getBotResponse(text);

    removeTyping();
    
    createMessage(response, "bot");

  } catch (error) {

    removeTyping();

    createMessage("Servidor indisponível! ", "bot");

    console.error(error);

  }

});


const quickButtons = document.querySelectorAll(".quick-btn");

quickButtons.forEach((button) => {

  button.addEventListener("click", async () => {

    const text = button.innerText;
    
    createMessage(text, "user");

    createTyping();
    
    let res = await getBotResponse(text);
    
    removeTyping();
    
    createMessage(res, "bot");

  });

});
