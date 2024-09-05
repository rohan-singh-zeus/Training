CREATE TABLE `employee` (
  `email` VARCHAR(225) NOT NULL PRIMARY KEY,
  `name` VARCHAR(45),
  `country` VARCHAR(45),
  `state` VARCHAR(45),
  `city` VARCHAR(45),
  `telephone` VARCHAR(255),
  `address_line_1` VARCHAR(255),
  `address_line_2` VARCHAR(255),
  `dob` VARCHAR(225),
  `fy2019-20` VARCHAR(255),
  `fy2020-21` VARCHAR(255),
  `fy2021-22` VARCHAR(255),
  `fy2022-23` VARCHAR(255),
  `fy2023-24` VARCHAR(255)
);

CREATE TABLE `todo`(
    `id` INT NOT NULL PRIMARY KEY,
    `name` VARCHAR(225),
    `isComplete` BOOLEAN
);

CREATE TABLE `emp2`(
    `id` INT NOT NULL PRIMARY KEY,
    `firstname` VARCHAR(225),
    `lastname` VARCHAR(225),
    `age` INT,
    `height` INT,
    `gender` VARCHAR(225)
);

CREATE TABLE `chunks`(
    `id` INT NOT NULL PRIMARY KEY,
    `firstname` VARCHAR(225),
    `lastname` VARCHAR(225),
    `age` INT,
    `height` INT,
    `gender` VARCHAR(225)
);