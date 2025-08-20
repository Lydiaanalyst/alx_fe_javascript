

document.addEventListener('DOMContentLoaded', function () {
  // File existence check
  if (typeof window === 'undefined' || !document) {
    console.error('Browser environment or DOM not detected.');
    return;
  };
});

// Element references
document.addEventListener('DOMContentLoaded', function () {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const categoryFilter = document.getElementById('categoryFilter');
  const importFile = document.getElementById('importFile');
  const exportQuotesBtn = document.getElementById('exportQuotes');


// Mock API URL
  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

  // Load or initialize quotes
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "Start where you are.", category: "Motivation" },
    { text: "Be yourself; everyone else is already taken.", category: "Humor" }
  ];

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Fetch quotes from server (mock)
  async function fetchQuotesFromServer() {
    try {
      const res = await fetch(SERVER_URL);
      return await res.json();
    } catch (err) {
      console.error('Error fetching from server:', err);
      return null;
    }
  }

  // Post local data to server (mock)
  async function postQuotesToServer() {
    try {
      await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotes),
      });
    } catch (err) {
      console.error('Error posting to server:', err);
    }
  }

  // Sync logic
  async function syncQuotes() {
    const serverData = await fetchQuotesFromServer();
    if (!serverData) {
      alert('Failed to sync with server.');
      return;
    }

    // Conflict resolution — server takes precedence
    const serializedLocal = JSON.stringify(quotes);
    const serializedServer = JSON.stringify(serverData);

    if (serializedServer !== serializedLocal) {
      quotes = Array.isArray(serverData) ? serverData : quotes;
      saveQuotes();
      alert('Local data updated from server.');
      populateCategories();
      filterQuotes();
    }
  }

  // Periodic syncing every 60 seconds
  setInterval(syncQuotes, 60000);

  // Manual sync via button
  syncNowBtn.addEventListener('click', syncQuotes);



//   // ✅ Load quotes from localStorage or initialize default
//   let quotes = JSON.parse(localStorage.getItem('quotes')) || [
//     { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
//     { text: "You miss 100% of the shots you don't take.", category: "Motivation" }
//   ];

  // ✅ Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
   
  // Populate dropdown with unique categories
  function populateCategories() {
    const savedFilter = localStorage.getItem('selectedCategory') || 'all';
    const categories = [...new Set(quotes.map(q => q.category))];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      if (cat === savedFilter) option.selected = true;
      categoryFilter.appendChild(option);
    });
  }


  // Filter and display quote by category
  function filterQuotes() {
    const selected = categoryFilter.value;
    localStorage.setItem('selectedCategory', selected);

    const filtered = selected === 'all'
      ? quotes
      : quotes.filter(q => q.category === selected);

    if (filtered.length === 0) {
      quoteDisplay.innerHTML = '<p>No quotes in this category.</p>';
      return;
    };
  }



  // ✅ Show a random quote and save it to sessionStorage
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;

    // ✅ Save last shown quote in sessionStorage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }

  // ✅ Load last viewed quote from sessionStorage
  function loadLastViewedQuote() {
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      quoteDisplay.innerHTML = `
        <p><strong>Last Viewed Quote:</strong> ${quote.text}</p>
        <p><strong>Category:</strong> ${quote.category}</p>
      `;
    } else {
      showRandomQuote();
    }
  }

  // ✅ Add a new quote
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === '' || category === '') {
      alert('Please enter both quote and category.');
      return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes(); // Save updated list
    populateCategories();
    filterQuotes();



    quoteDisplay.innerHTML = `
      <p><strong>New Quote Added:</strong> ${newQuote.text}</p>
      <p><strong>Category:</strong> ${newQuote.category}</p>
    `;

    newQuoteText.value = '';
    newQuoteCategory.value = '';
  }

  // ✅ Export quotes to a downloadable JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ✅ Import quotes from uploaded JSON file
  importFile.addEventListener('change', function (event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          populateCategories();
          filterQuotes();
          alert('Quotes imported successfully!');
          showRandomQuote();
        } else {
          alert('Invalid file format.');
        }
      } catch (err) {
        alert('Error reading JSON file.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  });

  // ✅ Event Listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);
  exportQuotesBtn.addEventListener('click', exportToJsonFile);


  // ✅ Load last viewed quote or show a random one
  loadLastViewedQuote();

  // Initial load
  populateCategories();
  filterQuotes();

//   async function
async function syncWithServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    if (serverQuotes && Array.isArray(serverQuotes)) {
      // Simulate server sync - take 1 quote from the server
      quotes = quotes.concat(serverQuotes.slice(0, 1).map(post => ({
        text: post.title,
        category: 'Server'
      })));
      saveQuotes();
      showNotification('Quotes synced with server!', 'info'); // ✅ Updated message
    }
  } catch (error) {
    showNotification('Failed to sync with server.', 'error');
  }
}


syncWithServer();


});
