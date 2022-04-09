import { useEffect, useState } from "react";
import services from "../services";
import { useHistory } from "react-router-dom";
const API_HOST =
  process.env.NODE_ENV === "production"
    ? "https://r10525069-padns-midterm.herokuapp.com"
    : "http://localhost:3001";

function Chat() {
  const [user, setUser] = useState(
    /** @type {{name: string, message: string}[]} */
    { username: "", status: "", picture: "" }
  );
  const [textInput, setTextInput] = useState(
    /** @type {{name: string, message: string}[]} */
    { message: "" }
  );
  const [comments, setComments] = useState([]);
  const [delAlert, setDelAlert] = useState("");
  let history = useHistory();

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleTextInputChange = ({ target: { name, value } }) => {
    // const { name, value } = event.target
    // obj = { ...prev }; obj[name] = value
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** @type {React.FormEventHandler<HTMLFormElement>} */
  const handleFormSubmit = (event) => {
    event.preventDefault();
    services.comment
      .post({
        username: user.username,
        content: textInput.message,
        picture: user.picture,
      })
      .then((res) => {
        history.go(0);
      })
      .catch((err) => {
        console.log(err);
      });
    setTextInput({ message: "" });
  };

  async function loadComments() {
    services.comment.getAll().then((res) => {
      var comments = [];
      for (var i = 0; i < res.data.length; i++) {
        comments = [...comments, res.data[i]];
      }
      setComments((precomment) => (precomment = [...comments]));
    });
  }

  async function deleteComments(username, content, id) {
    services.comment
      .del(id, {
        username: username,
        content: content,
        status: user.status,
      })
      .then((res) => {
        setDelAlert(res.data);
        if (res.data === "Comment deleted") {
          loadComments();
        }
      });
  }

  useEffect(() => {
    services.auth.loginCheck().then((res) => {
      if (res.data.loggedIn === false) {
        history.push("/");
      } else {
        setUser({
          username: res.data.username,
          picture: res.data.picture,
          status: res.data.loggedIn,
        });
      }
    });
    loadComments();
  }, []);

  return (
    <div>
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-md ">
        <div> {user.username} 你好!!</div>
        <img
          src={API_HOST + `/api/pictures/${user.picture}`}
          alt=""
          width="200"
        ></img>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group mb-6">
            <input
              type="text"
              className="
                form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
              "
              name="message"
              value={textInput.message}
              placeholder="message"
              onChange={handleTextInputChange}
            />
          </div>
          <button
            type="submit"
            className="
              px-6
              py-2.5
              bg-blue-600
              text-white
              font-medium
              text-xs
              leading-tight
              uppercase
              rounded
              shadow-md
              hover:bg-blue-700 hover:shadow-lg
              focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
              active:bg-blue-800 active:shadow-lg
              transition
              duration-150
              ease-in-out"
          >
            傳送訊息
          </button>
        </form>
      </div>
      <div
        className="grid grid-cols-1 gap-6"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {delAlert}
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Messenge
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {comment.username}
                        <img
                          src={API_HOST + `/api/pictures/${comment.picture}`}
                          alt=""
                          width="200"
                        ></img>
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {comment.content}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {comment.username === user.username ? (
                          <button
                            style={{
                              width: "120px",
                              height: "40px",
                              border: "2px",
                            }}
                            onClick={() =>
                              deleteComments(
                                comment.username,
                                comment.content,
                                comment.id
                              )
                            }
                          >
                            delete
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
