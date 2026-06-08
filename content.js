// api injection

let currentUrl = window.location.href;

setInterval(() => {
    if(window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        removeIndicator();
    }

    if(isProfilePage(currentUrl)) {
        const username = getUsernameFromUrl(currentUrl);

        (async() => {
            const userId = await getUserId(username);
            const followsBack = await checkFollowBack(userId);

            if(!followsBack) {
                injectIndicator();
            }
        }) ();
    }

}, 1000);

function isProfilePage(url) {
    return /instagram\.com\/([a-zA-Z0-9_.]+)\/?$/.test(url);
}

function getUsernameFromUrl(url) {
    const match = url.match(/instagram\.com\/([a-zA-Z0-9_.]+)\/?$/);
    if(match) {
        return match[1];
    }
    else {
        return null;
    }
}

async function getUserId(username) {
    const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
        headers: { 'x-ig-app-id': '936619743392459' }
    });
    // stores data in json
    const data = await res.json();

    // returns user id from data
    return data.data.user.id;
}

async function checkFollowBack(targetId) {
    const res = await fetch(`https://www.instagram.com/api/v1/friendships/show/${targetId}/`, {
        headers: { 'x-ig-app-id': '936619743392459' }
    });
    const data = await res.json();
    return data.followed_by; // true or false;
}

function injectIndicator() {
    // guard since setinterval runs every sec
    if(document.getElementById('ig-indicator')) return; // already injected

    const h2 = document.querySelector('h2');
    if(!h2) return; // element not loaded yet

    const row = h2.parentElement; // row with the 3 dots on browser

    const span = document.createElement('span');
    span.id = 'ig-indicator';
    span.textContent = ' (does not follow you back)';

    row.appendChild(span);
}

function removeIndicator() {
    const existing = document.getElementById('ig-indicator');
    if(existing) existing.remove();
}