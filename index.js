import colors from "./colors.json";

let starReminderState = 0;

function getTitle(){
  let title = document.createElement("h2");
  title.innerText = "Stars Reminder";
  title.className = "f5 text-bold mb-1";
  title.style.paddingTop = "10px";
  title.style.color = "var(--color-text-link)";
  title.style.borderTopWidth = "1px";
  title.style.borderTopStyle = "solid";
  title.style.borderColor = "var(--color-border-primary)";
  return title;
}

function getExploreText(username){
  let exploreText = document.createElement("a");
  exploreText.innerText = "Other stars → ";
  exploreText.className = "d-block Link--secondary no-underline f6 mb-3";
  exploreText.href = "https://github.com/" + username + "?tab=stars";
  return exploreText;
}

function getItem(i){
  let item = document.createElement("div");
  item.className = "py-2 my-2 border-bottom color-border-secondary";

  let itemTitle = document.createElement("a");
  itemTitle.className =
    "f6 text-bold Link--primary d-flex no-underline wb-break-all d-inline-block";
  itemTitle.innerText = i.full_name;
  itemTitle.href = i.html_url;
  item.appendChild(itemTitle);

  let description = document.createElement("p");
  description.className = "f6 color-text-secondary mb-2";
  description.innerText = i.description;
  item.appendChild(description);

  let colorSpan = document.createElement("span");
  colorSpan.className = "repo-language-color";
  colorSpan.style.backgroundColor = colors[i.language]?.color;

  let languageText = document.createElement("span");
  languageText.innerText = " " + (i.language || "-") + " ";

  let emptySpan = document.createElement("span");
  emptySpan.appendChild(colorSpan);
  emptySpan.appendChild(languageText);

  let languageParent = document.createElement("span");
  languageParent.className = "mr-2 f6 color-text-secondary text-normal";
  languageParent.appendChild(emptySpan);
  item.appendChild(languageParent);
}

function run() {
  if (starReminderState === 1) return;
  const user = [...document.getElementsByTagName("meta")].filter(
    (i) => i.name === "user-login"
  )[0].content;
  if (user === "") starReminderState = 2;

  fetch("https://api.github.com/users/" + user + "/starred?per_page=100")
    .then((res) => {
      if (res.status === 200) return res.json();
      else throw Error();
    })
    .then((json) => {
      if (starReminderState === 1 && !json) return;
      starReminderState = 1;
      const randoms = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 100)
      );

      let explore = [...document.getElementsByTagName("aside")].filter(
        (i) => i.attributes["aria-label"].nodeValue === "Explore"
      )[0];
      let title = getTitle();
      explore.appendChild(title);

      randoms.forEach((rn) => {
        let i = json[rn];
        let item = getItem(i);
        explore.appendChild(item);
      });

      let exploreText = getExploreText();
      explore.appendChild(exploreText);
    })
    .catch(() => {
      console.error("Github Star Reminder could not fetch data.");
      starReminderState = 2;
    });
}

run();

let a = setInterval(() => {
  console.log("Github reminder working...");
  run();
  // if reminder added, stop
  if (starReminderState === 1){
    clearInterval(a);
  // if an error occurs, run one last time
  }else if (starReminderState === 2) {
    setTimeout(() => {
      clearInterval(a);
    }, 5000);
  }
}, 5000);

