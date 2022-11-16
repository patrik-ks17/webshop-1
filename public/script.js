/*
  Product

  Create
  Read
  Update
  Delete

  CRUD

*/
  let state = {
  products: [],
  editedId: ''
};

function renderEditProduct() {

  if(state.editedId === '') {
    document.getElementById('edit-product').innerHTML = '';
    return;
  }

  let foundProduct;
  for (let product of state.products) {
    if(product.id === state.editedId) {
      foundProduct = product;
      break;
    }
  }
  
  let editFormHTML = `
    <h3>Termék szerkesztése:</h3>
    <form id="update-product" class="p-5">
      <label class="w-100">
        Név:
        <input class="form-control" type="text" name="name" value="${foundProduct.name}">
      </label>
      <label class="w-100">
        Ár:
        <input class="form-control" type="number" name="price" value="${foundProduct.price}">
      </label>
      <label class="w-100">
        Van készleten?
        <input class="form-control" type="checkbox" name="isInStock" ${foundProduct.isInStock ? 'checked' : ''}>
      </label>
      <button class="btn btn-primary" type="submit">Küldés</button>
    </form>
  `;

  document.getElementById('edit-product').innerHTML = editFormHTML;

  document.getElementById('update-product').onsubmit = async function (event) {
    event.preventDefault();
    let price = Number(event.target.elements.price.value);
    let name = event.target.elements.name.value;
    let isInStock = event.target.elements.isInStock.checked;


    // state change
    const body = {
      name: name,
      price: price,
      isInStock: isInStock,
    };
  
    const res = await fetch(`/products/${state.editedId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })

    if(!res.ok) {
      alert('Módosítás sikertelen!')
      return;
    }

    // render
    FetchAndRenderProducts();
    renderEditProduct();

  }
}


async function FetchAndRenderProducts() {
  const response = await fetch('/products');
  if (!response.ok) {
    alert('Szerver hiba!');
    return;
  } 
  
  state.products = await response.json();


  let productsHTML = "";

  for (let product of state.products) {
    productsHTML += `
        <div class="card m-2 p-2 ${product.isInStock ? "" : "bg-danger"}">
          <p>${product.name}</p>
          <p>${product.price}</p>
          <button class="btn btn-warning float-right edit-product mb-2" data-productid="${product.id}">
            Szerkesztés
          </button>
          <button class="btn btn-danger float-right delete-product" data-productid="${product.id}">
            Törlés
          </button>
        </div>
      `;
  }

  document.getElementById("product-list-component").innerHTML = productsHTML;

  for (let editBtn of document.querySelectorAll('.edit-product')) {
    editBtn.onclick = function (event) {
      let id = event.target.dataset.productid;
      state.editedId = id;
      renderEditProduct();
    }
  }

  for (let deleteBtn of document.querySelectorAll('.delete-product')) {
    // action
    deleteBtn.onclick = async function (event) {
      let id = event.target.dataset.productid;

      const response = await fetch(`/products/${id}`, {
        method: 'delete'
      });

      if (!response.ok) {
        alert('Törlés sikertelen');
        return;
      }

      
      // render
      FetchAndRenderProducts();
    }
  }
}


window.onload = FetchAndRenderProducts();


// action, state change, render
// tömbhöz új elem hozzáadása: state.products.push({name: '...', price: 2500, isInStock: false})

// action
document.getElementById("create-product").onsubmit = async function(event) {
  event.preventDefault();
  let price = Number(event.target.elements.price.value);
  let name = event.target.elements.name.value;
  let isInStock = event.target.elements.isInStock.checked;

  // state change
  const body = {
    name: name,
    price: price,
    isInStock: isInStock
  };

  const res = await fetch('/products', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if(!res.ok) {
    alert('Létrehozás sikertelen!')
    return;
  }

  // render
  FetchAndRenderProducts();
};


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
