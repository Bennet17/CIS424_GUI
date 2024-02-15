
function EditPOS() {
    return (

        <table >
<tbody>
<h2 className="text-lg font-bold mb-2">Edit POS</h2>
    <tr>
        <td>
            <label>City</label>
            <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" />
        </td>
        <td>
            <label>State</label>
            <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" />
        </td>
    </tr>
    <tr>
        <td>
            <label>Postal Code</label>
            <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" ></input>
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
            <label>POS ID</label>
            <select className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" >
                <option value="POS 1">POS 1</option>
                <option value="POS 2">POS 2</option>
               </select>
        </td>
    </tr>


    <tr>
        <td>
            <button type="cancel"value="cancel" className="flex w-5/6  justify-center rounded-md bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Cancel</button>
        </td>
        <td>
            <button type="submit" value="submit" className="flex w-5/6  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Confirm Edit</button>
        </td>
    </tr>
</tbody>
</table>

    )
}
  
export default EditPOS;