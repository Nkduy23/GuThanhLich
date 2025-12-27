const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner mt-6 px-6 py-4 text-center text-sm text-gray-500">
      <p>
        © {new Date().getFullYear()} Admin Dashboard. All rights reserved. | Built with <span className="text-blue-600">React + TailwindCSS</span>
      </p>
    </footer>
  );
};

export default AdminFooter;
