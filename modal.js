function showDesc(i) {
    var modal = document.getElementById("myModal");
    var modalBody = document.getElementById("modalBody");

    let p = document.createElement("p");
    p.innerHTML = res[i].des;
    document.getElementById('modalcontentcopy').value = res[i].des;
    modalBody.appendChild(p);
    modal.style.display = "block";
}

function showTags(i) {
    var modal = document.getElementById("myModal");
    var modalBody = document.getElementById("modalBody");

    if (res[i].tg != undefined) {
        res[i].tg.forEach(keyword => {
            const span = document.createElement('span');
            span.textContent = keyword;
            span.className = 'keyword';
            modalBody.appendChild(span);

            // Add click event listener for selection
            span.addEventListener('click', () => {
                span.classList.toggle('selected');
                updateSelectedKeywords();
            });

        });
    }
    else {
        let p = document.createElement("p");
        p.innerHTML = "No tags available";
        modalBody.appendChild(p);
    }
    modal.style.display = "block";
}

// Function to update selected keywords
function updateSelectedKeywords() {
    const selectedElements = modalBody.querySelectorAll('.selected');
    const selectedKeywords = Array.from(selectedElements).map(span => span.textContent).join(', ');
    document.getElementById('modalcontentcopy').value = selectedKeywords
}

// Function to close modal
function closeModal() {
    var modal = document.getElementById("myModal");
    var modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = "";
    modal.style.display = "none";
}

function copyModal() {
    var modalBody = document.getElementById("modalBody");

    // Check if the element exists
    if (modalBody) {
        const tempTextarea = document.getElementById('modalcontentcopy')

        tempTextarea.select();
        tempTextarea.setSelectionRange(0, tempTextarea.value.length);

        document.execCommand("copy");
        alert("Content copied to clipboard!");
    } else {
        console.error('Element with ID "modalBody" not found.');
    }
}

// download
function downloadThumbnail(i) {
    console.log(res[i]);
    var url = res[i].imgURL;
    window.open(url, '_blank');
}



