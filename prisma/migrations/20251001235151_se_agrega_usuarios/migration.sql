-- CreateTable
CREATE TABLE `customers` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(60) NULL,
    `last_name` VARCHAR(60) NULL,
    `email` VARCHAR(120) NULL,
    `phone` VARCHAR(20) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `employee_id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NULL,
    `first_name` VARCHAR(60) NULL,
    `last_name` VARCHAR(60) NULL,
    `email` VARCHAR(120) NULL,
    `hired_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `store_id`(`store_id`),
    PRIMARY KEY (`employee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `description` VARCHAR(255) NULL,
    `price` DECIMAL(10, 2) NULL,
    `stock_quantity` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_products_name`(`name`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotions` (
    `promo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NULL,
    `promo_type` ENUM('GENERAL', 'PRODUCT', 'QTY') NULL,
    `product_id` INTEGER NULL,
    `min_qty` INTEGER NULL,
    `discount_pct` DECIMAL(5, 2) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`promo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_details` (
    `detail_id` BIGINT NOT NULL AUTO_INCREMENT,
    `sale_id` BIGINT NULL,
    `product_id` INTEGER NULL,
    `quantity` INTEGER NULL,
    `unit_price` DECIMAL(10, 2) NULL,

    INDEX `idx_sale_details_sale`(`sale_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `sale_id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NULL,
    `customer_id` INTEGER NULL,
    `employee_id` INTEGER NULL,
    `total` DECIMAL(12, 2) NULL,
    `tax` DECIMAL(12, 2) NULL,
    `discount` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `paid` BOOLEAN NULL,
    `sale_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `customer_id`(`customer_id`),
    INDEX `employee_id`(`employee_id`),
    INDEX `idx_sales_store_date`(`store_id`, `sale_date`),
    PRIMARY KEY (`sale_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stores` (
    `store_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NULL,
    `city` VARCHAR(80) NULL,
    `state` VARCHAR(80) NULL,
    `is_active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`store_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sale_details` ADD CONSTRAINT `sale_details_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`sale_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sale_details` ADD CONSTRAINT `sale_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
