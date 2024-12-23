USE mydb;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR (100),
);

CREATE TABLE shelters (
    shelter_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR (100),
);

CREATE TABLE animals (
    animal_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    description VARCHAR(100),
    shelter_id INT NOT NULL,
    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id)
);

CREATE TABLE follows_animals (
    follower_id INT NOT NULL,
    animal_id INT NOT NULL,
    PRIMARY KEY (follower_id, animal_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id),
    FOREIGN KEY (animal_id) REFERENCES animals(animal_id)
);

CREATE TABLE follows_shelters (
    follower_id INT NOT NULL,
    shelter_id INT NOT NULL,
    PRIMARY KEY (follower_id, shelter_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id),
    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id)
);


CREATE TABLE adoptions (
    adoption_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    animal_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (animal_id) REFERENCES animals(animal_id)
);

CREATE TABLE adoption_step (
    step_id INT AUTO_INCREMENT PRIMARY KEY,
    adoption_id INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    FOREIGN KEY (adoption_id) REFERENCES adoptions(adoption_id),
);

CREATE TABLE calendar_entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

CREATE TABLE user_notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

CREATE TABLE shelter_notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES shelters(shelter_id)
);

-- Insert dummy data into users
INSERT INTO users (name, second_name) VALUES
('John', 'Doe'),
('Jane', 'Smith'),
('Alice', 'Johnson'),
('Bob', 'Brown'),
('Charlie', 'Davis');

-- Insert dummy data into calendar_entries
INSERT INTO calendar_entries (owner_id, date, type) VALUES
(1, '2024-12-25', 'Holiday'),
(2, '2024-12-22', 'Meeting'),
(3, '2024-12-23', 'Reminder'),
(4, '2024-12-20', 'Event'),
(5, '2024-12-31', 'New Year Party');
