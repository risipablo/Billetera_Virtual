const corsOptions = {
    origin: ['http://localhost:5173', 'https://billetera-virtual-lilac.vercel.app', 'https://billetera-virtual.onrender.com'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PATCH',
};

module.exports = corsOptions;
