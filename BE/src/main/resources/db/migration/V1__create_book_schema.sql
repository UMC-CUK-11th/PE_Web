-- Apply to the database selected by DB_URL before starting the BE application.
CREATE TABLE category (
    category_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (category_id)
);

CREATE TABLE book (
    book_id BIGINT NOT NULL AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_available BIT NOT NULL,
    PRIMARY KEY (book_id),
    CONSTRAINT fk_book_category FOREIGN KEY (category_id) REFERENCES category (category_id)
);

CREATE TABLE rental (
    rental_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    rented_at DATETIME(6) NOT NULL,
    due_at DATETIME(6) NOT NULL,
    PRIMARY KEY (rental_id),
    CONSTRAINT fk_rental_book FOREIGN KEY (book_id) REFERENCES book (book_id)
);
