let contactData;
let bannerData;

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
        html += `<a href="${banner['Link']}">${banner['Name']}</a>`
    }

    return html;
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

export { getContactInfo, getBannerElement };