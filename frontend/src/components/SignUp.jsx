import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import services from "../services";

function SignUp() {
  const [textInput, setTextInput] = useState({
    username: "",
    password: "",
  });
  let [signUpNotation, setSignUpNotation] = useState("Welcome !");
  let history = useHistory();
  const fileref = useRef(null);
  const [file, setFile] = useState();

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleTextInputChange = ({ target: { name, value } }) => {
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  /** @type {React.FormEventHandler<HTMLFormElement>} */
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const fd = new FormData();
    fd.append("username", textInput.username);
    fd.append("password", textInput.password);
    fd.append("file", file);
    console.log(file);
    console.log(Array.from(fd));
    services.user.post(fd).then((res) => {
      if (res.data === "User added") {
        console.log("User added");
        history.push("./");
        history.go();
      } else {
        setSignUpNotation(res.data);
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
      <div>{signUpNotation}</div>
      <form onSubmit={handleFormSubmit} className="mt-8 max-w-md">
        <div className="grid grid-cols-1 gap-6">
          <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
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
          <label className="block">
            <span className="text-gray-700">File</span>
            <input
              type="file"
              id="file"
              ref={fileref}
              onChange={handleFileChange}
              required
            ></input>
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

export default SignUp;
