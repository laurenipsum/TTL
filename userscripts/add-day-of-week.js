<script type="text/javascript">
function addDayOfWeekToDates() {
        const datePattern = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g;
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        while (walker.nextNode()) {
            if (walker.currentNode.nodeValue.match(datePattern)) {
                textNodes.push(walker.currentNode);
            }
        }

        textNodes.forEach(node => {
            node.nodeValue = node.nodeValue.replace(datePattern, (match) => {
                const date = new Date(match);
                const dayName = dayNames[date.getDay()];
                return `${dayName} ${match}`;
            });
        });
    }

    setTimeout(addDayOfWeekToDates, 1000); // Wait 1 second
</script>
