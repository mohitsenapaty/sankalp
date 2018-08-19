CREATE TABLE admin_login(
    admin_id SERIAL UNIQUE NOT NULL,
    user_name VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    last_login TIMESTAMP,
    PRIMARY KEY (admin_id)
);

create table subject_details(
    subject_id serial unique not null,
    subject_name varchar(30) unique not null,
    subject_code varchar(10) unique not null,
    is_major varchar(5) not null,
    primary key (subject_id)
);
