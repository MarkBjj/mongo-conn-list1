const salesList = document.getElementById("sales-list");
const debugInfo = document.getElementById("debug-info");
const addSaleForm = document.getElementById("add-sale-form");

// Tip: If you change the port in server.js, update this constant
// Using 127.0.0.1 instead of localhost avoids DNS resolution lag in some browsers
const API_URL = "http://127.0.0.1:3000/recipes";

async function fetchSales() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    salesList.innerHTML = data
      .map(
        (recipe) => `
            <li>
              <strong>${recipe.name}</strong> (${recipe.category}) - ${recipe.descShort}
              <button onclick="deleteSale('${recipe._id}')" style="margin-left: 15px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 5px 10px;">Delete</button>
            </li>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Fetch error:", error);
    debugInfo.innerHTML = `
      <div style="border: 2px dashed #ff4444; padding: 15px; background: #fff5f5; color: #d00;">
        <strong>Frontend Error:</strong> Cannot reach the server at ${API_URL}.<br>
        <p style="margin-top:10px;"><em>The backend server might be down because of the MongoDB connection error in your terminal.</em></p>
      </div>`;
  }
}

// Handle form submission to add new sales
addSaleForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newSale = {
    item: document.getElementById("item-input").value,
    price: parseFloat(document.getElementById("price-input").value),
    quantity: parseInt(document.getElementById("qty-input").value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSale),
    });

    if (response.ok) {
      addSaleForm.reset();
      fetchSales(); // Refresh the list to show the new item
    } else {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to add sale");
    }
  } catch (error) {
    debugInfo.innerText = `Error adding sale: ${error.message}`;
  }
});

// Function to handle deleting a sale record
window.deleteSale = async (id) => {
  if (!confirm("Delete this record?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchSales(); // Refresh the list
    } else {
      throw new Error("Failed to delete the item.");
    }
  } catch (error) {
    debugInfo.innerText = `Delete Error: ${error.message}`;
  }
};

// Load data on page startup
fetchSales();
