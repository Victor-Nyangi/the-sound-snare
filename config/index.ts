const dev = process.env.NODE_ENV !== 'production'
const prodUrl = process.env.prodUrl


export const server = dev ? 'http://localhost:3000' : prodUrl
