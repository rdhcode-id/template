"use strict";
// Data Toko

// Data Product


function getTextContent(data) {
	const textContent = {};

	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			const elements = Array.from(data[key]);
			textContent[key] = elements.map((element) => element.textContent);
		}
	}

	return textContent;
}

const dataProduct = getTextContent(getProduct);

var products = [];
console.log(dataProduct.img.length);
for (let i = 0; i < dataProduct.img.length; i++) {
	const id = i + 1;
	const image = dataProduct.img[i];
	const name = dataProduct.nme[i];
	const description = dataProduct.des[i];
	const price = dataProduct.prc[i];

	const productArr = {
		id: id,
		image: image,
		name: name,
		description: description,
		price: price,
	};

	products.push(productArr);
}
console.log(products);

// DOM
const pageHome = document.querySelector(".pageHome");
const pageDetail = document.querySelector(".pageDetail");
const pageForm = document.querySelector(".pageForm");
const profilEl = document.querySelector(".sectionProfil");
const productEl = document.querySelector(".sectionProduct");
const loadlEl = document.querySelector(".sectionLoadMore");
var currentPage = 1; //jumlah halaman
var productsPerPage = 5; //product per halaman

// menampilkan produk awal
displayProducts(currentPage, productsPerPage);

var setProfil = () => {
	profilEl.innerHTML = `
<div class="profilBackground" style="background: linear-gradient(
  45deg,
  var(--primary-2),
  var(--secondary-2)
),
url(${background});">
</div>
<div class="profilLogo">
  <img src="${logo}" alt="Logo" class="profilLogo__img">
</div>
<div class="profilInfo mrgn">
  <h2 class="profilInfo__title"> ${headline}</h2>
  <p class="profilInfo__description">${subheadline}</p>
</div>
`;
};
setProfil();

function displayProducts(page, perPage) {
	var startIndex = (page - 1) * perPage;
	var endIndex = startIndex + perPage;
	var currentProducts = products.slice(startIndex, endIndex);

	currentProducts.forEach(function(products) {
		var productElement = document.createElement("div");
		productElement.classList.add("product");
		var productHTML = "";

		if (products.id <= 2) {
			productHTML = `
      <div class="productsNew">
              <div class="productsNew__box">
                <div class="productsNew__img">
                  <img onclick="showProduct(${products.id})" src="${products.image}" alt="${products.name}">
                  <div class="productsNew__detail">
                    <div class="productsNew__detail-txt">
                      <h3>${products.name}</h3>
                      <p>${products.price}</p>
                    </div>
                    <a href="?id=${products.id}" class="productsNew__btn"><span class="i_bag"></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
      `;
		} else {
			productHTML = `
      <div class="productOld ">
              <div class="productOld__box">
                <img onclick="showProduct(${products.id})" src="${products.image}" alt="${products.name}" class="productOld__img">
                <div class="productOld__txt">
                  <h3> ${products.name} </h3>
                  <span>${products.price}</span>

                  <div class="productOld__txt_des">
                    <p>${products.description}</p>
                    <a href="?id=${products.id}" class="">
                      <span class="i_arrow"></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
      `;
		}

		productElement.innerHTML = productHTML;
		productEl.appendChild(productElement);
	});
}

// Page Detail
// Cek apakah URL memiliki parameter id produk saat memuat halaman
var urlParams = new URLSearchParams(window.location.search);
var productIdParam = urlParams.get("id");
if (productIdParam) {
	var productId = parseInt(productIdParam);
	showProductDetails(productId);
}

// Tampilkan detail produk berdasarkan ID
function showProductDetails(productId) {
	var product = products.find(function(item) {
		return item.id === productId;
	});

	if (product) {
		pageHome.classList.add("none");
		pageForm.classList.add("none");

		pageDetail.innerHTML = `
    <div class="detail__image">
          <img  src="${product.image}" alt="${product.name}">
        </div>
        <div clas="detail">
        <div class="detail__text">
          <div class="detail__text-box">
            <h3>${product.name}</h3>
            <span>${product.price}</span>
            <p>${product.description}</p>
          </div>
        </div>
        <div class="detail__button">
          <div class="detail__button-box">
            <button onclick="showProductList()" class="back"><span class="i_back"></span>
            </button>
            <button onclick="showOrderForm(${product.id})" class="order">Order Now</button>
          </div>
          </div>
        </div>
        `;
		pageDetail.classList.remove("none");

		// Ubah URL dengan menambahkan parameter id
		history.pushState({
				productId: product.id
			},
			product.name,
			"?id=" + product.id
		);
	} else {
		pageDetail.innerHTML = "<p>Product not found.</p>";
	}
}

function showProductList() {
	productEl.innerHTML = "";
	pageDetail.innerHTML = "";
	// orderForm.innerHTML = "";

	pageHome.classList.remove("none");
	// loadMore.classList.remove("none");
	currentPage = 1;

	// Hapus parameter id dari URL
	history.pushState({}, "Detail Product", window.location.pathname);
	displayProducts(currentPage, productsPerPage);
}

// load more
function loadMore() {
	currentPage++;
	displayProducts(currentPage, productsPerPage);

	// Cek apakah halaman sudah mencapai batas maksimal
	if (currentPage === Math.ceil(products.length / productsPerPage)) {
		loadlEl.classList.add("none");
	}
}

function showProduct(id) {
	var currentURL = window.location.href;
	var targetPath = `?id=${id}`;

	var targetURL = currentURL.replace(/\/[^\/]*$/, targetPath);
	window.location.href = targetURL;
}

// Tampilkan formulir pesanan berdasarkan ID
function showOrderForm(productId) {
	var product = products.find(function(item) {
		return item.id === productId;
	});

	if (product) {
		pageHome.classList.add("none");
		pageDetail.classList.add("none");

		pageForm.innerHTML = `
    <div class="formBox">
    <h2>Formulir Order</h2>
   
    <div class="form__detail">
      <div class="productOld ">
        <div class="productOld__box">
          <img onclick="showProduct(${product.id})" src="${product.image}" alt="${product.name}"
            class="productOld__img">
          <div class="productOld__txt">
          <p class="formText">Data Pesanan :</p>
            <h3> ${product.name} </h3>
            <span>${product.price}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="form__input">
      <input type="text" name="inputName" id="inputName" placeholder="Name">
      <input type="text" name="inputAlamat" id="inputAlamat" placeholder="Alamat">
      <textarea name="inputCatatan" id="inputCatatan" cols="30" rows="10" placeholder="Catatan"></textarea>
    </div>
    <div class="form__button">
      <div class="detail__button-box">
        <button onclick="showProduct(${product.id})" class="back"><span class="i_back"></span>
        </button>
        <button onclick="submitOrder(event, ${product.id})" class="order">Kirim via WhatsApp</button>
      </div>
    </div>
  </div>
    
    `;
		pageForm.classList.remove("none");
		loadlEl.classList.add("none");

		// Ubah URL dengan menambahkan parameter id
		history.pushState({
				productId: product.id
			},
			product.name,
			"?id=" + product.id
		);
	} else {
		orderForm.innerHTML = "<p>Product not found.</p>";
	}
}

// Get Element Formulit
var sapaan = "Kak";
var whatsapp = "6285351133881";

// Submit order
function submitOrder(event, productId) {
	event.preventDefault();

	var nama = document.getElementById("inputName").value;
	var alamat = document.getElementById("inputAlamat").value;
	var catatan = document.getElementById("inputCatatan").value;

	var validInput = /^[a-zA-Z\s]*$/;
	var product = products.find(function(item) {
		return item.id === productId;
	});

	if (product) {
		var orderDetails = {
			nama: nama,
			alamat: alamat,
			catatan: catatan,
			product: product,
		};

		// Kirim data pesanan ke WhatsApp
		if (
			!validInput.test(nama) ||
			!validInput.test(alamat) ||
			!validInput.test(catatan)
		) {
			document.getElementById("inputCatatan").placeholder =
				"Data yang Anda input tidak valid, silahkan periksa data yang Anda input kembali!";
		} else {
			var message = "";

			if (nama && alamat && catatan) {
				message = `Halo ${sapaan}, saya *${orderDetails.nama}* mau order

Nama Product : *${orderDetails.product.name}*
Alamat: *${orderDetails.alamat}*
Catatan: ${orderDetails.catatan}

Sumber: ${window.location.href}`;
			} else if (nama && alamat) {
				message = `Halo ${sapaan}, saya *${orderDetails.nama}* mau order

Nama Product : *${orderDetails.product.name}*
Alamat: *${orderDetails.alamat}*

Sumber: ${window.location.href}`;
			} else if (nama && catatan) {
				message = `Halo ${sapaan}, saya *${orderDetails.nama}* mau order

Nama Product : *${orderDetails.product.name}*
Catatan: *${orderDetails.catatan}*

Sumber: ${window.location.href}`;
			} else if (nama) {
				message = `Halo ${sapaan}, saya ${orderDetails.nama} mau nanya produk *${orderDetails.product.name}*
        
Sumber: ${window.location.href}`;
			} else {
				document.getElementById("inputCatatan").placeholder =
					"Data yang Anda input tidak valid, silahkan periksa data yang Anda input kembali!";
			}

			if (message) {
				var formattedWhatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
          message
        )}`;
				window.open(formattedWhatsappUrl, "_blank");
			}
		}
	}

	nama = "";
	alamat = "";
	catatan = "";
}

console.log("saya edit 1");
