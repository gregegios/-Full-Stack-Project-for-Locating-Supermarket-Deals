<template>
  <div>
    <h1 class="title bg-blue-400 text-center p-2 text-3xl w-full">ADMIN</h1>
    <Chart />
    <div class="w-[700px] mx-auto mt-8">
      <label for="categorySelect" class="dropdown-label">Select a category:</label>
      <select id="categorySelect" v-model="selectedCategory">
        <option v-for="(category, i) in categories" :value="i" :key="i">
          {{ i }} {{ category.name }}
        </option>
      </select>
      <div class="prod" v-if="selectedCategory > -1">
        <label for="subcategorySelect" class="dropdown-label">Select a subcategory:</label>
        <select id="subcategorySelect" v-model="selectedSubcategory">
          <option v-for="(subcategory, i) in categories[selectedCategory].subcategories" :value="i" :key="i">
            {{ i }} {{ subcategory.name }}
          </option>
        </select>
        <svg @click="showbox()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-9 h-9 ml-auto cursor-pointer">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <div id="productsContainer" v-if="showProductBox == true">
          <div id="boxes"
            class="bg-green-200 p-4 m-2 rounded-md grid grid-rows-2 grid-flow-col border hover:outline-none hover:border-sky-500 hover:ring-1 hover:ring-sky-500">
            <p class="p-2 font-bold text-sm">
            <div> Product Name:</div>

            <input
              class="rounded-md block bg-transparent font-light text-slate-500 border-solid border-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="name" v-model="newproduct.name" type="text" />
            </p>
            <p class="p-2 font-bold text-sm">

            <div> Product ID:</div>

            <input
              class="rounded-md block bg-transparent font-light text-slate-500 border-solid border-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="id" v-model="newproduct.id" type="text" />

            </p>
            <p class="p-2 font-bold text-sm">
            <div>Product Category:</div>

            <input disabled
              class="rounded-md block bg-transparent font-light text-slate-500 border-solid border-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="text" :value="categories[selectedCategory]?.name" />
            </p>
            <p class="p-2 font-bold text-sm">
            <div> Product subCategory:</div>

            <input disabled
              class="rounded-md block bg-transparent font-light text-slate-500 border-solid border-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="text" :value="categories[selectedCategory]?.subcategories[selectedSubcategory].name" />
            </p>
            <p id="add_button" class="p-2">
              <button
                class="bg-blue-400 hover:bg-blue-600 text-white hover:outline-none hover:ring hover:ring-blue-600 font-bold py-2 px-4 rounded-full"
                @click="addProduct()">
                Add
              </button>
            </p>
          </div>
        </div>

        <div v-if="selectedSubcategory > -1">
          <h1 class="text-xl">{{}}{{}}</h1>
          <div id="productsContainer">
            <div v-for="product in products" id="boxes" :key=product.id
              class="bg-green-200 p-4 m-2 rounded-md grid grid-rows-2 grid-flow-col border hover:outline-none hover:border-sky-500 hover:ring-1 hover:ring-sky-500">
              <p class="p-2 font-bold text-sm">
              <div>Product Name:</div>

              <input
                class="rounded-md block bg-transparent font-light text-slate-500 border-solid border-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                v-model="product.name" type="text" />
              </p>
              <p class="p-2 font-bold text-sm">
              <div>Product ID:</div>

              <input
                class="rounded-md block bg-transparent font-light text-slate-500 border-solid border-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                v-model="product.id" type="text" />
              </p>
              <p class="p-2 font-bold text-sm">
              <div>Product Category:</div>

              <input
                class="rounded-md block bg-transparent font-light text-slate-500 border-solid border-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                v-model="product.category" type="text" />
              </p>
              <p class="p-2 font-bold text-sm">
              <div>Product subCategory:</div>

              <input
                class="rounded-md block bg-transparent font-light text-slate-500 border-solid border-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                v-model="product.subcategory" type="text" />
              </p>
              <p id="edit_button" class="p-2 w-full">
                <button
                  class="bg-orange-400 hover:bg-orange-600 hover:outline-none hover:ring hover:ring-orange-300 text-white font-bold py-2 px-4 rounded-full"
                  @click="updateProduct(product)">
                  Edit
                </button>
              </p>
              <p class="p-2 w-full">
                <button
                  class="bg-orange-700 hover:bg-red-900 hover:outline-none hover:ring hover:ring-red-300 text-white font-bold py-2 px-4 rounded-full"
                  @click="deleteProduct(product)">
                  Delete
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#boxes {
  background-color: #ffffffca;
}

#edit_button {
  color: rgb(254, 161, 0);
}

#categorySelect {
  width: 80%;
  margin-left: 60px;
  margin-bottom: 10px;
  margin-top: 20px;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

#subcategorySelect {
  width: 80%;
  margin-left: 60px;
  margin-bottom: 10px;
  margin-top: 20px;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

.dropdown-label {
  margin-top: 100px;
  margin-bottom: 100px;
  padding-top: 100px;
  padding-bottom: 100px;
  font-size: 14px;
  font-weight: lighter;
  text-decoration: underline;
}
</style>

<script setup>
import { ref, onMounted, computed } from "vue";
import Chart from "./Chart.vue";

const categories = ref([]);
const selectedCategory = ref(-1);
const selectedSubcategory = ref(-1);
const showProductBox = ref(false);
//showProductBox = false;
const newproduct = ref({
  name: "",
  id: "",
  // category: "", // categories[selectedCategory]?.name,
  // subcategory: "", //categories[selectedCategory]?.subcategories[selectedSubcategory].name,
});

//Get products from database
let products = computed(() => {
  console.log(
    selectedCategory.value,
    selectedSubcategory.value,
    categories.value[selectedCategory.value].subcategories[selectedSubcategory.value]
  );
  return categories.value[selectedCategory.value].subcategories[selectedSubcategory.value]
    .products;
});

const showbox = async () => {
  showProductBox.value = true;
}

const getProducts = async () => {
  try {
    // Make the API request and get the response
    const response = await fetch("http://localhost:3000/products", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });

    // If the response is not successful, throw an error
    if (response.ok == false) throw response;

    // Parse the JSON data from the response
    categories.value = await response.json();
  } catch (error) {
    console.log(error);
  }
};

//call getProducts
onMounted(() => {
  getProducts();
});

const addProduct = async () => {
  try {
    // Send an HTTP request to the server to add the new product to the database
    const response = await fetch("http://localhost:3000/addproduct", {
      method: "POST",
      body: JSON.stringify({
        name: newproduct.value.name,
        category: categories.value[selectedCategory.value].name,
        subcategory:
          categories.value[selectedCategory.value].subcategories[
            selectedSubcategory.value
          ].name,
        id: newproduct.value.id,
      }),
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    // Handle any errors that occurred in the request
    console.error(error);
  }
};

const updateProduct = async (product) => {
  try {
    // Send an HTTP request to the server to update the product in the database
    const response = await fetch("http://localhost:3000/products/" + product.id, {
      method: "POST",
      body: JSON.stringify({
        name: product.name,
        id: product.id,
        category: product.category,
        subcategory: product.subcategory,
      }),
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    // Handle any errors that occurred in the request
    console.error(error);
  }
};

const deleteProduct = async (product) => {
  try {
    // Send an HTTP request to the server to update the product in the database
    const response = await fetch("http://localhost:3000/products/" + product.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });
    const data = await response.json();
    console.log(data);
    // // Update the product in the local state with the updated data from the server
    // this.products = this.products.map((p) => {
    //   if (p.id === product.id) {
    //     return data;
    //   }
    //   return p;
    // });
  } catch (error) {
    // Handle any errors that occurred in the request
    console.error(error);
  }
};
</script>
