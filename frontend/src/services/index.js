import axios from "axios";

const services = {};
const API_HOST = process.env.NODE_ENV === "production" ? "https://r10525069-padns-midterm.herokuapp.com" : "http://localhost:3001";

const instance = axios.create({
  baseURL: `${API_HOST}/api`,
  withCredentials: true,
  xsrfCookieName: "X-XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

const checkSession = () => {
  console.log("checkSession")
  return instance
    .get("/csrf")
    .then(({ data, headers }) => {
      const token = headers["x-xsrf-token"];
      instance.defaults.headers.common["X-XSRF-Token"] = token;
      const firstTime = (data && data.firstTime) || false;
      if (firstTime) {
        // check whether the cookie is really set
        return instance.get("/csrf").then(({ data, headers }) => {
          console.log(headers)
          const token = headers["x-xsrf-token"];
          instance.defaults.headers.common["X-XSRF-Token"] = token;
          const firstTime = (data && data.firstTime) || false;
          if (firstTime) {
            // Not set, maybe due to third party cookie policy
            return false;
          } else {
            // set successfully
            return true;
          }
        });
      } else {
        // the session cookie is ok
        return true;
      }
    })
    .then((isSessionSet) => {
      if (!isSessionSet) {
        window.location.href = `${API_HOST}/api/csrf-redirect`;
      }
    })
    .catch((error) => {
      // maybe connection error
      console.error(error);
    });
}


/** @param {import("axios").AxiosInstance} instance */
const makeAuth = (instance, API_HOST) => ({
  getCsrf() {
    return instance.get(`/csrf`);
  },
  login(payload) {
    return instance.post(`/login`, payload);
  },
  loginCheck() {
    return instance.get(`/logincheck`);
  },
  logout() {
    return instance.get(`/logout`);
  },
});

/** @param {import("axios").AxiosInstance} instance */
const makeUser = (instance) => ({
  getAll() {
    return checkSession().then(() => {
      return instance.get("/users");
    });
  },
  get(username) {
    return checkSession().then(() => {
      return instance.get(`/users/${username}`)
    });
  },
  post(payload) {
    return instance.post(`/users`, payload);
  },
  getPicture(filename) {
    return checkSession().then(() => {
      return instance.post(`/picture/${filename}`);
    });
  },
});

/** @param {import("axios").AxiosInstance} instance */
const makeComment = (instance) => ({
  getAll() {
    return checkSession().then(() => {
      return instance.get(`/comments`);
    });
  },
  get(commentid) {
    return checkSession().then(() => {
      return instance.get(`/comments/${commentid}`);
    });
  },
  post(payload) {
    return instance.post(`/Comments`, payload);
  },
  del(payload) {
    return checkSession().then(() => {
      return instance.delete(`/Comments`, payload);
    });
  },
});


services.auth = makeAuth(instance);
services.user = makeUser(instance);
services.comment = makeComment(instance);

export default services;