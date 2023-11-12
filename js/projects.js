import { getContactInfo, getBannerElement } from './utils.js'

window.onload = () => {
    loadProjects();
    loadContacts();
    loadBanner();
}

async function loadBanner() {
    getBannerElement().then(html => { document.querySelector("#banner").innerHTML = html} );
}

async function loadProjects() {
    //load ktane projects
    // await fetch("./jsons/ktane-projects-info.json")
    //     .then((res) => {
    //         return res.json();
    //     })
    //     .then((data) => {
    //         const jsonData = data['Projects'];

    //         let html = "";
    //         for (let i = 0; i < jsonData.length; i++) {
    //             const divClass = i % 2 == 0 ? "flex" : "flex-reverse";
    //             const project = jsonData[i];
    //             html += createProjectLayout(project, divClass, 3, false);
    //         }

    //         document.querySelector("#ktane").innerHTML += html;
    //     });

    //load other projects
    await fetch("./jsons/projects.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const jsonData = data['Projects'];

            let html = "";
            for (let i = 0; i < jsonData.length; i++) {
                const divClass = i % 2 == 0 ? "flex" : "flex-reverse";
                const project = jsonData[i];
                html += createProjectLayout(project, divClass, 2, 4, true);
            }

            document.querySelector("#projects").innerHTML += `<div class="project">${html}</div>`;
        });

    function createProjectLayout(projectData, flexClass, titleHeaderNum, dateHeaderNum, haveHR) {
        console.log(projectData);
        let html = "";
        if (haveHR)
            html += "<hr>";
        const titleHeaderElement = `h${titleHeaderNum}`;
        const dateHeaderElement = `h${dateHeaderNum}`;

        html += `<${titleHeaderElement}>${projectData['Title']}</${titleHeaderElement}>`;
        html += `<${dateHeaderElement}>${projectData['Date']}</${dateHeaderElement}>`
        const wordSpan = `<span>` + getLanguages(projectData) + getTools(projectData) + getDescription(projectData) + getLinks(projectData) + `</span>`;
       
        
        html += `<div class="${flexClass}"> ${wordSpan}`;

        const image = projectData['Image'];

        const src = image['src']
        const alt = image['alt'];

        if (!src || !alt)
            html += `<img src="img/WIP.png" alt="This is a work in progress">`;

        else
            html += `<img src="${src}" alt="${alt}">`;

        html += "</div>";
        return html;
    }

    function getTools (projectData) {
        return `<p id="tools"><b>Tools:</b> ${projectData['Tools'].join(", ")}</p>`
    }

    function getLanguages(projectData) {
        return `<p id="languages"><b>Languages/Libraries:</b> ${projectData['Languages'].join(", ")}</p>`
    }

    function getDescription(projectData) {
        return `${projectData['Description'].map(d => `<p>${d}</p>`).join("")}`;
    }

    function getLinks(projectData) {
        const arr = projectData['Links'].map(link => { return `<a href="${link['Link']}" target="_blank">${link['Name']}</a>` });
        return arr.join(" | ");
    }


}

async function loadContacts() {
    getContactInfo().
        then(data =>
            document.querySelector("#contactLinks").innerHTML = data);
}