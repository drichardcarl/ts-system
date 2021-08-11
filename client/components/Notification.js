import { useState } from "react";
import CommonTable from "./CommonTable";
import axios from "axios";
import { APP_API, showAxiosError } from "../utils";

export default function Notification(props) {
  const [data, setData] = useState([]);
  const [jsonstr, setJsonStr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const defautlJson = {
    tutor: "test@email.com",
    notification: "",
  };

  const loadRecipients = async function (event) {
    try {
      if (event) setJsonStr(event.target.value);
      const url = `${APP_API}/retrievenotifications`;
      const response = await axios.post(
        url,
        JSON.parse(jsonstr || event.target.value)
      );
      setData(response.data.recipients || []);
      setSubmitted(true);
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
      await loadRecipients(event);
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
      ></textarea>
      {submitted ? (
        <>
          <p className="mt-3">Students who will receive the notification:</p>
          <CommonTable data={data} afterTrClick={loadRecipients} />
        </>
      ) : null}
    </div>
  );
}
