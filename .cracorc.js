const path = require("path")

module.exports = {
    webpack: {
        alias: {
            "@react": path.resolve(__dirname, "./src/react")
        }
    }
}