import React from 'react';

// Usamos categories = [] para garantir que, se a prop vier vazia, o .map não quebre.
function CategoryList({ categories = [], onCategorySelect, selectedCategory }) {

  return (
    <nav className="menu-categorias-bar">
      <div className="menu-categorias-scroll">
        {categories.map(category => (
          <a 
            key={category._id}
            href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={(e) => {
              e.preventDefault(); // Impede que a página pule para a âncora
              onCategorySelect(category._id);
            }}
            // Aplica a classe 'active' se o ID desta categoria for o mesmo que está selecionado
            className={selectedCategory === category._id ? 'active' : ''}
          >
            {category.name}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default CategoryList;
