var school_kaanger_valley_academy_raipur = 'kaanger_valley_academy_raipur';

const globalProdExports = {
  school_conn_db_dict: {
    'kaanger_valley_academy_raipur': "postgres://postgres:12345678@mydbinstance.cs1q5ibv93jg.us-west-2.rds.amazonaws.com:5432/sankalp_" + school_kaanger_valley_academy_raipur
  },
  master_dict: {
  	'db_name': "postgres://postgres:12345678@mydbinstance.cs1q5ibv93jg.us-west-2.rds.amazonaws.com:5432/sankalp",
  }
}

const globalDevExports = {
  school_conn_db_dict: {
    'kaanger_valley_academy_raipur': "postgres://postgres:postgres@127.0.0.1:5432/sankalp_" + school_kaanger_valley_academy_raipur
  },
  master_dict: {
  	'db_name': "postgres://postgres:postgres@127.0.0.1:5432/sankalp",
  }
}

const globalExports = globalDevExports

module.exports = globalExports;

/*
const uploadFile1 = () => {
  fs.readFile(file_name, (err, data) => {
     if (err) throw err;
     const params = {
         Bucket: 'sankalp-report-storage', // pass your bucket name
         Key: file_name, // file will be saved as testBucket/contacts.csv
         Body: JSON.stringify(data, null, 2),
         ACL: 'public-read',
     };
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         console.log(`File uploaded successfully at ${data.Location}`)
     });
  });
};
*/