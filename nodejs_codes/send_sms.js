var endpoint='https://portal.mobtexting.com/api/v2/';

try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/deleteStudents/'+ this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          fullname: i,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Student deleted successfully.")

        }
        else{alert("Error deleting student. Try again.");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }

