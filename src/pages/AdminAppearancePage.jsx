import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

function AdminAppearancePage() {
  const [currentTheme, setCurrentTheme] = useState('theme-padrao');
  const { user } = useAuth();

  useEffect(() => {
    // Busca a configuração de tema atual ao carregar a página
    const fetchSettings = async () => {
      if (!user?.companyId) return;
      try {
        const response = await api.get('/settings', { params: { companyId: user.companyId } });
        if (response.data.theme) {
          setCurrentTheme(response.data.theme);
        }
      } catch (error) { console.error("Erro ao buscar tema:", error); }
    };
    fetchSettings();
  }, [user]);

  const handleThemeChange = async (themeName) => {
    try {
      await api.patch('/settings', { theme: themeName, companyId: user.companyId });
      setCurrentTheme(themeName);
      alert('Tema atualizado com sucesso!');
    } catch (error) {
      alert('Não foi possível atualizar o tema.');
    }
  };

  // Lista de temas disponíveis, agora com as novas opções
  const themes = [
    { id: 'theme-padrao', name: 'Padrão (Escuro com Vermelho)' },
    { id: 'theme-oceano', name: 'Oceano Noturno' },
    { id: 'theme-gourmet', name: 'Clássico Gourmet' },
    { id: 'theme-vibrante', name: 'Moderno Vibrante' },
    { id: 'theme-por-do-sol', name: 'Pôr do Sol' },
    { id: 'theme-rustico', name: 'Rústico Elegante' },
    { id: 'theme-minimalista', name: 'Moderno Minimalista' },
    { id: 'theme-doce', name: 'Doce e Colorido' },
    { id: 'theme-sofisticado', name: 'Escuro Sofisticado' },
    { id: 'theme-estelar', name: 'Noite Estelar' },
    { id: 'theme-churrasco', name: 'Churrasco Premium' },
    { id: 'theme-vinho', name: 'Vinho & Jazz' },
    { id: 'theme-oriental', name: 'Oriental Noturno' },
  ];

  return (
    <div className="admin-container">
      <Link to="/admin">← Voltar para o Painel Principal</Link>
      <h1 className="admin-header" style={{marginTop: '20px'}}>Aparência da Loja</h1>
      <div className="admin-form-container">
        <h3>Selecione um Tema de Cores</h3>
        <p style={{color: 'var(--cor-texto-secundaria)', fontSize: '0.9rem', marginTop: '-1rem', marginBottom: '1.5rem'}}>
          A paleta de cores escolhida será aplicada em todas as páginas da sua loja.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {themes.map(theme => (
            <button 
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className="action-btn" // Classe base para botões
              style={{
                backgroundColor: currentTheme === theme.id ? 'var(--cor-secundaria-amarelo)' : '#555',
                color: currentTheme === theme.id ? 'var(--cor-fundo-escuro)' : 'white',
                border: `2px solid ${currentTheme === theme.id ? 'var(--cor-secundaria-amarelo)' : 'transparent'}`,
                padding: '1rem',
                textAlign: 'center',
                width: '100%',
                fontSize: '1rem'
              }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminAppearancePage;