import cn from "classnames";
import axios from "axios";
import { APP_API } from "../utils";

export default function CommonTable(props) {
  const onTrClick = async function (event) {
    try {
      const rdata = [...event.target.parentNode.children].map(
        (e) => e.innerText
      );
      rdata[2] = rdata[2].toLowerCase().trim() === "true" ? true : false;
      const url = `${APP_API}/suspend`;
      const response = await axios.post(url, {
        student: rdata[1],
        suspend: !rdata[2],
      });
      await props.afterTrClick?.call();
    } catch (e) {
      if (e.response) {
        const err = await e.response.data;
        alert(
          `${err.error} (${err.message}): ${Object.values(
            err.details[0]
          ).join("\n")}`
        );
      } else {
        alert(e.message);
      }
    }
  }

  return (
    <div>
      {props.data ? (
        <div className="mt-3">
          <table className="table table-sm table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Email</th>
                <th scope="col">Suspended</th>
              </tr>
            </thead>
            <tbody>
              {(props.data || []).map((student) => (
                <tr
                  id={`stud-${student.id}`}
                  key={student.id}
                  onDoubleClick={onTrClick}
                  className={cn({ "bg-warning": student.suspended })}
                >
                  <th scope="row">{student.id}</th>
                  <td>{student.email}</td>
                  <td>{`${student.suspended}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ". . ."
      )}
    </div>
  );
}
