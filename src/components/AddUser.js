
import axios from "axios";

function AddUser() {





    function validatePassword(password) {
        //this regex declares a minimum of 8 characters, 1 number, and 1 special character to be needed for valid password entry
        var pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*()-_+=])[a-zA-Z0-9!@#$%^&*()-_+=]{8,}$/;
        return pattern.test(password);
    }


    function Submit(event){
        event.preventDefault();
      

        var name = document.getElementById("name");
        console.log(name)
        var username = document.getElementById("username");
        var password = document.getElementById("password");
        var position = document.getElementById("role");
        var storeID = document.getElementById("storeID")


    
        axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateUser', {
          "username": username.value,
          "name": name.value,
          "password": password.value,
          "position": position.value,
          "storeID": storeID.value
        })



        .then(response => {
         console.log(response);
          //see discord behind-the-scenes channel for test username/passwords to use
          //if we return true as our response, route the user to the main screen
          if (response.data.IsValid == true){
           console.log("User was created!")
          }else{
            //do logic for invalid user, i dunno can't test this yet cuz back-end people are
            //sending truthy responses for both valid/invalid user possibilities
          }
        })
        .catch(error => {
          console.error(error);
        });
      }  

    
    return (

        <table >
<tbody>
<h2 className="text-lg font-bold mb-2">Add User</h2>
    <tr>
        <td>
            <label>First & Last Name</label>
            <input id='name' className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" />
        </td>

    </tr>
    <tr>
        <td>
            <label>Username</label>
            <input id='username'  className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" ></input>
        </td>
    </tr>
    <tr>
        <td>
            <label>Store ID</label>
            <select multiple  id='storeID' className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" >
                <option value="store 1">Store 1</option>
                <option value="store 2">Store 2</option>
                <option value="store 3">Store 2</option>
               </select>
        </td>
        <td>
            <label>Role</label>
            <select id='role' className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
               </select>
        </td>
    </tr>


    <tr>
        <td>
            <button type="cancel"value="cancel" className="flex w-5/6  justify-center rounded-md bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Cancel</button>
        </td>
        <td>
            <button type="submit" value="submit" onclick={Submit} className="flex w-5/6  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Employee</button>
        </td>
    </tr>
</tbody>
</table>

    )
}
  
export default AddUser;