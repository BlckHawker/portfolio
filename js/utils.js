let contactData;
let bannerData;
let aboutMeData;

async function getContactInfo() {
    await loadContactInfo();

    let html = "";
    for (let i = 0; i < contactData['Contacts'].length; i++) {
        const contact = contactData['Contacts'][i];
        html += `<a href="${contact['Link']}" target="_blank"><i class="${contact['Icon']}"></i> ${contact['Name']}</a>`
    }
    return html;
}

async function getBannerElement() {
    await loadBannerInfo();

    let html = "";
    for (let i = 0; i < bannerData['Buttons'].length; i++) {
        const banner = bannerData['Buttons'][i];

        if (banner['Dropdown'].length == 0) {
            html += `<button onclick="redirect('${banner['Link']}')">${banner['Name']}</button>`
        }
        else {
            html += `<button class="dropdown" onclick="toggleDropDown()">${banner['Name']}<div class="dropdown-content">`
            for (let i = 0; i < banner['Dropdown'].length; i++) {
                const link = banner['Dropdown'][i];
                html += `<a href="${link['Link']}">${link['Name']}</a>`;
            }
            html += `</div></button>`;
        }
    }
    return html;
}

async function getAboutMeInfo() {
    await loadAboutMeInfo();
    return aboutMeData;
}

async function changeTitle() {
    await loadAboutMeInfo();
    document.querySelector('title').textContent = `${aboutMeData['FirstName']} Bentley`;
}

async function loadContactInfo() {
    await fetch("./jsons/contact-info.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            contactData = { Name: data['Name'], Contacts: data['Contacts'] };
        });
}

async function loadBannerInfo() {
    await fetch("./jsons/banner.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            bannerData = data;
        });
}

async function loadAboutMeInfo() {
    await fetch("./jsons/about-me.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            aboutMeData = data;
        });
}

function highlightBanner(banner) {
    banner.onmouseover = (banner) => {
        const child = banner.target.querySelector("a");

        if (child) {
            child.style.backgroundColor = "#fff";
            child.style.color = "#393939";
            banner.target.style.backgroundColor = "#fff";
            banner.target.style.color = "#393939";
        }

    };

    banner.onmouseout = (banner) => {
        const child = banner.target.querySelector("a");

        if (child) {
            child.style.backgroundColor = "#393939";
            child.style.color = "white";
            banner.target.style.backgroundColor = "#393939";
            banner.target.style.color = "white";
        }
    };
}
export { getContactInfo, getBannerElement, getAboutMeInfo, highlightBanner, changeTitle };