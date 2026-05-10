const express = require("express");
const dotenv = require("dotenv");
const Chat = require("./src/hooks/agent");

const { engine } = require("express-handlebars");

const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());


// HANDLEBARS
app.engine("handlebars", engine({
  extname: ".handlebars",
  defaultLayout: false,
}));

app.set("view engine", "handlebars");

app.set("views", path.join(__dirname, "views"));


// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));


// PORT
const port = process.env.PORT || 3030;


// TESTE IA



// ROUTES
app.get("/chat", (req, res) => {

  res.render("home");

});

app.post("/system/chat", async (req, res) => {
  const { message } = req.body;
    if (message && message.trim() != "") {
      const messageAgent = await Chat(message);
      return res.json({
        success: true,
        messageAgent: messageAgent,
      })
    }
    else
    {
      return res.json({
        success: false,
        message: "Erro no formato! "
      })
    }
})


app.get("/", (req, res) => {

  res.redirect("/chat");

});


// SERVER
app.listen(port, () => {

  console.log(`
> -------------------------
> Sistema inicializado!
> http://127.0.0.1:${port}/
> -------------------------
> Chat bot -> /chat
> -------------------------
  `);

});