import utils from "../utils.js";
let projects = []; //projects objects
let validProjects = []; //projects that match the filter
let filters = []; //filter objects
let filterCheckboxes = []; //all filter checkbox element

window.onload = () => {
  loadProjects();
  loadContacts();
  loadBanner();
  utils.changeTitle();
  const popUp = document.querySelector("#myPopup");
  document.querySelector("#settings-button").onclick = () => {
    popUp.classList.add("show");
  };
  document.querySelector("#close-button").onclick = () => {
    popUp.classList.remove("show");
  };
};

class Project {
  constructor({ hasHR, title, startDate, endDate, tools, libraries, languages, links, image, description }) {
    this.hasHR = hasHR;
    this.title = title;
    this.startDate = new Date(`${startDate.split(" ")[0]} 1, ${startDate.split(" ")[1]} 00:00:00`);
    this.endDate = new Date(`${endDate.split(" ")[0]} 1, ${endDate.split(" ")[1]} 00:00:00`);
    this.tools = tools;
    this.libraries = libraries;
    this.languages = languages;
    this.links = links;
    this.image = image;
    this.description = description;
  }

  getProjectTimeFrame() {
    const startDate = this.getDate(this.startDate);
    const endDate = this.getDate(this.endDate);

    if (startDate === endDate) return startDate;
    return `${startDate} - ${endDate}`;
  }

  getDate(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  }

  getToolLibrariesLanguages() {
    return `<p class="tools"><b>Languages/Libraries/Tools:</b> ${this.languages.concat(this.libraries).concat(this.tools).join(", ")}</p>`;
  }

  getDescription() {
    return `${this.description.replaceAll("{root}", utils.getProjectRoot())
      .split("\n")
      .map((d) => `<p>${d}</p>`)
      .join("")}`;
  }
  getLinks() {
    const arr = this.links.map((link) => {
      return `<a href="${link["Link"]}" target="_blank">${link["Name"]}</a>`;
    });
    return `<div class="project-links"><span>${arr.join(" | ")}</span></div>`;
  }

  getImage() {
    const src = this.image["src"];
    const alt = this.image["alt"];

    const srcPrefix = '../';

    if (!src || !alt) return `<img src="${srcPrefix}img/WIP.png" alt="This is a work in progress">`;
    return `<img src="${srcPrefix + src}" alt="${alt}">`;
  }
}

async function loadBanner() {
  await utils.getBannerElement().then((html) => {
    document.querySelector("#banner").innerHTML = html;
  });
}

async function loadProjects() {
  await fetch(`${utils.getProjectRoot()}/jsons/projects/projects.json`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      projects = data["Projects"].map(
        (p) =>
          new Project({
            hasHR: true,
            title: p["Title"],
            startDate: p["Start Date"],
            endDate: p["End Date"],
            tools: p["Tools"],
            libraries: p["Libraries"],
            languages: p["Languages"],
            image: p["Image"],
            description: p["Description"],
            links: p["Links"],
          })
      );
      getFilters("tools");
      getFilters("libraries");
      getFilters("languages");
      updateToggleAllButton("tools");
      updateToggleAllButton("libraries");
      updateToggleAllButton("languages");

      localStorage.setItem("filters", JSON.stringify(filters));
      getFilteredProjects();
      document.querySelector("#restore-filter-button").onclick = () => {
        filters.forEach((filter) => {
          filter.checked = true;
        });
        filterCheckboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
        getFilteredProjects();
        localStorage.setItem("filters", JSON.stringify(filters));
        updateToggleAllButton("tools");
        updateToggleAllButton("libraries");
        updateToggleAllButton("languages");
      };
    });
}

function createProjectLayout(project, flexClass) {
  let html = "";
  if (project.hasHR) html += "<hr>";
  const wordSpan = `<span><h2 id="${project.title.replaceAll(" ", "-")}">${project.title}</h2><h4>${project.getProjectTimeFrame()}</h4>${project.getToolLibrariesLanguages()}${project.getDescription()}${project.getLinks()}</span>`;
  html += `<div class="${flexClass}"> ${wordSpan}${project.getImage()}</div>`;
  return html;
}

function getFilters(filterType) {
  let localStorageFilters = JSON.parse(localStorage.getItem("filters") || "[]").filter((filter) => filter.type === filterType);
  let targetedFilters = [];
  
  //get all of the languages/tools/libraries use 
  const filterNames = projects.flatMap((project) => {
    switch (filterType) {
      case "tools":
        return project.tools;
      case "languages":
        return project.languages;
      case "libraries":
        return project.libraries;
    }
  })

  const filterCount = [];

  //count the amount of times a language/tool/library appears
  for(const name of filterNames) {
    const foundObj = filterCount.find(obj => obj.name == name);
    if(foundObj === undefined) {
      filterCount.push({name, count: 1});
    }

    else {
      filterCount[filterCount.indexOf(foundObj)].count++;
    }
  }


  //if there are no saved filters in local storage, enable all the filters
  if (localStorageFilters.length == 0) {
    targetedFilters = filterCount.map((obj) => {
      return { name: obj.name, count: obj.count, checked: true, type: filterType };
    });
  } else {
    //check if new filters have been added, if they have, set them to true
    targetedFilters = filterCount.map((obj) => {
      for (const tool of localStorageFilters) {
        if (tool.name == name) {
          return { name: obj.name, count: obj.count, checked: tool.checked, type: filterType };
        }
      }
      return { name: obj.name, count: obj.count, checked: true, type: filterType };
    });
  }

  const element = document.querySelector(`#${filterType}-filter`);
  const legend = document.createElement("legend");
  legend.innerHTML = filterType.charAt(0).toUpperCase() + filterType.slice(1);
  element.appendChild(legend);
  const toggleAllButton = document.createElement("button");
  toggleAllButton.id = `${filterType}-toggle-all-button`;
  toggleAllButton.innerHTML = "Enable All";
  element.appendChild(toggleAllButton);
  targetedFilters.forEach((filter) => {
    const div = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.onclick = checkboxClick;
    checkbox.type = "checkbox";
    checkbox.name = filter.name;
    checkbox.value = filter.name;
    checkbox.dataset["type"] = filterType;
    checkbox.id = filter.name;
    checkbox.checked = filter.checked;
    const label = document.createElement("label");
    label.htmlFor = filter.name;
    label.appendChild(document.createTextNode(`${filter.name} (${filter.count})`));
    div.appendChild(checkbox);
    div.appendChild(label);
    element.appendChild(div);
    filterCheckboxes.push(checkbox);
  });

  toggleAllButton.onclick = () => {
    const targetedCheckboxes = filterCheckboxes.filter((cb) => filterNames.includes(cb.name));
    if (toggleAllButton.innerHTML == "Enable All") {
      toggleAllButton.innerHTML = "Disable All";
      targetedCheckboxes.forEach((cb) => (cb.checked = true));
      targetedFilters.forEach((filter) => {
        filter.checked = true;
      });
    } else {
      toggleAllButton.innerHTML = "Enable All";
      targetedCheckboxes.forEach((cb) => (cb.checked = false));
      targetedFilters.forEach((filter) => {
        filter.checked = false;
      });
    }
    getFilteredProjects();
    localStorage.setItem("filters", JSON.stringify(filters));
  };
  filters = filters.concat(targetedFilters);
}

function getFilteredProjects() {
  validProjects = [];
  for (const project of projects) {
    for (const filter of filters) {
      if (!filter.checked) continue;
      let applicableProject = false;
      switch (filter.type) {
        case "tools":
          applicableProject = project.tools.includes(filter.name);
          break;
        case "languages":
          applicableProject = project.languages.includes(filter.name);
          break;
        case "libraries":
          applicableProject = project.libraries.includes(filter.name);
          break;
      }
      if (applicableProject) {
        validProjects.push(project);
        break;
      }
    }
  }

  document.querySelector("#results").innerHTML = `Showing ${validProjects.length} out of ${projects.length} projects`;
  const html = validProjects.map((p, ix) => createProjectLayout(p, ix % 2 == 0 ? "flex" : "flex-reverse"));
  document.querySelector("#projects").innerHTML = `<div class="project">${html.join("")}</div>`;
}

function checkboxClick(e) {
  filters.find((filter) => filter.name === e.target.name).checked = e.target.checked;
  localStorage.setItem("filters", JSON.stringify(filters));
  getFilteredProjects();
  updateToggleAllButton(e.target.dataset["type"]);
}

function updateToggleAllButton(filterType) {
  const targetedCheckboxes = filterCheckboxes.filter((cb) => cb.dataset["type"] === filterType);
  const toggleAllButton = document.querySelector(`#${filterType}-toggle-all-button`);
  console.log(toggleAllButton);
  if (targetedCheckboxes.every((cb) => cb.checked === targetedCheckboxes[0].checked)) {
    if (targetedCheckboxes[0].checked) {
      toggleAllButton.innerHTML = "Disable All";
    } else {
      toggleAllButton.innerHTML = "Enable All";
    }
  }
}

function removeDuplicates(arr) {
  return arr.filter((value, ix) => arr.indexOf(value) === ix && value);
}

async function loadContacts() {
  utils.getContactInfo().then((data) => (document.querySelector("#contactLinks").innerHTML = data));
}
