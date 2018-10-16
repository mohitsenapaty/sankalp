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

alter table student_login alter column unencrypted type varchar(20);

alter table teacher_login alter column unencrypted type varchar(20);

 alter table student_login drop constraint student_login_fullname_key;

alter table student_login add column enrollment_number varchar(20) unique;

alter table student_login add column father_name varchar(100);

alter table student_login add column mother_name varchar(100);

create table version_db(version_info varchar(20), lastUpdated TIMESTAMP default CURRENT_TIMESTAMP);

create table class_teacher_detail (teacher_id int unique not null, class varchar(2) not null, section varchar(1) not null, primary key (class, section));

alter table exam_group_detail add column term_number varchar(1);

alter table exam_group_detail add column term_final varchar(1);

create table student_csa(
    exam_group_id int not null,
    student_id int not null,
    literary_interest varchar(5),
    communication_skill varchar(5),
    music varchar(5),
    art_craft varchar(5),
    primary key (exam_group_id, student_id)
);

create index index_student_csa on student_csa(student_id);

create table student_personal_trait(
    exam_group_id int not null,
    student_id int not null,
    discipline varchar(5),
    punctuality varchar(5),
    hygiene varchar(5),
    primary key (exam_group_id, student_id)
);

create index index_student_personal_trait on student_personal_trait(student_id);

create table student_ahs(
    exam_group_id int not null,
    student_id int not null,
    total_working_days int,
    attendance int,
    height numeric(6,2),
    weight numeric(6,2),
    bmi numeric(6,2),
    primary key (exam_group_id, student_id)
);

create index index_student_ahs on student_ahs(student_id);

create table student_remarks(
    exam_group_id int not null,
    student_id int not null,
    remarks varchar(500),
    primary key (exam_group_id, student_id)
);

create index index_student_remarks on student_remarks(student_id);

create table teacher_pwd_request(
    teacher_id int not null,
    request_time timestamp not null
);

create index index_teacher_pwd_request on teacher_pwd_request(teacher_id);

create table student_pwd_request(
    student_id int not null,
    request_time timestamp not null
);

create index index_student_pwd_request on student_pwd_request(student_id);

alter table student_academic_enrollment_detail add primary key(student_id);

create table hostel_detail(
    hostel_id SERIAL UNIQUE NOT NULL,
    hostel_name varchar(100),
    hostel_address varchar(200),
    primary key (hostel_id)
);

create table student_residential_detail(
    student_id int not null,
    date_of_birth varchar(20),
    hostel_resident varchar(3),
    hostel_id int,
    transportation varchar(3),
    fdb_db varchar(2),
    primary key (student_id)
);

create table house_detail(
    house_id SERIAL UNIQUE NOT NULL,
    house_name varchar(30),
    house_code varchar(10),
    primary key (house_id)
);

create table student_house_detail(
    student_id int not null,
    house_id int,
    primary key (student_id)
);

create table holiday_detail(
    holiday_id SERIAL UNIQUE NOT NULL,
    session varchar(20),
    occasion varchar(50),
    details varchar(500),
    start_date varchar(20),
    end_date varchar(20),
    primary key (holiday_id)
);
