USE mydb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(100),
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
    shelter_id INT NOT NULL UNIQUE,    -- powiązanie z `users(id)`
    name VARCHAR(255),
    city VARCHAR(255),
    street VARCHAR(255),
    building VARCHAR(255),
    postal_code VARCHAR(255),
    description VARCHAR(255),
    phone_number VARCHAR(20),
    FOREIGN KEY (shelter_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    birth_date DATE,
    date_joined DATE NOT NULL,  
    description VARCHAR(100),
    type ENUM('dog', 'cat'),
    breed VARCHAR(100),
    shelter_id INT,
    FOREIGN KEY (shelter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    owner_type ENUM('user', 'shelter', 'animal'),
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
    shelter_id INT NOT NULL, -- Teraz odnosi się do `shelter_profiles.id`
    PRIMARY KEY (follower_id, shelter_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shelter_id) REFERENCES shelter_profiles(id) ON DELETE CASCADE
);


CREATE TABLE adoptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,               
    animal_id INT NOT NULL,             
    shelter_id INT NOT NULL,            
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
    FOREIGN KEY (shelter_id) REFERENCES shelter_profiles(id) ON DELETE CASCADE
);


CREATE TABLE adoption_step (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adoption_id INT NOT NULL,            
    description VARCHAR(100) NOT NULL,  
    status ENUM('in_progress', 'completed', 'failed') DEFAULT 'in_progress', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    completed_at TIMESTAMP NULL,        
    FOREIGN KEY (adoption_id) REFERENCES adoptions(id) ON DELETE CASCADE
);


CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL, -- ID użytkownika lub schroniska, które otrzymuje powiadomienie
    date DATETIME NOT NULL, -- Dokładny czas utworzenia powiadomienia
    type ENUM(
        'new_walk',           -- Spacer zaplanowany
        'walk_cancelled',     -- Spacer anulowany
        'adoption_request',   -- Nowy wniosek adopcyjny
        'adoption_cancelled', -- Wniosek adopcyjny anulowany
        'daily_reminder',     -- Przypomnienie o spacerze
        'adoption_status',    -- Status wniosku adopcyjnego zmieniony (zaakceptowany/odrzucony/usunięty)
        'general'             -- Ogólne powiadomienie
    ),
    status TINYINT(1) NOT NULL DEFAULT 0, -- 0 = nieprzeczytane, 1 = przeczytane
    description TEXT, -- Szczegóły powiadomienia
    target_id INT, -- ID powiązanej akcji (np. spaceru lub adopcji)
    owner_type ENUM('user', 'shelter'), -- Czy powiadomienie dotyczy użytkownika czy schroniska
    FOREIGN KEY (owner_id) REFERENCES users(id)
);


CREATE TABLE walks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time_slot INT NOT NULL,
    status ENUM('scheduled', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- VIEWS

-- dane zwierząt plus url zdjęcia
CREATE VIEW animal_profiles_view AS
SELECT a.id AS animal_id, a.name, a.birth_date, a.date_joined, a.description, a.type, a.breed, a.shelter_id, i.img_url
FROM animals a
LEFT JOIN images i ON a.id = i.owner_id;

-- dane schroniska plus email
CREATE VIEW shelter_profiles_view AS
SELECT u.email, s.name, s.city, s.street, s.postal_code, s.building, s.description, s.phone_number
FROM shelter_profiles s
LEFT JOIN users u ON s.shelter_id = u.id;

-- profile obserwowanych zwierząt danego użytkownika
CREATE VIEW animal_profiles_follows_view AS
SELECT a.id AS animal_id, a.name, a.birth_date, a.date_joined, a.description, a.type, a.breed, a.shelter_id, i.img_url, fa.follower_id
FROM animals a
LEFT JOIN images i ON a.id = i.owner_id
RIGHT JOIN follows_animals fa ON fa.animal_id = a.id;

-- spacery w danym schronisku
CREATE VIEW shelter_walks_view AS
SELECT w.animal_id, a.shelter_id, w.user_id, w.date, w.time_slot, w.status
FROM walks w
LEFT JOIN animals a ON w.animal_id = a.id;

-- INSERT DATA

INSERT INTO users (email, password_hash, role)
VALUES
    ('kontakt@napaluchu.waw.pl', 'test', 'shelter'),
    ('korabiewice@viva.org.pl', 'test', 'shelter'),
    ('kontakt@celestynow.org.pl', 'test', 'shelter');

INSERT INTO shelter_profiles (shelter_id, name, city, street, building, postal_code, description, phone_number)
VALUES
    (1, 'Schronisko Na Paluchu', 'Warszawa', 'Paluch', '2', '02-147', 'Największe schronisko dla bezdomnych zwierząt w Warszawie', '228681579'),
    (2, 'Schronisko w Korabiewicach', 'Puszcza Mariańska', 'Korabiewice', '11', '96-330', 'Schronisko prowadzone przez Fundację Viva', '725850950'),
    (3, 'Schronisko w Celestynowie', 'Celestynów', 'Prosta', '3', '05-430', 'Schronisko dla bezdomnych zwierząt', '227897061');


INSERT INTO animals (name, birth_date, date_joined, description, type, breed, shelter_id)
VALUES
    ('Bella', '2020-01-01', '2023-01-01', 'A playful and energetic dog who loves to run and fetch.', 'dog', 'Golden Retriever', 1),
    ('Max', '2018-05-15', '2023-01-02', 'A calm and friendly golden retriever, perfect for a family.', 'dog', 'Golden Retriever', 1),
    ('Milo', '2021-03-20', '2023-01-03', 'A curious and affectionate cat who enjoys cuddles and exploring.', 'cat', 'Siberian', 1),
    ('Luna', '2022-07-10', '2023-01-04', 'A sweet and shy kitten, still getting used to her new surroundings.', 'cat', 'Domestic Short Hair', 1),
    ('Rocky', '2019-11-25', '2023-01-05', 'A loyal and protective German shepherd, great for security.', 'dog', 'German Shepherd', 1),
    ('Daisy', '2016-04-03', '2023-01-06', 'A gentle and elderly dog, loves short walks and relaxing.', 'dog', 'Beagle', 1),
    ('Simba', '2020-08-30', '2023-01-07', 'A playful and mischievous cat with a lot of energy.', 'cat', 'Bengal', 1),
    ('Chloe', '2021-01-14', '2023-01-08', 'A friendly and sociable cat who loves meeting new people.', 'cat', 'Persian', 1),
    ('Buddy', '2015-12-19', '2023-01-09', 'A very calm and laid-back dog who enjoys lounging around.', 'dog', 'Labrador Retriever', 1),
    ('Shadow', '2018-10-10', '2023-01-10', 'An independent and mysterious cat, mostly keeps to herself.', 'cat', 'Russian Blue', 1),
    ('Charlie', '2020-02-15', '2023-01-11', 'A curious and adventurous beagle who loves sniffing around.', 'dog', 'Beagle', 2),
    ('Oscar', '2019-06-01', '2023-01-12', 'A friendly and active Labrador retriever who loves swimming.', 'dog', 'Labrador Retriever', 2),
    ('Nala', '2021-11-05', '2023-01-13', 'A playful and sociable cat who enjoys climbing and chasing toys.', 'cat', 'Maine Coon', 2),
    ('Lily', '2022-03-22', '2023-01-14', 'A quiet and gentle kitten, loves napping in sunny spots.', 'cat', 'Domestic Long Hair', 2),
    ('Zoe', '2017-08-09', '2023-01-15', 'A calm and affectionate dog who enjoys being around people.', 'dog', 'Cocker Spaniel', 3),
    ('Cooper', '2016-12-20', '2023-01-16', 'A loyal and energetic border collie, perfect for an active owner.', 'dog', 'Border Collie', 3),
    ('Oliver', '2020-05-30', '2023-01-17', 'An independent cat with a love for bird-watching and sunbathing.', 'cat', 'British Shorthair', 2),
    ('Maggie', '2019-03-15', '2023-01-18', 'A sweet and gentle dog, loves short walks and cuddles.', 'dog', 'Shih Tzu', 3),
    ('Loki', '2021-07-19', '2023-01-19', 'A mischievous and energetic cat, always up for an adventure.', 'cat', 'Abyssinian', 2),
    ('Bailey', '2018-01-12', '2023-01-20', 'A calm and elderly dog who enjoys relaxing by the fireplace.', 'dog', 'Bernese Mountain Dog', 3);


INSERT INTO images (owner_id, owner_type, img_url)
VALUES
    (1, 'animal', 'https://res.cloudinary.com/dnwj6jjqh/image/upload/v1735754846/mufy3qsutuvqvn1cedhn.png'),
    (2, 'animal', 'https://res.cloudinary.com/dnwj6jjqh/image/upload/v1735755578/srouxqxnrs32zdt07wa8.jpg'),
    (3, 'animal', 'https://res.cloudinary.com/dnwj6jjqh/image/upload/v1735756076/axjm2bxc05awmx6dcuzq.jpg'),
    (4, 'animal', 'https://res.cloudinary.com/dnwj6jjqh/image/upload/v1735756097/t0uvbvrwhdjtoqszrmcq.jpg');
