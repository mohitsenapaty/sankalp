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

create table teacher_login(
    teacher_id serial unique not null,
    fullname varchar(50) unique not null,
    emailid varchar(100) unique not null,
    phone varchar(15) unique not null,
    password varchar(100) not null,
    unencrypted varchar(10) not null,
    primary key (teacher_id)
);

create table student_login(
    student_id serial unique not null,
    fullname varchar(50) unique not null,
    emailid varchar(100) unique not null,
    phone varchar(15) unique not null,
    password varchar(100) not null,
    unencrypted varchar(10) not null,
    primary key (student_id)
);

create table student_academic_enrollment_detail(
    student_id int unique not null,
    class varchar(2) not null,
    section varchar(1) not null,
    roll_number varchar(2) not null
);

create index index_student_academic_enrollment_detail on student_academic_enrollment_detail(student_id);

create table update_tracker(
    table_name varchar(100),
    last_updated TIMESTAMP,
    status varchar(1)
);


