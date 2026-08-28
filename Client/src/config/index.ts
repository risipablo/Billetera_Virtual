// config/index.ts
export const config = {
    Api: import.meta.env.VITE_API_URL || 'http://localhost:3001'
    
};

console.log('🔍 API URL:', import.meta.env.VITE_API_URL)
console.log('🔍 DEV:', import.meta.env.DEV)
console.log('🔍 Config Api:', config.Api)