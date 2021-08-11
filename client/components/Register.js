import { useState } from "react";
import CommonTable from "./CommonTable";
import axios from "axios";
import { APP_API, showAxiosError } from "../utils";

export default function Register(props) {
  const [data, setData] = useState([]);
  const [jsonstr, setJsonStr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const defautlJson = {
    tutor: "test@email.com",
    students: [],
  };

  const registerStudents = async function (event) {
    try {
      setJsonStr(event.target.value);
      const url = `${APP_API}/register`;
      const response = await axios.post(url, JSON.parse(jsonstr || event.target.value));
      await loadStudents();
      setSubmitted(true);
    } catch (e) {
      showAxiosError(e);
    }
  };

  const loadStudents = async function () {
    try {
      const jsond = JSON.parse(jsonstr);
      const url = `${APP_API}/getcommonstudents?tutor=${jsond.tutor}`;
      const response = await axios.get(url);
      setData(response.data.students || []);
    } catch (e) {
      showAxiosError(e);
    }
  };

  const onChange = async function (event) {
    if (!event.target.value) {
      setData([]);
      setSubmitted(false);
    }
    setJsonStr(event.target.value);
  };

  const onKeyDown = async function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await registerStudents(event);
    }
  };

  return (
    <div>
      <textarea
        className="form-control"
        rows="5"
        placeholder="Enter JSON request to start (Shift+Enter for newline)"
        onKeyDown={onKeyDown}
        onChange={onChange}
        defaultValue={JSON.stringify(defautlJson, null, 2)}
      >
      </textarea>
      {submitted ? (
        <>
          <p className="mt-3">Students of the tutor:</p>
          <CommonTable data={data} afterTrClick={loadStudents} />
        </>
      ) : null}
    </div>
  );
}
