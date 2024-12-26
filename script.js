let formSearch = document.querySelector(".form-search")
let inputSearch = document.querySelector(".input-search")
let btnSearch = document.querySelector(".btn-search")
let btnReset = document.querySelector(".btn-reset")
let APIURL = 'https://newsapi.org/v2/everything'
let APIKEY = 'e36febdae0384d55866cef6f914ab832'
let btnLeft = document.querySelector(".btn-left")
let btnRight = document.querySelector(".btn-right")
let boxNews = document.querySelector(".box-news")
let paginationNumbers = document.querySelector(".pagination-numbers")

let newsPerPage = 8
let MAX_PAGES = 12

let currentPage = parseInt(localStorage.getItem('currentPage')) || 1
let currentInput = localStorage.getItem('currentInput') || ''

if (currentInput) {
    inputSearch.value = currentInput
    fetchNews()
}

function fetchNews() {
    if (!currentInput) return

    let url = `${APIURL}?q=${currentInput}&page=${currentPage}&pageSize=${newsPerPage}&apiKey=${APIKEY}`
    console.log("Fetching news from URL:", url)

    fetch(url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
        })
        .then(data => {
            console.log("API response:", data) 
            if (data.articles) {
                renderNews(data.articles)
                updatePagination(data.totalResults)
            } 
            else {
                boxNews.innerHTML = `<li class='txt-error'>Error with API</li>`
            }
        })
        .catch(error => {
            console.error("Error fetching news:", error)
            boxNews.innerHTML = `<li class='txt-error'>${error.message}</li>`
        })
}

function renderNews(articles) {
    boxNews.innerHTML = ''
    if (articles.length === 0) {
        boxNews.innerHTML = `<li class='txt-error'>It's not found</li>`
        btnLeft.style.display = 'none'
        btnRight.style.display = 'none'
        paginationNumbers.style.display = 'none'
        return
    }

    articles.forEach(article => {
        let oneNew = document.createElement('li')
        oneNew.classList.add("article-new")
        oneNew.innerHTML = `
            <a href="${article.url}" target="_blank" rel="noopener noreferrer"> 
                <article> 
                    <img class='img-article' src="${article.urlToImage || 'https://via.placeholder.com/480'}" alt="${article.title}"> 
                    <h2>${article.title}</h2> 
                    <p>Автор: ${article.author || 'Undefined'}</p> 
                    <p>${article.description || 'No description'}</p> 
                </article> 
            </a>
        `
        boxNews.appendChild(oneNew)
    })
}

function updatePagination(totalResults) {

    let totalPages = Math.ceil(totalResults / newsPerPage)

    btnLeft.style.display = currentPage > 1 ? 'block' : 'none'
    btnRight.style.display = currentPage < totalPages && currentPage < MAX_PAGES ? 'block' : 'none'

    updatePaginationNumbers(totalPages)

    localStorage.setItem('currentPage', currentPage)
}

function updatePaginationNumbers(totalPages) {
    paginationNumbers.innerHTML = ''

    let pagesToShow = Math.min(totalPages, MAX_PAGES)

    let startPage = Math.max(currentPage - 2, 1)
    let endPage = Math.min(startPage + 4, pagesToShow)

    for (let i = startPage; i <= endPage; i++) {
        let pageNumber = document.createElement('button')
        pageNumber.textContent = i
        pageNumber.classList.add('pagination-button')

        if (i === currentPage) {
            pageNumber.style.fontWeight = 'bold'
            pageNumber.style.color = '#0051ff'
        }

        pageNumber.addEventListener('click', function() {
            currentPage = i
            fetchNews()
        })

        paginationNumbers.appendChild(pageNumber)

        if (i !== endPage) {
            let separator = document.createElement('span')
            separator.textContent = ' | '
            paginationNumbers.appendChild(separator)
        }
    }
}

btnSearch.addEventListener("click", function () {
    let workingInput = inputSearch.value.trim()
    if (workingInput !== currentInput) {
        currentInput = workingInput
        currentPage = 1
        localStorage.setItem('currentInput', currentInput)
        localStorage.setItem('currentPage', currentPage)
        fetchNews()
    }
})

btnRight.addEventListener("click", function () {
    if (currentPage < MAX_PAGES) {
        currentPage++
        fetchNews()
    }
})

btnLeft.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--
        fetchNews()
    }
})

btnReset.addEventListener("click", function () {
    currentPage = 1
    currentInput = ''
    localStorage.removeItem('currentPage')
    localStorage.removeItem('currentInput')
    inputSearch.value = ''
    boxNews.innerHTML = ''
    btnLeft.style.display = 'none'
    btnRight.style.display = 'none'
    paginationNumbers.innerHTML = ''
})