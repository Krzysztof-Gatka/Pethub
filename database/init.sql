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
    age INT,
    sex VARCHAR(255),
    phone_number VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE shelter_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shelter_id INT NOT NULL,
    name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    street VARCHAR(255),
    postal_code VARCHAR(255),
    building VARCHAR(255),
    description VARCHAR(255),
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

CREATE TABLE shelter_images (
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
    status TINYINT(1) NOT NULL DEFAULT 0,
    description TEXT,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE walks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time_slot INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


INSERT INTO users (email, role)
VALUES
    ('test@shelter.com', 'shelter');


INSERT INTO animals (name, age, description, shelter_id)
VALUES
    ('Bella', 3, 'A playful and energetic dog who loves to run and fetch.', 1),
    ('Max', 5, 'A calm and friendly golden retriever, perfect for a family.', 1),
    ('Milo', 2, 'A curious and affectionate cat who enjoys cuddles and exploring.', 1),
    ('Luna', 1, 'A sweet and shy kitten, still getting used to her new surroundings.', 1),
    ('Rocky', 4, 'A loyal and protective German shepherd, great for security.', 1),
    ('Daisy', 6, 'A gentle and elderly dog, loves short walks and relaxing.', 1),
    ('Simba', 3, 'A playful and mischievous cat with a lot of energy.', 1),
    ('Chloe', 2, 'A friendly and sociable cat who loves meeting new people.', 1),
    ('Buddy', 7, 'A very calm and laid-back dog who enjoys lounging around.', 1),
    ('Shadow', 5, 'An independent and mysterious cat, mostly keeps to herself.', 1);

INSERT INTO images (owner_id, img_url)
VALUES
	(1, 'https://res.cloudinary.com/dnwj6jjqh/image/upload/v1735754846/mufy3qsutuvqvn1cedhn.png'),
    (2, 'https://res.cloudinary.com/dnwj6jjqh/image/upload/v1735755578/srouxqxnrs32zdt07wa8.jpg'),
    (3, 'https://res.cloudinary.com/dnwj6jjqh/image/upload/v1735756076/axjm2bxc05awmx6dcuzq.jpg'),
    (4, 'https://res.cloudinary.com/dnwj6jjqh/image/upload/v1735756097/t0uvbvrwhdjtoqszrmcq.jpg');



