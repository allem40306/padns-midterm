const express = require("express");
const path = require("path");
// const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const csrf = require("csurf");
// const { User } = require("./models");
const { api } = require("./routes");

const port = process.env.PORT || 3001;
const API_DEV = {
  scheme: "http",
  host: "localhost",
  hostPort: "localhost:3000", // proxy
};
const API_PROD = {
  scheme: "https",
  host: "r10525069-padns-midterm.herokuapp.com",
  hostPort: "r10525069-padns-midterm.herokuapp.com",
};
const WEB_DEV = {
  scheme: "http",
  host: "localhost",
  hostPort: "localhost:3000",
  path: "/",
};
const WEB_PROD = {
  scheme: "https",
  host: "r10525069-padns-midterm.herokuapp.com",
  hostPort: "r10525069-padns-midterm.herokuapp.com",
  path: "/demo/",
};
const API = process.env.NODE_ENV === "production" ? API_PROD : API_DEV;
const WEB = process.env.NODE_ENV === "production" ? WEB_PROD : WEB_DEV;
const app = express();
const csrfProtection = csrf();

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend/build")));

// https://stackoverflow.com/questions/28839728/must-the-access-control-allow-origin-header-include-scheme
// https://stackoverflow.com/questions/14003332/access-control-allow-origin-wildcard-subdomains-ports-and-protocols
app.use(
  cors({
    origin: `${WEB.scheme}://${WEB.hostPort}`, // must contain scheme
    credentials: true,
    // Access-Control-Expose-Headers is required for js fetch to read the header when CORS
    exposedHeaders: "X-XSRF-Token",
    // allowedHeaders: "X-XSRF-Token",
  })
);

app.set("trust proxy", 1);
app.use(
  session({
    cookie: {
      domain: API.host,
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 1000,
      // sameSite: "none",
    },
    secret: process.env.SESSION_SECRET, // change to random string
    name: "sessionId", // don't omit this option
    resave: false,
    saveUninitialized: false,
  })
);

app.use(csrfProtection);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.get("/api/csrf", (req, res) => {
  console.log("req: ", req);
  // The common pattern is to send csrt token in HTTP response Set-Cookie
  // and then send it with X-XSRF-Token in HTTP request header
  // Since we separate the api and web server, we can't set cookie for web server
  // res.cookie("XSRF-TOKEN", req.csrfToken(), {
  //   domain: "",
  //   path: "/",
  //   httpOnly: false,
  //   sameSite: true,
  // });
  // https://stackoverflow.com/questions/43344819/reading-response-headers-with-fetch-api

  // console.log("backend: csrf");

  const firstTime = typeof req.session.view !== "number";
  if (typeof req.session.view === "number") {
    req.session.view++;
  } else {
    req.session.view = 0;
  }
  res.cookie("X-XSRF-TOKEN", req.csrfToken());
  // if (firstTime) {
  //   res.json({ status: "again" });
  // } else {
  //   res.status(204).send();
  // }
  res.status(200).json({ firstTime });
});

app.get("/api/csrf-redirect", (req, res) => {
  console.log(req.protocol);
  console.log(req.headers);
  res.redirect(`${WEB.scheme}://${WEB.hostPort}${WEB.path}#/login`);
});

app.use("/api", api);

// app.get("/visit", (req, res) => {
//   console.log(req.session);
//   if (typeof req.session.view === "number") {
//     req.session.view++;
//   } else {
//     req.session.view = 0;
//   }
//   res.send(`<h1>Visit: ${req.session.view}</h1>`);
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
