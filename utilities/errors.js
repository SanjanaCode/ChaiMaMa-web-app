class ValidationError extends Error {
    constructor(property) {
        super("Invalid " + property);
        this.name = this.constructor.name;
        this.property = property;
    }
}

class PropertyRequiredError extends Error {
    constructor(property) {
        super(`Missing property: ${property}!`);
        this.name = this.constructor.name;
        this.property = property;
    }
}

class UserNotFoundError extends Error {
    constructor(customerId) {
        super(`User ${customerId} not found!`);
        this.name = this.constructor.name;
        this.customerId = customerId;
    }
}

class ProductNotFound extends Error {
    constructor(productId) {
        super(`Product not found with Id ${productId}`);
        this.name = this.constructor.name;
        this.productId = productId;
    }
}

class NotEnoughInventory extends Error {
    constructor(productId, inventory) {
        super(`Not enough inventory for product ${productId}`);
        this.name = this.constructor.name;
        this.productId = productId;
        this.inventory = inventory;
    }
}

class OrderEmptyError extends Error {
    constructor(orderId) {
        super(`Order ${orderId}is empty`);
        this.name = this.constructor.name;
        this.orderId = orderId;
    }
}

module.exports = {
    ValidationError,
    PropertyRequiredError,
    UserNotFoundError,
    ProductNotFound,
    NotEnoughInventory,
    OrderEmptyError
};
