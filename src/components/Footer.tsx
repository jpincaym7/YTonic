export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex justify-center space-x-8 text-sm">
          <a 
            href="/faq" 
            className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            FAQ
          </a>
          <a 
            href="/contact" 
            className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            Contacto
          </a>
          <a 
            href="/copyright" 
            className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            Copyright
          </a>
        </nav>
      </div>
    </footer>
  );
}
