const searchInputEl = document.getElementById("searchInput");
const searchButtonEl = document.getElementById("searchBtn");

searchButtonEl.addEventListener("click", redirect);

function redirect() {
  const username = searchInputEl.value?.replace(" ", "-");

  const url = `/github-taskk/index.html?user=${username}`;

  window.location.href = url;
}
