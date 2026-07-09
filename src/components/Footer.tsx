export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-700/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-center space-x-8 text-sm">
          <a 
            href="/faq" 
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            FAQ
          </a>
          <a 
            href="/contact" 
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            Contacto
          </a>
          <a 
            href="/copyright" 
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            Copyright
          </a>
        </nav>
        <div className="border-t border-gray-800 mt-6 pt-4">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} YTonic. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
