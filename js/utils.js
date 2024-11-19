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

        const dropdown = banner['Dropdown'];

        if (dropdown.length == 0) {
            html += `<button onclick="redirect('${banner['Link']}')">${banner['Name']}</button>`
        }
        else {
            html += `<button class="dropdown" onclick="toggleDropDown()">${banner['Name']}<div class="dropdown-content">`;
            for (let i = 0; i < dropdown.length; i++) {
                const link = dropdown[i];
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
    await fetch("/jsons/contact-info.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            contactData = { Name: data['Name'], Contacts: data['Contacts'] };
        });
}

async function loadBannerInfo() {
    await fetch("/jsons/banner.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            bannerData = data;
        });
}

async function loadAboutMeInfo() {
    await fetch("/jsons/about-me.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            aboutMeData = data;
        });
}

export { getContactInfo, getBannerElement, getAboutMeInfo, changeTitle };