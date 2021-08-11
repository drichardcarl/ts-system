import { useState } from "react";
import CommonTable from "./CommonTable";
import axios from "axios";
import { APP_API, showAxiosError } from "../utils";

export default function Query(props) {
  const [data, setData] = useState({});
  const [emails, setEmails] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const loadStudents = async function (event) {
    if (event) event.preventDefault()
    try {
      const extra = emails
        .map((em) => `tutor=${encodeURIComponent(em)}`)
        .join("&");
      const url = `${APP_API}/getcommonstudents?${extra}`;
      const response = await axios.get(url);
      setData({ ...response.data, emails });
      setSubmitted(true);
    } catch (e) {
      showAxiosError(e);
    }
  };

  const onChange = async function (event) {
    if (!event.target.value) {
      setData({});
      setSubmitted(false);
    }
    setEmails(
      event.target.value
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
    );
  };

  return (
    <div>
      <form onSubmit={loadStudents}>
        <input
          className="form-control"
          type="text"
          name="emails"
          onChange={onChange}
          placeholder="Query students using tutor emails (comma separated)"
        />
      </form>
      {submitted ? (
        <div className="mt-3">
          {data?.emails?.length > 1 ? (
            <p>
              Common students of tutor(s): <b>{data?.emails?.join(", ")}</b>
            </p>
          ) : (
            <p>
              Students of tutor: <b>{data?.emails[0]}</b>
            </p>
          )}
          <CommonTable data={data.students} afterTrClick={loadStudents} />
        </div>
      ) : (
        ". . ."
      )}
    </div>
  );
}
