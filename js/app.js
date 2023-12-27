const cart = document.querySelector("#carrito");
const cartContainer = document.querySelector("#lista-carrito tbody");
const deleteCartBtn = document.querySelector("#vaciar-carrito");
const courseList = document.querySelector("#lista-cursos");

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

renderCart();

loadEventListeners();
function loadEventListeners() {
  courseList.addEventListener("click", addCourse);

  // Remove course from the cart
  cart.addEventListener("click", removeCourse);

  // Remove all the courses from the cart
  deleteCartBtn.addEventListener("click", removeAllCourses);
}

function addCourse(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const selectedCourse = e.target.parentElement.parentElement;
    getCourseData(selectedCourse);
  }
}

function removeCourse(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const courseID = e.target.getAttribute("data-id");

    cartItems = cartItems.filter((course) => course.id !== courseID);

    renderCart();
  }
}

function removeAllCourses(e) {
  e.preventDefault();
  cartItems = [];

  localStorage.removeItem("cart");

  cleanHTML();
}

// Reads the HTML course content and extract it.
function getCourseData(course) {
  const courseInfo = {
    image: course.querySelector("img").src,
    title: course.querySelector("h4").textContent,
    price: course.querySelector(".precio span").textContent,
    id: course.querySelector("a").getAttribute("data-id"),
    quantity: 1,
  };

  const isAdded = cartItems.some((course) => course.id === courseInfo.id);

  if (isAdded) {
    // Update the course quantity
    const courses = cartItems.map((course) => {
      if (course.id === courseInfo.id) {
        course.quantity++;
        return course;
      } else {
        return course;
      }
    });
    cartItems = [...courses];
  } else {
    cartItems = [...cartItems, courseInfo];
  }

  renderCart();
}

// Render the cart in the HTML
function renderCart() {
  // Clean the HTML cart element
  cleanHTML();

  // Recorre el array y llena el carrito con los datos.
  cartItems.forEach((course) => {
    const row = document.createElement("tr");
    const { image, title, price, quantity, id } = course;
    row.innerHTML = `
      <td>
        <img src="${image}" width="100">
      </td>
      <td>${title}</td>
      <td>${price}</td>
      <td>${quantity}</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${id}">X</a>
      </td>
    `;

    cartContainer.appendChild(row);
  });

  // Save the cart to the local storage
  syncStorage();
}

function syncStorage() {
  localStorage.setItem("cart", JSON.stringify(cartItems));

  if (!cartItems.length) {
    localStorage.removeItem("cart");
  }
}

function cleanHTML() {
  // Slow Ride
  //cartContainer.innerHTML = "";

  // The real deal
  while (cartContainer.firstChild) {
    cartContainer.removeChild(cartContainer.firstChild);
  }
}
