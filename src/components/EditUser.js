
function EditUser(user, onClose, onConfirm) {

      // Implement your edit form logic here
  const handleConfirm = () => {
    // Call the onConfirm function passed from the parent component
    onConfirm();
  };
  const handleClose = () => {
    onClose();
  };
    return (

        <table >
<tbody>
<h2 className="text-lg font-bold mb-2">Edit User</h2>
    <tr>
        <td>
            <label>First Name</label>
            <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" />
        </td>
        <td>
            <label>Last Name</label>
            <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" />
        </td>
    </tr>
    <tr>
        <td>
            <label>Phone Number</label>
            <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" ></input>
        </td>
        <td>
            <label>User ID</label>
            <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
        </td>
    </tr>
    <tr>
        <td>
            <label>Store ID</label>
            <select className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" >
                <option value="store 1">Store 1</option>
                <option value="store 2">Store 2</option>
               </select>
        </td>
        <td>
            <label>Role</label>
            <select className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
               </select>
        </td>
    </tr>


    <tr>
        <td>
            <button type="cancel"value="cancel" className="flex w-5/6  justify-center rounded-md bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onclick={handleClose}>Cancel</button>
        </td>
        <td>
            <button type="submit" value="submit" className="flex w-5/6  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"onclick={handleConfirm}>Confirm Edits</button>
        </td>
    </tr>
</tbody>
</table>

    )
}
  
export default EditUser;