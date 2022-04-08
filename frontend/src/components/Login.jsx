import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import services from "../services";

function Login() {
  const [textInput, setTextInput] = useState({
    username: "",
    password: "",
  });
  let history = useHistory();
  let [loginNotation, setLoginNotation] = useState(
    "Please login to visit more!"
  );

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleTextInputChange = ({ target: { name, value } }) => {
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** @type {React.FormEventHandler<HTMLFormElement>} */
  const handleFormSubmit = (event) => {
    event.preventDefault();
    services.auth
      .login({
        username: textInput.username,
        password: textInput.password,
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Success login") {
          console.log("Success login and redirect");
          history.push("./");
          history.go(0);
        } else {
          console.log(res.data);
          setLoginNotation(res.data);
        }
      });
    setTextInput((prev) => ({ ...prev, username: "", password: "" }));
  };

  useEffect(() => {
    services.auth.loginCheck().then((res) => {
      if (res.data.loggedIn === true) {
        history.push("/");
      }
    });
  }, [history]);

  return (
    <div className="px-6">
      <form onSubmit={handleFormSubmit} className="mt-8 max-w-md">
        <div>{loginNotation}</div>
        <div className="grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-gray-700">username</span>
            <input
              className="mt-1 block w-full"
              type="text"
              name="username"
              value={textInput.username}
              onChange={handleTextInputChange}
            />
          </label>
          <label className="block">
            <span className="text-gray-700">password</span>
            <input
              className="mt-1 block w-full"
              type="text"
              name="password"
              value={textInput.password}
              onChange={handleTextInputChange}
            />
          </label>
          <input
            className="mt-1 block w-full bg-transparent hover:bg-blue-50 focus:bg-blue-500 text-blue-700 font-semibold focus:text-white py-2 px-4 border border-blue-500 rounded"
            type="submit"
            value="Submit"
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
