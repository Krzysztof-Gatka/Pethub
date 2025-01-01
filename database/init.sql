USE mydb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR (100),
    role ENUM('user', 'shelter')
);

CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    first_name VARCHAR(255),
    second_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE shelter_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shelter_id INT NOT NULL,
    organization_name VARCHAR(255),
    address VARCHAR(255),
    phone_number VARCHAR(20),
    FOREIGN KEY (shelter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    description VARCHAR(100),
    shelter_id INT,
    FOREIGN KEY (shelter_id) REFERENCES users(id)
);

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    img_url VARCHAR(255)
);

CREATE TABLE follows_animals (
    follower_id INT NOT NULL,
    animal_id INT NOT NULL,
    PRIMARY KEY (follower_id, animal_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (animal_id) REFERENCES animals(id)
);

CREATE TABLE follows_shelters (
    follower_id INT NOT NULL,
    shelter_id INT NOT NULL,
    PRIMARY KEY (follower_id, shelter_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (shelter_id) REFERENCES users(id)
);

CREATE TABLE adoptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    animal_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (animal_id) REFERENCES animals(id)
);

CREATE TABLE adoption_step (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adoption_id INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    FOREIGN KEY (adoption_id) REFERENCES adoptions(id)
);

CREATE TABLE calendar_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);


