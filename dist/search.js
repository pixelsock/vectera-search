async function executeSearch() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';  // Show loader

    const resultsContainer = document.getElementById('results-container');
    const query = document.getElementById('search-bar').value;

    let resultsListContainer = document.getElementById('search-results-list');
    const summaryContainer = document.getElementById('summary-container');
    const aiSummaryContainer = document.getElementById('ai-summary');

    // Clear existing results and summary immediately upon a new search
    if (resultsListContainer) {
        resultsListContainer.innerHTML = '';
    }
    summaryContainer.style.display = 'none';
    aiSummaryContainer.innerHTML = '';

    const searchTermElement = document.getElementById('search-term');
    searchTermElement.textContent = query;

    const includeSummary = document.getElementById('ask-ai').checked;
    summaryContainer.style.display = includeSummary ? 'block' : 'none';  // Show or hide summary container

    const maxSummarizedResults = includeSummary ? 5 : 0;

    const data = JSON.stringify({
        "query": [
            {
                "query": query,
                "start": 0,
                "numResults": 50,
                "contextConfig": {
                    "wordsBefore": 3,
                    "wordsAfter": 3,
                    "sentencesBefore": 3,
                    "sentencesAfter": 3,
                    "startTag": "<mark>",
                    "endTag": "</mark>"
                },
                "corpusKey": [
                    {
                        "customerId": 2218845319,
                        "corpusId": 2,
                        "semantics": 0,
                        "metadataFilter": "part.lang = 'eng'",
                        "lexicalInterpolationConfig": {
                            "lambda": 0.025,
                        }
                    }
                ],
                "rerankingConfig": {
                    "rerankerId": 272725717
                },
                "summary": [
                    {
                        "summarizerPromptName": "vectara-summary-ext-v1.2.0",
                        "promt": query,
                        "maxSummarizedResults": maxSummarizedResults,
                        "responseLang": "eng",
                    }
                ]
            }
        ]
    });

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'customer-id': '2218845319',
            'x-api-key': 'zwt_hEDkhypiMkvtZuxSlOkgzfaY9YZhqrX4NUAKqw'
        },
        body: data
    };

    resultsContainer.style.display = 'block';  // Display the results container once the search is executed

  

    try {
        const payload = await fetch('https://api.vectara.io/v1/query', config);
        const data = await payload.json();
        console.log(data);  // log the response data to the console
        const results = data.responseSet[0];
        console.log(results);
        const response = results.response;
        const documents = results.document;
     
        const summary = results.summary[0].text;
        const summaryElement = document.createElement('p');
        summaryElement.classList.add('summary');
        summaryElement.innerHTML = formatSummary(summary);

        // Add event listener to the summary references
        const summaryReferences = summaryElement.querySelectorAll('.summary-reference');
        summaryReferences.forEach(ref => {
            ref.addEventListener('click', handleSummaryLinkClick);
        });

        const aiSummaryContainer = document.getElementById('ai-summary');
        aiSummaryContainer.innerHTML = '';
        if (includeSummary) {
            aiSummaryContainer.appendChild(summaryElement);
        }

        let resultsListContainer = document.getElementById('search-results-list');
        if (!resultsListContainer) {
            resultsListContainer = document.createElement('div');  // Create a new div to house the search results list
            resultsListContainer.id = 'search-results-list';  // Assign an id to the new div
            resultsContainer.appendChild(resultsListContainer);  // Append the search results list container to the results container
        } else {
            resultsListContainer.innerHTML = '';  // Clear existing results if resultsListContainer already exists
        }

        resultsContainer.prepend(summaryContainer);  // Ensure summaryContainer is the first child of resultsContainer

        if (results) {
            response.forEach((result, index) => {
                const text = result.text;
                const documentIndex = result.documentIndex;
                const sourceMetadata = result.metadata.find(m => m.name === 'section_url');
                const source = sourceMetadata ? `cltudo${sourceMetadata.value}` : '';
                const pageTitle = documents[documentIndex].metadata.find(m => m.name === 'title').value;

                const resultItemContainer = document.createElement('div');
                resultItemContainer.classList.add('search-result-item');

                const searchIndex = document.createElement('div');
                searchIndex.classList.add('search-index');
                searchIndex.textContent = index + 1;
                resultItemContainer.id = `result-${index + 1}`;  // Assign a unique ID to each search result container

                const searchItemContent = document.createElement('div');
                searchItemContent.classList.add('search-item-content');

                const pageTitleElement = document.createElement('h5');
                pageTitleElement.classList.add('search-title');
                pageTitleElement.textContent = pageTitle;

                const sourceElement = document.createElement('a');
                sourceElement.classList.add('summary-reference');
                sourceElement.setAttribute('href', source);
                sourceElement.textContent = source;

                const textElement = document.createElement('p');
                textElement.classList.add('search-text');
                textElement.innerHTML = text;

                // Append elements to their respective containers
                searchItemContent.appendChild(pageTitleElement);
                searchItemContent.appendChild(sourceElement);
                searchItemContent.appendChild(textElement);

                resultItemContainer.appendChild(searchIndex);
                resultItemContainer.appendChild(searchItemContent);

                resultsListContainer.appendChild(resultItemContainer);
            });
        } else {
            const noResultsElement = document.createElement('p');
            noResultsElement.textContent = 'No results found';
            resultsListContainer.appendChild(noResultsElement);
        }
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = 'none';  // Hide loader
    }
}

window.addEventListener('load', () => {
    const askAiElement = document.getElementById('ask-ai');
    const searchInput = document.getElementById('search-bar');

    askAiElement.addEventListener('change', () => {
        // clear the search input value when switching between Ask AI and Search
        searchInput.value = '';
        searchInput.placeholder = askAiElement.checked ? 'Ask anything about the UDO...' : 'Search...';
    });
});


function handleSummaryLinkClick(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    const targetId = href.substring(1);  // Remove the '#' from the href value to get the target ID
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const resultsContainer = document.getElementById('results-container');
        const targetPosition = targetElement.offsetTop - resultsContainer.offsetTop;
        const startPosition = resultsContainer.scrollTop;
        const distance = targetPosition - startPosition;
        const duration = 500;  // Duration of the animation in milliseconds
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const ease = easeInOutQuad(progress, startPosition, distance, duration);
            resultsContainer.scrollTop = ease;
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }
}

function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

function formatSummary(summary) {
    return summary.replace(/\[(\d+)\]/g, (match, p1) => {
        return `<a href="#result-${p1}" class="summary-reference">${match}</a>`;
    });
}

// Add event listener to search form data-name="Search Form"
const searchForm = document.querySelector('[data-name="Search Form"]');
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    executeSearch();
});

window.addEventListener('load', () => {
    const askAiElement = document.getElementById('ask-ai');
    // Removed executeSearch() call to prevent search on page load
});

// Add event listener to document object to hide results container if someone clicks outside of it
document.addEventListener('click', event => {
    const resultsContainer = document.getElementById('results-container');
    const searchInput = document.getElementById('search-bar');
    if (!resultsContainer.contains(event.target) && event.target !== searchInput) {
        resultsContainer.style.display = 'none';
    }
});

// Add event listener to search bar input element to show results container if it has results
const searchInput = document.getElementById('search-bar');

searchInput.addEventListener('focus', () => {
    const resultsContainer = document.getElementById('results-container');
    if (searchInput.value) {
        resultsContainer.style.display = 'block';
    }
});
