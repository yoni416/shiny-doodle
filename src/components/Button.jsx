export function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    liberal: 'bg-blue-500 text-white hover:bg-blue-600',
    fascist: 'bg-red-700 text-white hover:bg-red-800',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
