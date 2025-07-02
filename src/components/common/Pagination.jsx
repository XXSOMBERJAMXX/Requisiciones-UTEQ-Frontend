// ===== ARCHIVO: src/components/common/Pagination.jsx =====
import React from 'react'
import Button from './Button'
import {
  FaChevronLeft as ChevronLeftIcon,
  FaChevronRight as ChevronRightIcon,
} from 'react-icons/fa'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  maxVisiblePages = 5,
}) => {
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null

  // Calcular rango de páginas a mostrar
  const getVisiblePages = () => {
    const pages = []
    const half = Math.floor(maxVisiblePages / 2)

    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    // Ajustar el inicio si estamos cerca del final
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex items-center justify-between">
      {/* Información de página (opcional) */}
      {showPageInfo && (
        <div className="flex-1 flex justify-between sm:hidden">
          <span className="text-sm text-gray-400">
            Página {currentPage} de {totalPages}
          </span>
        </div>
      )}

      {/* Controles de paginación */}
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        {/* Botón Anterior */}
        <Button
          variant="secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-sm font-medium ${
            isFirstPage
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
          title="Página anterior"
        >
          <span className="sr-only">Anterior</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Mostrar primera página si no está visible */}
        {visiblePages[0] > 1 && (
          <>
            <Button
              variant="secondary"
              onClick={() => handlePageChange(1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white"
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-400">
                ...
              </span>
            )}
          </>
        )}

        {/* Páginas visibles */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'secondary'}
            onClick={() => handlePageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              page === currentPage
                ? 'z-10 bg-blue-600 border-blue-600 text-white'
                : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        ))}

        {/* Mostrar última página si no está visible */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-400">
                ...
              </span>
            )}
            <Button
              variant="secondary"
              onClick={() => handlePageChange(totalPages)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Botón Siguiente */}
        <Button
          variant="secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-sm font-medium ${
            isLastPage
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
          title="Página siguiente"
        >
          <span className="sr-only">Siguiente</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
      </nav>

      {/* Información de página en pantallas más grandes */}
      {showPageInfo && (
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Página{' '}
              <span className="font-medium text-white">{currentPage}</span> de{' '}
              <span className="font-medium text-white">{totalPages}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente simple para casos básicos
export const SimplePagination = ({ currentPage, totalPages, onPageChange }) => {
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        icon={ChevronLeftIcon}
      >
        Anterior
      </Button>

      <span className="text-sm text-gray-300">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        icon={ChevronRightIcon}
      >
        Siguiente
      </Button>
    </div>
  )
}

export default Pagination
