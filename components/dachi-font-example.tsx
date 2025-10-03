import React from 'react';

/**
 * Example component showing how to use the Dachi font
 * You can use this as reference and delete it when you don't need it
 */
export function DachiFontExample() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-center">
          Font Usage Examples
        </h1>
        
        {/* Using Dachi font with Tailwind class */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-primary">
            Method 1: Tailwind Class
          </h2>
          <h3 className="font-dachi text-3xl text-center text-orange-500">
            Dachi the Lynx Font
          </h3>
          <p className="text-sm text-muted-foreground">
            Code: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              className="font-dachi text-3xl"
            </code>
          </p>
        </div>

        {/* Using CSS variable directly */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-primary">
            Method 2: CSS Variable
          </h2>
          <h3 
            className="text-4xl text-center text-blue-600"
            style={{ fontFamily: 'var(--font-dachi)' }}
          >
            Direct CSS Variable
          </h3>
          <p className="text-sm text-muted-foreground">
            Code: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              style={`{{ fontFamily: 'var(--font-dachi)' }}`}
            </code>
          </p>
        </div>

        {/* Different sizes */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-primary">
            Method 3: Different Sizes
          </h2>
          <div className="space-y-2">
            <p className="font-dachi text-sm">Small Dachi Text</p>
            <p className="font-dachi text-base">Base Dachi Text</p>
            <p className="font-dachi text-lg">Large Dachi Text</p>
            <p className="font-dachi text-xl">XL Dachi Text</p>
            <p className="font-dachi text-2xl">2XL Dachi Text</p>
            <p className="font-dachi text-3xl">3XL Dachi Text</p>
          </div>
        </div>

        {/* Using with colors */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-primary">
            Method 4: With Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <p className="font-dachi text-xl text-red-500">Red Dachi</p>
            <p className="font-dachi text-xl text-green-500">Green Dachi</p>
            <p className="font-dachi text-xl text-blue-500">Blue Dachi</p>
            <p className="font-dachi text-xl text-purple-500">Purple Dachi</p>
            <p className="font-dachi text-xl text-orange-500">Orange Dachi</p>
            <p className="font-dachi text-xl text-pink-500">Pink Dachi</p>
          </div>
        </div>

        {/* Mixed fonts */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-primary">
            Method 5: Mixed with Inter Font
          </h2>
          <div className="space-y-2">
            <h3 className="font-dachi text-2xl text-orange-500">
              Dachi Heading
            </h3>
            <p className="font-sans text-base">
              This paragraph uses Inter font (default sans). Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
            <p className="font-dachi text-lg text-blue-600">
              This paragraph uses Dachi font for emphasis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage in any component:
export function MyComponent() {
  return (
    <div>
      <h1 className="font-dachi text-4xl text-center">
        Welcome to VoiceMarket
      </h1>
      <p className="font-sans">
        Regular text content goes here.
      </p>
    </div>
  );
}

