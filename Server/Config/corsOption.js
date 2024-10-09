const corsOptions = {
    origin: ['http://localhost:5173', 'https://billetera-virtual-nine.vercel.app','https://billetera-virtual-1.onrender.com' ],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PATCH',
    credentials: true,
};


module.exports = corsOptions;
