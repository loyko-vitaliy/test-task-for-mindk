import { DataTable } from "simple-datatables"

const table = new DataTable(document.querySelector('.agents__table'), {
  searchable: false,
  sortable: false,
  layout: {
    top: "{search}",
    bottom: `{info}{select}<div class='dataTable-pages'><span></span></div>{pager}`
  },
  nextText: `<svg width="8" height="12">
              <use xlink:href="${require('agents/img/arrow-right.svg').symbol}"></use>
             </svg>`,
  prevText: `<svg width="8" height="12">
              <use xlink:href="${require('agents/img/arrow-left.svg').symbol}"></use>
             </svg>`,
  labels: {
    info: "Total agents: {rows} ",
    perPage: 'Resultater per side: {select}',

  },
  perPageSelect: [6, 12, 18],
  perPage: 6
})

const handleUpdate = () => {
  const { currentPage, totalPages } = table

  const prevBtnLi = table.wrapper.querySelectorAll('.dataTable-pagination .pager')[0]
  const nextBtnLi = table.wrapper.querySelectorAll('.dataTable-pagination .pager')[1]
  const dataTablePages = table.wrapper.querySelector('.dataTable-pages')
  dataTablePages.textContent = `Side ${currentPage} av ${totalPages}`

  if (currentPage === 1) {
    prevBtnLi.classList.toggle('disabled')
  }

  if (currentPage + 1 > totalPages) {
    nextBtnLi.classList.toggle('disabled')
  }

  table.wrapper.addEventListener('click', () => {
    if (event.target.closest('svg')) {
      table.page(event.target.closest('a').dataset.page)
      event.preventDefault()
    }
  })
}

table.on('datatable.init', handleUpdate)
table.on('datatable.page', handleUpdate)
table.on('datatable.perpage', handleUpdate)

