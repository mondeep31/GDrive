import app from "./app";
import { PORT } from "./config/config";
import connectDB from "./config/db";


connectDB().then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server is running on PORT ${PORT}`)
    })
})