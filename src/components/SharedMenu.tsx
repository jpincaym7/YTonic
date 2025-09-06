'use client';

import StaggeredMenu from './StaggeredMenu';

export const useMenuItems = () => {
  const menuItems = [
    { label: 'Inicio', ariaLabel: 'Ir a la página principal', link: '/' },
    { label: 'FAQ', ariaLabel: 'Preguntas frecuentes', link: '/faq' },
    { label: 'Copyright', ariaLabel: 'Información de derechos de autor', link: '/copyright' },
    { label: 'Contacto', ariaLabel: 'Ponte en contacto', link: '/contact' }
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/jpincaym7' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/jordy-david-pincay-murillo-9029502b8/' }
  ];

  return { menuItems, socialItems };
};

interface SharedMenuProps {
  className?: string;
}

export default function SharedMenu({ className }: SharedMenuProps) {
  const { menuItems, socialItems } = useMenuItems();

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none w-auto h-auto">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#000000ff"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF']}
        accentColor="#ff6b6b"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
        className={`pointer-events-auto ${className || ''}`}
      />
    </div>
  );
}
