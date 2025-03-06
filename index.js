// Global variables
let myLinks = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("dlt-btn");
const tabBtn = document.getElementById("tab-btn");

// Load saved links from localStorage on startup
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"));
if (leadsFromLocalStorage) {
    myLinks = leadsFromLocalStorage;
    renderLinks(myLinks);
}

// Event Listeners
inputBtn.addEventListener("click", () => {
    const inputValue = inputEl.value.trim();
    saveLink(inputValue);
});
tabBtn.addEventListener("click", saveCurrentTab);
deleteBtn.addEventListener("click", deleteAllLinks);
ulEl.addEventListener("click", handleListClick);

// Functions
function saveLink(link) {
    if (!link) {
        alert("Please enter a valid URL or text.");
        return;
    }

    // Prepend "https://" if the link doesn't start with "http://" or "https://"
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
        link = "https://" + link;
    }

    myLinks.push(link);
    inputEl.value = ""; // Clear input field
    localStorage.setItem("myLinks", JSON.stringify(myLinks));
    renderLinks(myLinks);
}

function saveCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabUrl = tabs[0].url;
        if (!myLinks.includes(tabUrl)) {
            myLinks.push(tabUrl);
            localStorage.setItem("myLinks", JSON.stringify(myLinks));
            renderLinks(myLinks);
        }
    });
}

function renderLinks(links) {
    let listItems = "";
    for (let i = 0; i < links.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${links[i]}'>
                    ${links[i]}
                </a>
                <button class="copy-link" data-url="${links[i]}">Copy</button>
                <button class="delete-link" data-index="${i}">Delete</button>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}

function deleteAllLinks() {
    const isConfirmed = confirm("Are you sure you want to delete all links?");
    if (isConfirmed) {
        localStorage.clear();
        myLinks = [];
        renderLinks(myLinks);
    }
}

function handleListClick(event) {
    if (event.target.classList.contains("delete-link")) {
        const index = event.target.getAttribute("data-index");
        deleteLink(index);
    } else if (event.target.classList.contains("copy-link")) {
        const url = event.target.getAttribute("data-url");
        copyLink(url);
    }
}

function deleteLink(index) {
    myLinks.splice(index, 1);
    localStorage.setItem("myLinks", JSON.stringify(myLinks));
    renderLinks(myLinks);
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard!");
    });
}

function isValidUrl(url) {
    try {
        new URL(url.startsWith("http") ? url : `https://${url}`);
        return true;
    } catch (err) {
        return false;
    }
}