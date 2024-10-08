document.addEventListener('DOMContentLoaded', function() {
    function hideAllTips() {
        var allTips = document.querySelectorAll('.tip-sunsceen, .tip-clothes, .tip-sunhat, .tip-tree, .tip-sunglasses');
        allTips.forEach(function(tip) {
            tip.style.display = 'none';
        });
    }

    function showTip(tipId) {
        hideAllTips();
        var selectedTip = document.getElementById(tipId);
        if (selectedTip) {
            selectedTip.style.display = 'block';
        }
    }

    var buttonMappings = {
        'clothes-button': 'tip-clothes',
        'sunscreen-button': 'tip-sunsceen',
        'shade-button': 'tip-tree',
        'hat-button': 'tip-sunhat',
        'sunglasses-button': 'tip-sunglasses'
    };

    Object.keys(buttonMappings).forEach(function(buttonId) {
        var button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                showTip(buttonMappings[buttonId]);
            });
        }
    });

    hideAllTips();
    showTip('tip-clothes');
});