export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-black border-b border-yellow-600">
      <h1 className="text-xl font-bold text-yellow-500">
        Pandit Manoj Kumar Mishra
      </h1>

      <div className="space-x-6 text-gray-300">
        <a href="#" className="hover:text-yellow-400">Home</a>
        <a href="#" className="hover:text-yellow-400">About</a>
        <a href="#" className="hover:text-yellow-400">Services</a>
        <a href="#" className="hover:text-yellow-400">Contact</a>
      </div>
    </nav>
  );
}