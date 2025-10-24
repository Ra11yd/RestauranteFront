import React from 'react';

// Adicionamos 'children' como uma prop
function CategoryList({ categories = [], onCategorySelect, selectedCategory, children }) {

  return (
    <nav className="menu-categorias-bar">
      <div className="menu-categorias-scroll">
        {categories.map(category => (
          <a 
            key={category._id}
            href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={(e) => {
              e.preventDefault();
              onCategorySelect(category._id);
            }}
            className={selectedCategory === category._id ? 'active' : ''}
          >
            {category.name}
          </a>
        ))}
      </div>
      
      {/* Renderiza qualquer 'filho' que for passado (nossos links) */}
      {children}
    </nav>
  );
}

export default CategoryList;
