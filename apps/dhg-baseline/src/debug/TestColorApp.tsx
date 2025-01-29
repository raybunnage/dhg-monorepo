const TestColorApp = () => {
  return (
    <div className="min-h-screen bg-[#b3d9ff] p-4">
      <div className="space-y-6">
        {/* Color Palette Display */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Color Palette Test</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#b3d9ff] border border-black">
              Primary Blue (#b3d9ff)
            </div>
            <div className="p-4 bg-[#cce3ff] border border-black">
              Secondary Blue (#cce3ff)
            </div>
          </div>
        </div>

        {/* Test Login Form */}
        <div className="max-w-md">
          <div className="mb-2">
            <div className="text-xl">Status: ❌ Not Logged In</div>
            <div className="text-xl">Please log in</div>
          </div>
          
          <div className="text-4xl font-bold mb-8 bg-[#b3d9ff] inline-block px-4">
            Login
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-2xl mr-2">Email</label>
              <input
                type="email"
                className="w-full px-2 py-1 border border-black bg-white"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="text-2xl mr-2">Password</label>
              <input
                type="password"
                className="w-full px-2 py-1 border border-black bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="button"
              className="px-8 py-1 border border-black text-sm font-medium text-black bg-[#e6e6e6] hover:bg-[#cccccc]"
            >
              Login
            </button>
          </form>
        </div>

        {/* Color Usage Examples */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Color Usage Examples</h3>
          
          <button className="px-4 py-2 bg-[#b3d9ff] hover:bg-[#cce3ff] border border-black transition-colors">
            Primary Button
          </button>
          
          <div className="p-4 bg-[#cce3ff] border border-black">
            Content Box with Secondary Color
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestColorApp; 