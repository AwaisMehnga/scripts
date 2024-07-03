import { GoogleGenerativeAI } from "@google/generative-ai";



// use the res from analytics.js and creating a function to suggest titles, description and tags, creating these elements and appending them to the datacontainer element

async function aiResponse() {
    const dataContainer = document.getElementById('Aires');

    console.log("running...")

    let titles, descriptions, tags;
    titles = descriptions = tags = '';

    for (let i = 0; i < res.length; i++) {

        titles += ", " + res[i].tit;
        descriptions += ", " + res[i].des;
    }
    const API_KEY = localStorage.getItem("apikey");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Act as a social media manager. You have to manage my youtube channel. Add this in place of channel name [channel name]. This is the list of title of my competitor videos: [${titles}]. I want you to analyze these title and generate five video ideas (each is descriptive) related to the niche and generate 5 titles for each idea, each title should have different nature like curiosity, clickbate, catchy, long, short. I want you to return only a single js object (no further details) containing all video ideas as key and titles and there nature should also be a object as the value of each key. The response should look like: {idea1:{title1:nature, title2:nature...},idea2:{...}...} (note: don't enclose object in any qoutes or backticks) `;
    try {
        const loader = document.getElementById('loader');

        const result = await model.generateContent(prompt);
        const obj = await result.response.text();

        loader.style.display = 'none';
        const jsonobj = JSON.parse(obj);
        console.log(jsonobj);
        // creating tables for each category
        Object.keys(jsonobj).forEach(category => {
            dataContainer.appendChild(createCategorySection(category, jsonobj[category]));
        });

    } catch (error) {

    }

}
function createTable(titles) {
    console.log(titles);
    const table = document.createElement("table");
    const header = table.insertRow();

    // Create header row
    const headers = ["Nature", "Title"];
    headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        header.appendChild(th);
    });

    // Populate rows
    const types = ["clickbait", "catchy", "curiosity", "long", "short"];
    types.forEach(type => {
        const row = table.insertRow();
        const cell1 = row.insertCell();
        cell1.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        const cell2 = row.insertCell();
        cell2.textContent = getTitleByType(titles, type);
    });

    return table;
}

function getTitleByType(titles, type) {

    return Object.keys(titles).find(title => titles[title] === type) || "";
}

function createCategorySection(category, titles) {

    const section = document.createElement("div");
    section.className = "generatedTitleCategory";

    const heading = document.createElement("h3");
    heading.textContent = category;
    heading.style.fontWeight = "bold";

    section.appendChild(heading);
    section.appendChild(createTable(titles));

    return section;
}

window.aiResponse = aiResponse;