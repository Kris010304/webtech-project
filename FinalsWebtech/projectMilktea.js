document.addEventListener("DOMContentLoaded", () => {
    // **Order Summary Elements**
    const orderSummary = document.querySelector(".order-summary");
    const orderItemsContainer = document.createElement("div");
    orderItemsContainer.classList.add("order-items-container");
    orderSummary.insertBefore(orderItemsContainer, orderSummary.querySelector(".total"));

    const totalElement = document.querySelector(".total");
    const confirmButton = document.querySelector(".confirm-button");
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel Order";
    cancelButton.classList.add("cancel-button");
    orderSummary.appendChild(cancelButton);

    // **Notification and Chat Elements**
    const notification = createAndAppendElement("div", document.body, { className: "notification" });
    const chatIcon = createAndAppendElement("div", document.body, { className: "chat-icon", textContent: "💬" });
    const chatBox = createAndAppendElement("div", document.body, { className: "chat-box hidden" });
    const chatHeader = createAndAppendElement("h3", chatBox, { textContent: "Order Assistant" });
    const chatMessages = createAndAppendElement("div", chatBox, { className: "chat-messages" });
    const chatInputContainer = createAndAppendElement("div", chatBox, { className: "chat-input-container" });
    const chatInput = createAndAppendElement("input", chatInputContainer, { type: "text", className: "chat-input", placeholder: "Ask me something..." });
    const sendButton = createAndAppendElement("button", chatInputContainer, { className: "send-button", textContent: "Send" });

    // **Bot Responses**
    const botResponses = {
        "hello": "Hi there! How can I assist you today?",
        "how can I place an order?": "You can add items to your order by clicking the 'Add to Cart' button for each product.",
        "what is my order total?": () => `Your current total is ${totalElement.textContent}.`,
        "cancel order": "Your order has been canceled. Let me know if you need anything else.",
        "thank you": "You're welcome! Let me know if there's anything else I can help with.",
        "default": "I'm sorry, I didn't understand that. Please try asking a different question or contact support.",
    };

    // **Order Management**
    let order = [];
    function updateOrderSummary() {
        orderItemsContainer.innerHTML = "";
        let totalPrice = 0;
        order.forEach(item => {
            const orderItem = createAndAppendElement("div", orderItemsContainer, {
                className: "order-item",
                textContent: `${item.name} - $${item.price} x${item.quantity}`
            });
            totalPrice += item.price * item.quantity;
        });
        totalElement.textContent = `Total: $${totalPrice}`;
    }

    function addToOrder(name, price) {
        const existingItem = order.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            order.push({ name, price, quantity: 1 });
        }
        updateOrderSummary();
    }

    // **Chat Functionality**
    function toggleChatBox() {
        chatBox.classList.toggle("hidden");
    }

    function addChatMessage(message, isBot = false) {
        const chatMessage = createAndAppendElement("div", chatMessages, {
            className: `chat-message ${isBot ? "bot-message" : "user-message"}`,
            textContent: message
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChatInput() {
        const userInput = chatInput.value.trim().toLowerCase();
        if (!userInput) return;

        addChatMessage(chatInput.value);

        const response = botResponses[userInput] || botResponses["default"];
        const botMessage = typeof response === "function" ? response() : response;

        setTimeout(() => addChatMessage(botMessage, true), 500);
        chatInput.value = "";
    }

    // **Event Listeners**
    sendButton.addEventListener("click", handleChatInput);
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") handleChatInput();
    });
    chatIcon.addEventListener("click", toggleChatBox);

    confirmButton.addEventListener("click", () => {
        if (order.length === 0) {
            showNotification("Your order is empty!");
            return;
        }
        const orderDetails = order.map(item => `${item.name} - $${item.price} x${item.quantity}`).join(", ");
        showNotification(`Order confirmed! Details: ${orderDetails}. Total: ${totalElement.textContent}`);
        order = [];
        updateOrderSummary();
    });

    cancelButton.addEventListener("click", () => {
        order = [];
        updateOrderSummary();
        showNotification("Your order has been canceled.");
    });

    // **Menu Management**
    const menuItems = document.querySelectorAll(".menu-item");
    const mainContent = document.querySelector(".main");
    const menuContent = getMenuContent();

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(menu => menu.classList.remove("active"));
            item.classList.add("active");
            const tab = item.getAttribute("data-tab");
            updateMenuContent(tab);
        });
    });

    function updateMenuContent(tab) {
        mainContent.innerHTML = menuContent[tab] || `<div class="section"><h3>No content available</h3></div>`;
        initializeProductButtons();
    }

    function initializeProductButtons() {
        document.querySelectorAll(".product button").forEach(button => {
            button.addEventListener("click", (event) => {
               
                const productElement = event.target.closest(".product");
                const name = productElement.querySelector("h4").textContent;
                const price = parseFloat(productElement.querySelector("p:nth-of-type(2)").textContent.slice(1));
                addToOrder(name, price);
            });
        });
    }

    updateMenuContent("special-burgers");

    // **Helper Functions**
    function createAndAppendElement(tag, parent, options = {}) {
        const element = document.createElement(tag);
        Object.assign(element, options);
        parent.appendChild(element);
        return element;
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = "block";
        setTimeout(() => notification.style.display = "none", 3000);
    }

    function getMenuContent() {
        return {
           "special-burgers": `
            <div class="section">
                <h3>Special Burgers</h3>
                <div class="product-list">
                    <div class="product">
                        <img src="burger4.jpg" alt="Double Angus & Bacon Cheeseburger">
                        <h4>Double Angus & Bacon Cheeseburger</h4>
                        <p>Best Burger in Town</p>
                        <p>₱200</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            </div>
        `,
        "burgers":`
        <h3>Burger<h3>
                <div class="product">
                    <img src=" burger1.jpg">
                    <h4>Tendercrisp Bacon Cheeseburger</h4>
                    <p>Bacon with 200g Chicken</p>
                    <p>₱150</p>
                    <button>Add to Cart</button>
                </div><div class="product">
        <img src="burger2.jpg" alt="Double Beef Burger">
        <h4>Double Beef Burger</h4>
        <p>Juicy double beef patties with cheddar</p>
        <p>₱180</p>
        <button>Add to Cart</button>
    </div>
    <div class="product">
        <img src="burger3.jpg" alt="Spicy Chicken Burger">
        <h4>Spicy Chicken Burger</h4>
        <p>Fiery chicken patty with spicy sauce</p>
        <p>₱140</p>
        <button>Add to Cart</button>
    </div>
    <div class="product">
        <img src="burger4.jpg" alt="Classic Cheeseburger">
        <h4>Classic Cheeseburger</h4>
        <p>Traditional cheeseburger with fresh veggies</p>
        <p>₱80</p>
        <button>Add to Cart</button>
    </div>
    <div class="product">
        <img src="burger5.jpg" alt="Bacon & Egg Burger">
        <h4>Bacon & Egg Burger</h4>
        <p>Crispy bacon with fried egg and BBQ sauce</p>
        <p>₱120</p>
        <button>Add to Cart</button>
    </div>` ,
                "milktea":` 
                <h3>MILKTEA</h3>
                <div class="product">
                    <img src="Free Photo _ Traditional iced milk tea and red tea powder_.jpg" alt="Winter Melon">
                    <h4>Winter Melon</h4>
                    <p>Classic Milktea</p>
                    <p>₱50</p>
                    <button>Add to Cart</button>
                </div> 
                 <div class="product">
            <img src="Premium Photo _ Taiwan milk tea with bubble.jpg" alt="Coffee Milk Tea">
            <h4>Coffee Milk Tea</h4>
            <p>Perfect Blend of Tea and Coffee</p>
            <p>₱70</p>
            <button>Add to Cart</button>
        </div>
         <div class="product">
            <img src="Premium Photo _ Taiwan milk tea with bubble (1).jpg" alt="Chocolate Milk Tea">
            <h4>Chocolate Milk Tea</h4>
            <p>Indulgent and Decadent</p>
            <p>₱60</p>
            <button>Add to Cart</button>
        </div>
         <div class="product">
            <img src="honeydew milk tea.jpg" alt="Honeydew Milk Tea">
            <h4>Honeydew Milk Tea</h4>
            <p>Sweet and Refreshing</p>
            <p>₱60</p>
            <button>Add to Cart</button>
        </div>
        <div class="product">
            <img src="Strawberry Milk Tea.jpg" alt="Strawberry Milk Tea">
            <h4>Strawberry Milk Tea</h4>
            <p>Sweet and Fruity</p>
            <p>₱60</p>
            <button>Add to Cart</button>
        </div>
         <div class="product">
         
            <img src="Matcha haven.jpg" alt="Matcha Milk Tea">
            <h4>Matcha Milk Tea</h4>
            <p>Earthy and Smooth</p>
            <p>₱60</p>
            <button>Add to Cart</button>
        </div>
        <div class="product">
            <img src="Thai Milk Tea Recipe - Instacart.jpg" alt="Thai Milk Tea">
            <h4>Thai Milk Tea</h4>
            <p>Rich and Aromatic</p>
            <p>₱70</p>
            <button>Add to Cart</button>
        </div>`
        };
    }
});
