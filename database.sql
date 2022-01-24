CREATE TABLE `phonebook` (
    `Id` varchar(30) NOT NULL,
    `Name` varchar(255) DEFAULT NULL,
    `Office` varchar(255) DEFAULT NULL,
    `Fax` varchar(255) DEFAULT NULL,
    `Mobile` varchar(255) DEFAULT NULL,
    `Email` varchar(255) DEFAULT NULL,
    `Telefonnummer` varchar(255) DEFAULT NULL,
    `Address` varchar(255) DEFAULT NULL,
    `PostalCode` varchar(255) DEFAULT NULL,
    `City` varchar(255) DEFAULT NULL,
    `Organization` varchar(255) DEFAULT NULL,
    `Typ` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

INSERT INTO
    `phonebook` (
        `Name`,
        `Office`,
        `Fax`,
        `Mobile`,
        `Email`,
        `Address`,
        `PostalCode`,
        `City`,
        `Organization`,
        `Typ`
    )
VALUES
    (
        'Example Name',
        '+494491123456',
        '+494491123455',
        '+49174123456',
        'email@mails.de',
        'Examplestreet ',
        '123456',
        'Examplecity',
        'Location 1',
        'Mitarbeiter'
    );