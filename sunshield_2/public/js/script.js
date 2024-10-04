function toggleMenu() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        overlay.style.display = 'block';
    } else {
        overlay.style.display = 'none';
    }
}



function updateAdvice() {
    var boxLevel = document.getElementById('box-level-d1').textContent;
    var adviceText = 'Loading';

    if (boxLevel == 'NA') {
        adviceText = 'Loading ';
    } else if (boxLevel == 'Low') {
        adviceText = 'No limit, but wear sunglasses on bright days';

    } else if (boxLevel == 'Moderate') {
        adviceText = 'Up to 2 hours, with sunscreen and protective clothing';

    } else if (boxLevel == 'High') {
        adviceText = 'Up to 1 hour, avoid midday sun, use high SPF sunscreen';

    } else if (boxLevel == 'Very High') {
        adviceText = 'Up to 30 minutes, avoid midday sun, seek shade';

    } else if (boxLevel == 'Extreme') {
        adviceText = 'Avoid outdoor activities, if necessary, stay in the shade with full protection';

    } else {
        adviceText = 'UV level data not available';
    }

    document.getElementById('advice-1').querySelector('p').textContent = adviceText;
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
            updateAdvice();
        }
    });
});

var config = { characterData: true, childList: true, subtree: true };

observer.observe(document.getElementById('box-level-d1'), config);


updateAdvice();