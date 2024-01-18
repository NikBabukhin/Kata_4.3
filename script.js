const createNewRepo = (parentElem, repoName, repoOwner, repoStars) => {
    const deleteCardHandler = (event, btn, element) => {
        if (event.target === btn) {
            const parent = element.parentNode
            element.removeEventListener('click', listenerHandler)
            parent.removeChild(element)
        }
    }

    const card = document.createElement('li')
    card.classList.add('list__item')

    const name = document.createElement('div')
    name.classList.add('list__item--name')
    const nameInner = document.createElement('span')
    nameInner.innerText = 'Name: '
    name.append(nameInner, repoName)

    const owner = document.createElement('div')
    owner.classList.add('list__item--owner')
    const ownerInner = document.createElement('span')
    ownerInner.innerText = 'Owner: '
    owner.append(ownerInner, repoOwner)

    const stars = document.createElement('div')
    stars.classList.add('list__item--stars')
    const starsInner = document.createElement('span')
    starsInner.innerText = 'Stars: '
    stars.append(starsInner, repoStars)

    const btn = document.createElement('button')
    btn.classList.add('list__item--delete')
    btn.innerText = 'X'

    card.append(name, owner, stars, btn)
    const listenerHandler = (event)=>deleteCardHandler(event, btn, card)
    card.addEventListener('click', listenerHandler)
    parentElem.append(card)
}

//autocomplete
const createSearchResult = (parentElement, text, responseItem) => {
    const searchResult = document.createElement('li')
    searchResult.classList.add('autocomplite__item')
    searchResult.innerText = text
    
    const list = document.querySelector('.list')
    const searchResultClickHandler = ()=>{
        createNewRepo(list, responseItem.name, responseItem.owner.login, responseItem.stargazers_count)
        const mainInput = document.querySelector('.field__input')
        deleteValueFromInput(mainInput)
        deleteSearchResults()
    }
    searchResult.addEventListener('click', searchResultClickHandler)
    parentElement.append(searchResult)
}
const deleteSearchResults = () => {
    document.querySelector('.autocomplite').replaceChildren()
}
const showResults = async (text, pagesize=5) => {
    const autocomplete = document.querySelector('.autocomplite')
    fetch(`https://api.github.com/search/repositories?q=${text}&per_page=${pagesize}`)
    .then(res=>res.json()).then(resp=>{
        resp.items.forEach(el=>{
            createSearchResult(autocomplete, el.name, el)
        })
    })
}
const deleteValueFromInput = (input) => {
    input.value=''
}
//end autocomplete

//autocomplete listener
const autocompleteHandler = (event) => {
    const str = event.target.value.trim()
    if (str.length!==0) {
        showResults(str)
        deleteSearchResults()
    }
}
//end autocomplete listener

const input = document.querySelector('.field__input')
const debouncer = (callback, delay) => {
    let timer;
    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(()=>{
            callback.apply(this, args)
        }, delay)
    }
}
const finalHandler = debouncer(autocompleteHandler, 500)
input.addEventListener('input', (e)=>finalHandler(e))
