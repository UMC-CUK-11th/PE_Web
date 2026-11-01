const example = new URLSearchParams(location.search).get("example");
const output = document.querySelector("#result")!;
async function run() {
  if (example === "status") {
    await import("./promise-status");
    output.textContent = "Console에서 1 → 2 → 3 순서의 출력을 확인하세요.";
  } else if (example === "syntax") {
    await import("./promise-syntax");
    output.textContent = "Console에서 두 방식 모두 인셉션을 출력하는지 확인하세요.";
  } else if (example === "fetch") {
    output.textContent = "인기 영화 요청 중...";
    try {
      const { getMoviesWithFetch } = await import("../api/movies/get-movies-with-fetch");
      const response = await getMoviesWithFetch();
      console.log(response.results);
      output.textContent = JSON.stringify(response, null, 2);
    } catch (error) {
      output.textContent = error instanceof Error ? error.message : "요청 실패";
    }
  }
}
void run();
