export const showAxiosError = function (e) {
  if (e.response) {
    const err = e.response.data;
    alert(
      `${err.error} (${err.message}): ${Object.values(err.details[0]).join(
        "\n"
      )}`
    );
  } else {
    alert(e.message);
  }
}