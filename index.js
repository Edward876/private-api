import axios from "axios";
import cheerio from "cheerio";
import express from "express";


const app = express();
const PORT = process.env.PORT || 3000;


async function searchBooks(query) {
    try {
        const searchUrl = `https://www.pdfdrive.com/search?q=${encodeURIComponent(query)}&pagecount=&pubyear=&searchin=&em=`;
        const { data } = await axios.get(searchUrl);
        const $ = cheerio.load(data);
        const books = [];

        $('.file-left').each((i, elem) => {
            const index = i + 1;
            const title = $(elem).find('img').attr('title');
            const image = $(elem).find('img').attr('src');
            const url = $(elem).find('a').attr('href');
            if (title && image && url) {
                books.push({
                    index: index,
                    title: title,
                    image: image,
                    url: `https://www.pdfdrive.com${url}`
                });
            }
        });

        return books;
    } catch (error) {
        console.error('Error searching for books:', error);
    }
}

app.get("/searchBooks", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter "q"' });
    }

    const data = await searchBooks(query);
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
