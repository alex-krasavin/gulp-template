const config = {
    mode:"production",
    entry: {
        index: "./src/js/index.js",
        // contacts: "./src/js/contacts.js" каждый новый файл для страницы добавлять сюда
    },
    output: {
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test:/\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};

export default config;
