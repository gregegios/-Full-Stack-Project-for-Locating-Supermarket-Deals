<template>
  <div>
    <nav>
      <div class="logo">
        <img src="./logos.svg" alt="logo">
      </div>
      <button @click="handleLogout" class="logout-button">Log Out</button>
    </nav>
    <div id="container">
      <div class="seldiv">
        <h2>Search for Offers</h2>
        <input type="text" placeholder="Search for shops" v-model="query">
        <button class="koumpi" @click="searchShop()">Αναζήτηση</button>
        <label>Αναζήτηση από κατηγορία:</label>
        <select v-model="category">
          <option>Καθαριότητα</option>
          <option>Τρόφιμα</option>
          <option>Ποτά/Αναψυκτικά</option>
          <option>Προσωπική Φροντίδα</option>
        </select>
        <label>Υποκατηγορία:</label>
        <select v-model="subcategory">
          <option v-for="subcategory in subcategories[category]" :key="subcategory">
            {{ subcategory }}
          </option>
        </select>

        <button @click="showDeals()" class="koumpi" type="submit" :disabled="!subcategory">Αναζήτηση</button>

        <div id="offer" v-if="showOffer == true">
         
           <h2 class="katastima">{{ selectedShop.shopname }}</h2> 
           <div v-for= " deal in selectedShop.deals" :key="deal.id" >
            <h3 class="offerName"> {{ deal.fk_product.name }}</h3> 
          <h3 class="charOffer">Τιμή: {{ deal.price }}   €</h3>
          <h3 class="charOffer">Καταχωρήθηκε: {{ deal.createdAt }} </h3>  
         
          <div class="icons">
          <span class="svg">
            <svg @click="vote(deal.id,'like')" :class="{'clicked': clicked}"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
            </svg>
          </span>
          <span class="svg">
            <svg @click="vote(deal.id,'dislike')" :class="{'clicked': clicked}"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
            </svg>
          </span>
         </div>
        </div>


        </div>

      </div>
      <div id="mapContainer"></div>
    </div>
  </div>
</template>



<script setup>
import L from "leaflet"
import { onMounted } from "vue";
import { ref } from 'vue';
import { reactive } from 'vue';
import { toRefs } from "vue";
import userState from '../composables/store.js'
import { useRouter } from "vue-router";
import { useEventListener } from '@vueuse/core';




const router = useRouter()

const shops = ref([])

const dealShops = ref([])

let clicked = ref()

const selectedShop = ref({})

 

// const downvote = ref([])

const showOffer = ref(false)



const dealReview = (shop) => {
  
  showOffer.value = true;
  console.log(showOffer.value);

  selectedShop.value = shop
  

}

const vote = async (dealID, vote) => {

  clicked = !clicked;
  
  try {
    const response = await fetch('http://localhost:3000/deals/review', {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vote: vote,
      fk_user: localStorage.getItem('userID'),
      dealId: dealID
    })
    }) 

    if(response.ok == false) throw response.statusText

    const res = await response.json();

    console.log("response!",res)
    } catch (error){
      alert(error)
    } 
}



const getShops = async () => {
  try {

    const response = await fetch('http://localhost:3000/shops', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning'
      }
    },)

    if (response.ok == false) throw response

    shops.value = await response.json()
    console.log("GOT SHOPS")

  } catch (error) {
    console.log(error)
  }
}

const getDealShops = async () => {
  try {

    const response = await fetch('http://localhost:3000/deals-by-shop', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning'
      }
    },)

    if (response.ok == false) throw response

    dealShops.value = await response.json()
    console.log("GOT SHOPS WITH DEALS")

  } catch (error) {
    console.log(error)
  }
}




//LOGOUT HANDLING


const handleLogout = () => {
  localStorage.removeItem('token');
  userState.value.loggedIn = false

  router.push("/login")
}

//SEARCH SHOPS

const searchShop = () => {
  filteredShops = shops.value.filter((shop) => {
    return (shop.name == query.value)
  })

  mymap.eachLayer((layer) => {
    layer.remove();
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mymap);

  filteredShops.forEach(shop => {
    let marker = L.marker([shop.long, shop.lat], { title: shop.name }).addTo(mymap)

    marker.bindPopup(`<h1 class = "shopName">${shop.name}</h1>`)
  })

}

const showDeals = () => {
  catShops = dealShops.value.filter((shop) => {

    let flag = false;
    shop.deals.forEach((deal) => {
      console.log(deal.fk_product.subcategory, subcategory.value, deal.fk_product.subcategory == subcategory.value)
      if (deal.fk_product.subcategory == subcategory.value) flag = true
    })
    return flag
  })

  console.log(subcategory.value)
  console.log(catShops)

  mymap.eachLayer((layer) => {
    layer.remove();
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mymap);

  catShops.forEach(shop => {
    let marker = L.marker([shop.long, shop.lat], { title: shop.shopname }).addTo(mymap)

    marker.setIcon(L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.6.0/dist/images/marker-shadow.png',
      shadowSize: [41, 41],

    }))

    let buildPopup = (shop) => {
      var box = document.createElement("h2")
      box.innerHTML = `<h2 id="shopName">${shop.shopname}</h2>`
      box.className = "inpop";
      box.addEventListener("click", () => dealReview(shop))

      shop.deals.forEach((deal) => {
        box.innerHTML += `
                    <h2 class = "inpop"><span class="bold">Προσφορά:</span> ${deal.fk_product.name}</h2>
                    <h2 class = "inpop"><span class="bold">Τιμή:</span> ${deal.price}€</h2>
                    <h2 class = "inpop"><span class="bold">Likes: </span>${deal.likes} </h2>
                    <h2 class = "inpop"><span class="bold">Dislikes:</span>${deal.dislikes} </h2>
                    <h2 class = "inpop"><span class="bold">Καταχωρήθηκε:</span> ${deal.createdAt}</h2>
                    <br/>
                    `
      })

      return box
    }
    marker.bindPopup(buildPopup(shop));
  })



}

const subcategories = {
  "Τρόφιμα": ["Γλυκά/Σοκολάτες", "Καφέδες"],
  "Καθαριότητα": ["Είδη γενικού καθαρισμού", "Χαρτικά"],
  "Ποτά/Αναψυκτικά": ["Κρασιά", "Μπύρες"],
  "Προσωπική Φροντίδα": ["Αποσμητικά", "Πάνες ενηλίκων"],
};

const query = ref('');
const category = ref('Trofima');
const subcategory = ref('');
let mymap;
var filteredShops;
var catShops;




onMounted(async () => {
  mymap = L.map('mapContainer').setView([38.2466, 21.7345], 13)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mymap);

  await getShops();
  await getDealShops();
  console.log("Setting Maps")

  dealShops.value.forEach(shop => {
    let marker = L.marker([shop.long, shop.lat], { title: shop.shopname }).addTo(mymap)

    // Log the marker object to the console

    marker.setIcon(L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.6.0/dist/images/marker-shadow.png',
      shadowSize: [41, 41],

    }))


    let buildPopup = (shop) => {
      var box = document.createElement("h2")
      box.innerHTML = `<h2 id="shopName">${shop.shopname}</h2>`
      box.className = "inpop";
      box.addEventListener("click", () => dealReview(shop) )

      shop.deals.forEach((deal) => {
        box.innerHTML += `
                    <h2 class = "inpop"><span class="bold">Προσφορά:</span> ${deal.fk_product.name}</h2>
                    <h2 class = "inpop"><span class="bold">Τιμή:</span> ${deal.price}€</h2>
                    <h2 class = "inpop"><span class="bold">Likes: </span>${deal.likes} </h2>
                    <h2 class = "inpop"><span class="bold">Dislikes:</span>${deal.dislikes} </h2>
                    <h2 class = "inpop"><span class="bold">Καταχωρήθηκε:</span> ${deal.createdAt}</h2>
                    <br/>
                    `
      })

      return box
    }




    marker.bindPopup(buildPopup(shop));

    //  
  })
  //icon marker
  var userLocationCircle;
  var userLocationMarker;



  // Locate the user's position on the map
  mymap.locate({ setView: true, maxZoom: 16 });

  function shopNmaeClicked() {
    console.log("okokok")
  }

  function onLocationFound(e) {
    var radius = 50; // 50 meters

    // Create a marker for the user's location and a circle around the location
    var userLocationMarker = L.marker(e.latlng, {
      icon: L.divIcon({
        className: 'my-custom-pin',
        iconAnchor: [0, 12],
        labelAnchor: [0, 0],
        popupAnchor: [0, -12],
        html: '<span style="background-color: green; width: 2px; height: 2px; line-height: 2px; display: inline-block; text-align: center; border-radius: 50%;"></span>'
      })
    }).addTo(mymap);

    // Update the marker position when the map is zoomed or panned
    mymap.on('zoomend', function () {
      userLocationMarker.setLatLng(userLocationMarker.getLatLng());
    });

    userLocationCircle = L.circle(e.latlng, radius).addTo(mymap);
  }

  mymap.on('locationfound', onLocationFound);



});



</script>

<style scoped>
#container {
  margin-top: 65px;
}

#mapContainer {
  width: 77%;
  margin-left: 350px;
  height: 90vh;
  border-radius: 15px;
  flex-grow: 1;
}

.seldiv {
  position: absolute;
  left: 35px;
  height: 100vh;
  width: 22%;
  background-color: #ffffffca;
  border-radius: 15px;
}

input {
  width: 80%;
  border-radius: 15 px;
  margin-left: 30px;
  margin-top: 10px;
}

h2 {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 0.5em 0;
  color: #014957;
}

.seldiv label {
  display: block;
  margin-top: 1em;
  margin-left: 25px;
  margin-bottom: 10px;
  font-weight: bold;
  color:#014957;

}

.seldiv select {
  width: 80%;
  margin-left: 25px;
  margin-bottom: 10px;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

.koumpi {
  background-color: rgb(254, 161, 0);
  /* add a background color */
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  /* add a box shadow */
  border-radius: 15px;
  margin-left: 65px;
  margin-top: 20px;
  width: 55%;
  padding: 2%;
  cursor: pointer;

}

#koumpi:hover {
  background-color: rgb(255, 98, 0);
  /* change the background color on hover */
}

#koumpi {
  transition: background-color 0.3s ease-in-out;
  /* add a transition effect */
}

nav {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  align-items: center;
  top: 0;
  height: 50px;
  background-color: #025A6C;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.logo img {
  height: 40px;
  width: auto;
}

.logout-button {
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.logout-button:hover {
  color: #41B883;
}

@media screen and (max-width: 600px) {

  /* Styles for screens with a width smaller than 600px go here */
  #mapContainer {
    width: 100%;
    margin-left: 0;
  }

  .seldiv {
    position: relative;
    left: 0;
    width: 100%;
    overflow: auto;
  }

}
#offer {
  margin-top: 40px;
  border-radius: 15px;
  position:relative;
}

.svg {
  display: inline-block;
  padding: 2%;
  margin-top: 20px;

}
.svg:hover {
  color:rgb(245, 135, 67);
  box-shadow: #ffffffca;
}

.clicked {
  color:rgb(245, 135, 67);
  box-shadow: #ffffffca;
}

.icons {
  text-align: center;
}

.katastima {
  text-align: center;
  color: rgb(255, 98, 0);
  font-weight: bold;
}

.offerName {
  text-align: center;
}

.charOffer{
  margin-left: 15px;
  margin-top:5px;
}


.seldiv{
  height: 90% !important ;
  overflow: auto;
}
</style>





