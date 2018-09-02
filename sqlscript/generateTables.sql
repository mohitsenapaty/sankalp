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

create table teacher_subject_detail(
    teacher_id int,
    subject_id int,
    class varchar(5),
    section varchar(1),
    primary key ( subject_id, class, section)
);


create index index_teacher_subject_detail on teacher_subject_detail(teacher_id);

create table student_subject_detail(
    student_id int,
    subject_id int,
    primary key (student_id, subject_id)
);

create index index_student_subject_detail on student_subject_detail(student_id);

create table exam_group_detail(
    exam_group_id serial unique not null,
    exam_group_name varchar(100) not null,
    exam_group_date varchar(30) not null,
    exam_group_type varchar(20) not null,
    primary key (exam_group_id)
);

create table exam_group_scoring(
    exam_group_id int not null,
    subject_id int not null,
    student_id int not null,
    max_score int,
    cur_score int,
    percentage numeric(6,2),
    grade varchar(3),
    primary key (exam_group_id, subject_id, student_id)
);

create index index_exam_group_scoring on exam_group_scoring(student_id);

alter table exam_group_detail add column session varchar(20) default '2018-2019';

create table exam_group_reports_single(
    exam_group_id int not null,
    student_id int not null,
    report_loc varchar(200) not null,
    remote_link varchar(200) not null,
    status varchar(20) not null,
    primary key (exam_group_id, student_id)
);

create index index_exam_group_reports_single on exam_group_reports_single(student_id);

alter table exam_group_detail add column results_declared varchar(1) default 'N';

create table notification_detail(
    notification_id serial unique not null,
    notification_creator varchar(15) not null,
    creator_id int,
    subject varchar(100),
    message varchar(450),
    created_at TIMESTAMP,
    primary key (notification_id)
);

create index index_notification_detail on notification_detail(creator_id);

create table notification_target(
    notification_id int not null,
    target_type varchar(20) not null,
    target_id int,
    target_class varchar(5),
    target_section varchar(1)
);
