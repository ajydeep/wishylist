// Load items on page load
document.addEventListener('DOMContentLoaded', loadItems);

async function loadItems() {
    try {
        const response = await fetch('/get_items');
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error("Error loading items:", error);
    }
}

function renderItems(items) {
    const wishlist = document.getElementById('wishlist');
    wishlist.innerHTML = '';
    items.forEach(item => {
        wishlist.innerHTML += `
            <div class="wishlist-item">
                <img src="${item.image_url || 'https://via.placeholder.com/200'}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Brand: ${item.brand}</p>
                <p>Category: ${item.category}</p>
                <p>Price: ₹${item.price}</p>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Remove</button>
            </div>
        `;
    });
}

async function addItem() {
    const item = {
        name: document.getElementById('itemName').value,
        brand: document.getElementById('itemBrand').value,
        category: document.getElementById('itemCategory').value,
        price: document.getElementById('itemPrice').value,
        image_url: document.getElementById('itemImage').value
    };

    try {
        await fetch('/add_item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        loadItems();
        // Clear inputs
        document.getElementById('itemName').value = '';
        document.getElementById('itemBrand').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemImage').value = '';
    } catch (error) {
        console.error("Error adding item:", error);
    }
}

async function deleteItem(id) {
    try {
        await fetch(`/delete_item/${id}`, { method: 'DELETE' });
        loadItems();
    } catch (error) {
        console.error("Error deleting item:", error);
    }
}

async function searchItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    try {
        const response = await fetch('/get_items');
        const items = await response.json();
        const filteredItems = items.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.brand.toLowerCase().includes(searchTerm)
        );
        renderItems(filteredItems);
    } catch (error) {
        console.error("Error searching items:", error);
    }
}