// Front-end behavior for {{PROJECT_NAME}}
const button = document.getElementById("hello");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  const response = await fetch("/api/hello");
  const data = await response.json();
  result.textContent = data.message;
});
