
const URL = `db.json`

async function getBikes() {
  try {
    const req = await fetch(URL)
    const data = await req.json()
    const bikes = data.bikes
    return bikes
  } catch (error) {
    console.error(error);
  }
}

async function init() {
  const bikes = await getBikes()
  let bikeList = []
  bikeList.push(...bikes)
  console.log('BikeList:', bikeList)
  bikeList = getAppState()

  const products = document.querySelector('#products')
  const search = document.querySelector('#search')
  const searchResult = document.querySelector('#search-result')
  const panel = document.querySelector('#show')
  const topPanel = document.querySelector('#top-panel')
  const favoriteText = document.querySelector('#favorites')

  searchResult.textContent = `Total bikes: ${bikeList.length}`

  search.addEventListener('submit', searchBikes)
  panel.addEventListener('click', changeProductGrid)
  products.addEventListener('click', addProductTofavorite)

  function renderProduct(array) {


    products.innerHTML = `<span class="loader"></span>`

    setTimeout(() => {

      products.innerHTML = array.map(renderBikes).join('')

    }, 500)

  }

  renderProduct(bikeList)
  renderFavorites()

  function renderBikes(bike) {

    return `
    
    <div class="product ${bike.favorite ? 'in-favorite' : ''}" data-id="${bike.id}">
    <div class="product-top">
    <h3 class="product-title">Bike ${bike.model}</h3>
    <div data-id="${bike.id}" class="add-favorite ${bike.favorite ? 'added' : ''}">${bike.favorite ? 'In favorite' : 'Add favorite'}</div>
    </div>
    <div class="product-body">
    <div class="product-image"><img src="${bike.img}" alt="${bike.model}"></div>
    <div class="product-info">
    <p class="product-avalible ${bike.available ? 'avalible' : 'not-avalible'}">${bike.available ? 'Avalible' : 'Not avalible'}</p>
    <ul class="product-specs">
    <li>Brand: ${bike.brand}</li>
    <li>Type: ${bike.type}</li>
    <li>Frame: ${bike.specs.frame}</li>
    <li>Brakes: ${bike.specs.brakes}</li>
    <li>Gears: ${bike.specs.gears}</li>
    </ul>
    <div class="product-prices">
    <p class="product-price">Price: ${bike.price}$</p>
    <p class="product-old-price">${bike.oldPrice ? bike.oldPrice + '$' : ''}</p>
    <p class="${bike.oldPrice ? 'sale-percent' : ''}">${bike.oldPrice ? Math.round((bike.price / bike.oldPrice) * 100) + '%' : ''}</p>
    </div>
    </div>
    </div>
    </div>
    
    `
  }

  function searchBikes(event) {

    event.preventDefault()

    const searchValue = document.querySelector('#search-input').value.toLowerCase().trim()

    const filteredBikes = bikeList.filter(bike => {
      return bike.model.toLowerCase().includes(searchValue)
    })

    if (!filteredBikes.length) {
      topPanel.style.display = 'none'
      return products.innerHTML = `<p class="not-found">No bikes found</p>`
    } else {
      topPanel.style.display = 'block'
      searchResult.textContent = `Total bikes: ${filteredBikes.length}`
      renderProduct(filteredBikes)
    }
  }

  function changeProductGrid(event) {
    if (event.target.id == 'layout') {
      event.target.classList.toggle('active')
      products.classList.toggle('custom-grid')
    }
  }

  function getFavorites(bikeList) {
    return bikeList.filter(bike => bike.favorite)
  }

  function renderFavorites() {
    const favorites = getFavorites(bikeList)

    if (favorites.length === 0) return favoriteText.textContent = `Nothing in favorite`

    favoriteText.textContent = `Favorites bikes: ${favorites.length}`
  }


  function addProductTofavorite(event) {
    const target = event.target
    const bikeId = target.dataset.id

    if (!target.classList.contains('add-favorite')) return

    if (target.classList.contains('add-favorite')) {
      const bike = bikeList.find(bike => bike.id == bikeId)
      bike.favorite = !bike.favorite
    }

    renderFavorites()
    renderProduct(bikeList)
    setAppState()
  }

  function setAppState() {
    localStorage.setItem('bikes', JSON.stringify(bikeList))
  }

  setAppState()

  function getAppState() {
    const row = localStorage.getItem('bikes')
    return row ? JSON.parse(row) : []
  }

}

init()
