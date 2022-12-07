import React from "react";

export default function Item() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  function getToken() {
    const tokenString = sessionStorage.getItem('token');
  return JSON.parse(tokenString);

}
  let formDatas = {
    itemID: "",
    description: "",
    cost: "",
    sellingPrice: "",
    note: "",
    supplierID: "",
    Classification: "",
  };
  React.useEffect(() => {
    fetch("http://localhost:8000/item",{
      headers: new Headers({
        'Authorization': 'Bearer '+ getToken()
    })
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        items.map((item) => {});
        setLoading(false);
      }).catch((error) => {
        console.log('error: ' + error);
        // this.setState({ requestFailed: true });
      });
  }, []);
  const inputChanged = (event) => {
    formDatas[event.target.name] = event.target.value;
  };
  function resetForm() {
    document.getElementById("itemForm").reset();
    formDatas = {
      itemID: "",
      description: "",
      cost: "",
      sellingPrice: "",
      note: "",
      supplierID: "",
      classification: "",
    };
  }
  const handleSubmit = (event) => {
    submitForm(formDatas);
  };
  const editItem = (itemID) => {
    console.log(itemID);
    console.log("edit");
    fetch("http://localhost:8000/item/find/" + itemID,{

        headers: new Headers({
          'Authorization': 'Bearer '+ getToken()
      })
    })
      .then((res) => res.json())
      .then((data) => {
        formDatas.itemID = data.itemID;
        formDatas.description = data.description;
        formDatas.cost = data.cost;
        formDatas.sellingPrice = data.sellingPrice;
        formDatas.note = data.note;
        formDatas.supplierID = data.supplierID;
        formDatas.Classification = data.Classification;
        console.log(formDatas);
        addItem();
      });

  };
  function deleteItem(ItemID) {
    let confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      fetch("http://localhost:8000/item/delete/" + ItemID, {
        method: "DELETE",
        headers: new Headers({
          'Authorization': 'Bearer '+ getToken()
      })
      }).then((res) => {
        if (res.ok) {
          alert("Item deleted");
          window.location.reload();
        }
      });
    }

  };
  const saveChanges = () => {
    // get the values from the form
    console.log("saving changes");
    submitForm(formDatas);
    // reload the page
    closeModal();
    // window.location.reload();

  };
  function getItem(itemID) {
    fetch("http://localhost:8000/item/find/" + itemID)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      }
      );
  };

  function submitForm(datas) {
    if (datas.itemID === "") {
      fetch("http://localhost:8000/item/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer '+ getToken(),
        },
        body: JSON.stringify(datas),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          resetForm();
          window.location.reload();
        });
    } else {
    fetch("http://localhost:8000/item/update/" + datas.itemID+"/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+ getToken(),
      },
      body: JSON.stringify(datas),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resetForm();
        window.location.reload();
      // });
    });
  }

  }

  const addItem = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    // set the values of the form
    for(let key in formDatas) {
      try {
      document.getElementById(key).value = formDatas[key];

      } catch (error) {
        console.log(error);
      }
    }
  };
  const closeModal = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
  };
  // loading
  if (loading) {
    return <div>Loading...</div>;
  }



    return (
  <div>
    <div>
      <h1 className="title is-1">Item</h1>
      {/* add button */}
      <button className="button is-primary" onClick={addItem}>Add Item</button>
    </div>

      <div className="data-table">
      <table className="my-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Cost</th>
          <th>Selling Price</th>
          <th>Note</th>
          <th>Supplier ID</th>
          <th>Classification</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>

        {items.map((item, i) => (
          <tr key={i}>
            <td>{i+1}</td>
            <td>{item.description}</td>
            <td>{item.cost}</td>
            <td>{item.sellingPrice}</td>
            <td>{item.note}</td>
            <td>{item.supplierID}</td>
            <td>{item.classification}</td>
            <td>
              <button className="button is-warning is-fullwidth" onClick={() => editItem(item.itemID)}>Edit</button>
              <button className="button is-danger is-fullwidth" onClick={() => deleteItem(item.itemID)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>

 <div id="myModal" className="modal">
    <div className="modal-content">
      <header className="modal-header">
        <p className="modal-card-title">Add Item</p>
        <button className="button delete is-danger" aria-label="close" onClick={closeModal}>X</button>
      </header>
      <section className="modal-body">
        <form id="itemForm">
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <input className="input" type="text"  name="description" id="description" onChange={inputChanged} placeholder="Description" />
            </div>
            </div>
            <div className="field">
            <label className="label">Cost</label>
            <div className="control">
              <input className="input" type="text" name="cost" id="cost"  onChange={inputChanged} placeholder="Cost" />
              </div>
              </div>
              <div className="field">
            <label className="label">Selling Price</label>
            <div className="control">
              <input className="input" type="text" name="sellingPrice" id="sellingPrice"  onChange={inputChanged} placeholder="Selling Price" />
              </div>
              </div>
              <div className="field">
            <label className="label">Note</label>
            <div className="control">
              <input className="input" type="text" name="note" id="note"  onChange={inputChanged} placeholder="Note" />
              </div>
              </div>
              <div className="field">
            <label className="label">Supplier ID</label>
            <div className="control">
              <input className="input" type="text" name="supplierID" id="supplierID"  onChange={inputChanged} placeholder="Supplier ID" />
              </div>
              </div>
              <div className="field">
            <label className="label">Classification</label>
            <div className="control">
              <input className="input" type="text"  name="classification" id="classification"  onChange={inputChanged} placeholder="Classification" />
              </div>
              </div>
        </form>
      </section>
      <footer className="modal-footer">
        <button className="button is-success" onClick={saveChanges} >Save changes</button>
        <button className="button is-danger" onClick={closeModal}>Cancel</button>
      </footer>

      </div>
      </div>

  </div>
    );
}