import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../index.css';

function PixPage() {
  const [searchParams] = useSearchParams();
  const valor = searchParams.get('valor');
  const whatsapp = searchParams.get('whatsapp');
  const qrCodeUrl = searchParams.get('qrCodeUrl');
  const pixKey = searchParams.get('pixKey');
  const trackingId = searchParams.get('trackingId');
  
  const mensagemWhatsapp = `Olá! Segue o comprovante de pagamento do meu pedido no valor de R$ ${parseFloat(valor || '0').toFixed(2).replace('.', ',')}.`;
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagemWhatsapp)}`;

  return (
    <div style={{
      backgroundColor: 'var(--cor-card-fundo)', color: 'white', maxWidth: '400px',
      margin: '2rem auto', padding: '2rem', borderRadius: '8px', border: '1px solid var(--cor-secundaria-amarelo)'
    }}>
      <h2 style={{color: 'var(--cor-secundaria-amarelo)', textAlign: 'center'}}>Pague com PIX</h2>
      <p style={{textAlign: 'center', margin: '1rem 0'}}>Valor Total do Pedido:</p>
      <div style={{
        backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', 
        textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold'
      }}>
        R$ {parseFloat(valor || '0').toFixed(2).replace('.', ',')}
      </div>
      <div style={{
        backgroundColor: '#FFC107', color: '#1a1a1a', padding: '1rem', 
        borderRadius: '8px', textAlign: 'center', margin: '1.5rem 0', fontWeight: 'bold'
      }}>
        ⚠️ Não se esqueça de nos enviar o comprovante de pagamento no WhatsApp!
      </div>

      {whatsapp && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', backgroundColor: 'var(--cor-botao-whatsapp)', color: 'white',
            padding: '0.8rem', borderRadius: '6px', textAlign: 'center', textDecoration: 'none',
            fontWeight: 'bold', fontSize: '1.1rem', margin: '1.5rem 0'
        }}>
            Enviar Comprovante pelo WhatsApp
        </a>
      )}

      <p style={{textAlign: 'center'}}>Escaneie o QR Code abaixo com o aplicativo do seu banco:</p>
      <img src={qrCodeUrl || 'https://placehold.co/250x250/FFF/000?text=QR+CODE'} alt="QR Code PIX" style={{display: 'block', margin: '1rem auto', borderRadius: '8px', width: '250px', height: '250px', objectFit: 'contain'}} />
      <p style={{textAlign: 'center'}}>Ou utilize a chave PIX:</p>
      <div style={{
        backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', 
        textAlign: 'center', fontFamily: 'monospace', margin: '1rem 0', wordBreak: 'break-all'
      }}>
        {pixKey || 'Chave não configurada'}
      </div>

      {trackingId && (
        <Link 
          to={`/pedido/${trackingId}`} 
          style={{
            display: 'block', backgroundColor: 'var(--cor-secundaria-amarelo)', color: 'var(--cor-fundo-escuro)',
            padding: '0.8rem', borderRadius: '6px', textAlign: 'center', textDecoration: 'none',
            fontWeight: 'bold', fontSize: '1.1rem', margin: '1.5rem 0'
          }}
        >
          Acompanhar meu Pedido
        </Link>
      )}

      <button onClick={() => window.close()} className='btn-fechar-carrinho' style={{width: '100%', border: 'none'}}>
        Fechar Janela
      </button>
    </div>
  );
}

export default PixPage;