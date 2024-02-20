const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const user = urlParams.get("user");

const paginationButtonsContainer = document.getElementById(
  "paginationButtonsContainer"
);
const pageReposCount = document.getElementById("pageReposCount");
const reposContainer = document.getElementById("reposContainer");
let reposCount = 0;

let page = 1;
let per_page = 10;

if (user) {
  const url = `https://api.github.com/users/${user}`;

  const profileContainerEl = document.getElementById("profileContainer");
  const loadingEl = document.getElementById("loading");

  const generateProfile = (profile) => {
    return `
     <div class="profile-box">
     <div class="top-section">
       <div class="left">
         <div class="avatar">
           <img alt="avatar" src="${profile.avatar_url}" />
         </div>
         <div class="self">
           <h1>${profile.name}</h1>
           <h1>@${profile.login}</h1>
         </div>
       </div>
       <a href="${profile.html_url}" target="_black">
       <button class="primary-btn">Check Profile</button>
       </a>
     </div>
  
     <div class="about">
       <h2>About</h2>
       <p>
       ${profile.bio}
       </p>
     </div>
     <div class="status">
       <div class="status-item">
         <h3>Followers</h3>
         <p>${profile.followers}</p>
       </div>
       <div class="status-item">
         <h3>Followings</h3>
         <p>${profile.following}</p>
       </div>
       <div class="status-item">
         <h3>Repos</h3>
         <p>${profile.public_repos}</p>
       </div>
     </div>
   </div>
     `;
  };

  
  const fetchProfile = async () => {
    loadingEl.innerText = "loading.....";
    loadingEl.style.color = "black";

    try {
      const res = await fetch(url);

      const data = await res.json();
      if (data.message == "Not Found") {
        loadingEl.innerText = "";
        profileContainerEl.innerHTML =
          "<p style='color:red;text-align:center'>Invalid Username</p>";
      } else {
        loadingEl.innerText = "";
        profileContainerEl.innerHTML = generateProfile(data);

        // PAGINATION
        reposCount = data.public_repos;
        const perPageCount = 10;
        const pages = Math.ceil(reposCount / perPageCount);

        let paginationButtonsTemplate = "";

        for (let i = 1; i <= pages; i++) {
          paginationButtonsTemplate += `
            <button style="padding:10px;background-color:${
              page == i ? "red" : "blue"
            };color:#fff;">
              ${i}
            </button>
          `;
        }

        console.log(typeof paginationButtonsTemplate);
        paginationButtonsContainer.innerHTML = paginationButtonsTemplate;
      }

      paginationButtonsContainer.addEventListener("click", function (e) {
        if (e.target.nodeName == "BUTTON") {
          const pageNumber = e.target?.textContent?.trim();
          page = pageNumber;
          fetchRepos();
        }
      });

      pageReposCount.addEventListener("change", function (e) {
        per_page = e.target.value;
        page = 1;
        fetchRepos();
      });

      function fetchRepos() {
        const pagesCount = Math.ceil(reposCount / per_page);

        console.log({
          page,
          per_page,
          pagesCount,
        });

        let paginationButtonsTemplate = "";

        for (let i = 1; i <= pagesCount; i++) {
          paginationButtonsTemplate += `
            <button style="padding:10px;background-color:${
              page == i ? "red" : "blue"
            };color:#fff;">
              ${i}
            </button>
    `;
        }

        paginationButtonsContainer.innerHTML = paginationButtonsTemplate;

        const reposUrl = `https://api.github.com/users/${user}/repos?page=${page}&per_page=${per_page}`;

        fetch(reposUrl)
          .then((res) => res.json())
          .then((data) => {
            let reposCardsTemplate = "";

            data.forEach((repo) => {
              let topicsTemplate = "";

              if (repo.topics.length) {
                console.log(repo.topics);
                repo.topics.forEach((topic) => {
                  topicsTemplate += `
                    <span style="background-color:blue;color:#fff;">${topic}</span>
                  `;
                });
              }

              reposCardsTemplate += `
              <div >
                <div style="border:1px solid black; padding:20px;">
                  <h3>${repo.name}</h3>
                  ${repo.description ? `<p>${repo.description}</p>` : ""}
                  ${topicsTemplate ? `<div>${topicsTemplate}</div>` : ""}
                </div>
                </div>
              `;
            });

            reposContainer.innerHTML = reposCardsTemplate;
          })
          .catch((err) => console.log(err));
      }

      fetchRepos();
    } catch (error) {
      console.log({ error });
      loadingEl.innerText = "";
    }
  };

  fetchProfile();
} else {
  console.log("User parameter not found in the query string.");
}


