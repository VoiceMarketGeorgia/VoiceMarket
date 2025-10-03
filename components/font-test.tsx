export function FontTest() {
  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 border rounded shadow-lg z-50">
      <div className="space-y-2 text-sm">
        <p className="font-sans">Inter: Regular text</p>
        <p className="font-dachi text-lg text-red-500">Dachi: Special font</p>
        <p style={{ fontFamily: 'var(--font-dachi)' }} className="text-blue-500">
          CSS Var: Dachi direct
        </p>
      </div>
    </div>
  );
}

