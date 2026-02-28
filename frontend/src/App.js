import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

function App() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  function loadMedicines() {
    fetch("https://pharmacy-project-25pj.onrender.com/medicines")
      .then((res) => res.json())
      .then((data) => setMedicines(data));
  }

  useEffect(() => {
    loadMedicines();
  }, []);

  function addMedicine() {
    fetch("https://pharmacy-project-25pj.onrender.com/medicines", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: name,
        stock: parseInt(stock),
        price: parseInt(price),
        status: "Active",
      }),
    }).then(() => {
      loadMedicines();

      setName("");
      setStock("");
      setPrice("");
    });
  }

  function updateMedicine(id) {
    const newName = prompt("Enter name");
    const newStock = prompt("Enter stock");
    const newPrice = prompt("Enter price");

    fetch(
      `https://pharmacy-project-25pj.onrender.com/update/${id}?name=${newName}&stock=${newStock}&price=${newPrice}`,
      {
        method: "PUT",
      },
    ).then(() => {
      loadMedicines();
    });
  }

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <Dashboard />

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 2px 8px rgba(2,0,0,20)",
          marginTop: "20px",
        }}
      >
        <h2>Inventory Management</h2>

        <div style={{ marginBottom: "20px" }}>
          <input
            value={search}
            placeholder="Search Medicine..."
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              width: "250px",
              marginRight: "20px",
              borderRadius: "6px",
              border: "1px solid gray",
            }}
          />
        </div>

        <div
          style={{
            background: "#fafafa",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3>Add Medicine</h3>

          <input
            value={name}
            placeholder="Medicine Name"
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            value={stock}
            placeholder="Stock"
            onChange={(e) => setStock(e.target.value)}
            style={inputStyle}
          />

          <input
            value={price}
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={addMedicine}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Add Medicine
          </button>
        </div>

        <h3>Inventory Table</h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
          }}
        >
          <thead>
            <tr style={{ background: "#eef2ff" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Update</th>
            </tr>
          </thead>

          <tbody>
            {filteredMedicines.map((m, i) => {
              return (
                <tr key={i} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{m.name}</td>

                  <td style={tdStyle}>{m.stock}</td>

                  <td style={tdStyle}>₹ {m.price}</td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "6px",

                        background:
                          m.stock === 0
                            ? "#fee2e2"
                            : m.stock < 10
                              ? "#fef3c7"
                              : "#dcfce7",
                      }}
                    >
                      {m.stock === 0
                        ? "Out of Stock"
                        : m.stock < 10
                          ? "Low Stock"
                          : "Active"}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() => updateMedicine(m.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#22c55e",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const inputStyle = {
  padding: "8px",
  marginRight: "10px",
  borderRadius: "6px",
  border: "1px solid gray",
};

export default App;
