import Sticky from 'sticky-js'

const hamburger = document.querySelector('.hamburger')
const menu = document.querySelector('.main-nav__list')

document.addEventListener('click', event => {
  if (!event.target.closest('.main-nav__list') && !event.target.closest('.hamburger')) {
    menu.classList.remove('main-nav__list--open')
    hamburger.classList.remove('is-active')
    document.body.classList.remove('locked')
  }

  if (event.target.closest('.hamburger')) {
    hamburger.classList.toggle('is-active')
    menu.classList.toggle('main-nav__list--open')
    document.body.classList.toggle('locked')
  }
})

// Sticky menu
new Sticky('.navbar')