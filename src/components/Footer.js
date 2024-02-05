import React from 'react';

function Footer() {
    return (
        <div style={{ 
            position: 'fixed', 
            left: 0, 
            bottom: 0, 
            width: '100%', 
            backgroundColor: '#020617', 
            color: '#84cc16', 
            textAlign: 'center',
            padding: '2px',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '11px' 
        }}>
            © {new Date().getFullYear()} Miguel Silva - inforux@gmail.com - +51938704606
        </div>
    );
}

export default Footer;