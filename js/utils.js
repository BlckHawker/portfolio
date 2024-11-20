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
            html += `<button onclick="redirect('${banner['Link'].replaceAll("{root}", getProjectRoot())}')">${banner['Name']}</button>`
        }
        else {
            html += `<button class="dropdown" onclick="toggleDropDown()">${banner['Name']}<div class="dropdown-content">`;
            for (let i = 0; i < dropdown.length; i++) {
                const link = dropdown[i];
                html += `<a href="${link['Link'].replaceAll("{root}", getProjectRoot())}">${link['Name']}</a>`;
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
    document.querySelector('title').textContent = `${aboutMeData['FirstName']} Jackson-Bentley`;
}

async function loadContactInfo() {
    const link = `${getProjectRoot()}/jsons/contact-info.json`;
    const data = await fetchJson(link);
    contactData = { Name: data['Name'], Contacts: data['Contacts'] };
}

async function loadBannerInfo() {
    const link = `${getProjectRoot()}/jsons/banner.json`;
    const data = await fetchJson(link);
    bannerData = data;
}

async function loadAboutMeInfo() {
    const link = `${getProjectRoot()}/jsons/about-me.json`;
    const data = await fetchJson(link);
    aboutMeData = data;
}

async function fetchJson(url) {
    const res = await fetch(url);
    return res.json();
}

function getProjectRoot()
{
    const differentHosts = [
        {name: 'blckhawker.github.io', href: '/portfolio'}
    ]
    const host = differentHosts.find(h => h.name == window.location.hostname);
    if(host) {
        return host.href;
    }
    return '';
}



export default { getContactInfo, getBannerElement, getAboutMeInfo, changeTitle, getProjectRoot };