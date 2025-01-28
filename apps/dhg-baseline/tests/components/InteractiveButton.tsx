export const InteractiveButton = ({ 
  label, 
  onClick 
}: { 
  label: string;
  onClick: () => void;
}) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {label}
    </button>
  );
}; 