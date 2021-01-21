const request = require("request-promise");
const cheerio = require("cheerio");
const { json, errorJson } = require("../utils/response");

exports.index = (req, res) => {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    return json(res, {
        maintainer: "Azhari Muhammad M <azhari.marzan@gmail.com>",
        source: "https://github.com/azharimm/food-recipe-api",
    });
};

exports.new = async (req, res) => {
    try {
        const htmlResult = await request.get(`${process.env.BASE_URL}`);
        const $ = await cheerio.load(htmlResult);
        const results = [];
        $(".post-blocks-row")
            .children("div")
            .each((index, el) => {
                let selector = $(el).find(".post-info");
                const id = $(el)
                    .find("a")
                    .attr("href")
                    .replace(`${process.env.BASE_URL}/resep/`, "");
                const title = selector.children(".title").text().trim();
                const time = selector.find(".time").text().trim();
                const servings = selector.find(".servings").text().trim();
                const difficulty = selector.find(".difficulty").text().trim();
    
                const result = {
                    id: id.substring(0, id.length - 1),
                    title,
                    time,
                    servings,
                    difficulty,
                };
    
                if (time && servings && difficulty) {
                    results.push(result);
                }
            });
        return json(res, results);
        
    } catch (error) {
        return errorJson(res, error);
    }
};

exports.categories = async (req, res) => {
    try {
        const htmlResult = await request.get(`${process.env.BASE_URL}`);
        const $ = await cheerio.load(htmlResult);
        const categories = [];
        $(".category-col").each((index, el) => {
            const categoryId = $(el)
                .find("a")
                .attr("href")
                .replace(`${process.env.BASE_URL}/resep-masakan/`, "");
            const category = $(el).find("span").text();
            categories.push({
                categoryId: categoryId.substring(0, categoryId.length - 1),
                category,
            });
        });
        return json(res, categories);
    } catch (error) {
        return errorJson(res, error);        
    }
};

exports.showCategory = async (req, res) => {
    try {
        categoryId = req.params.categoryId;
        const htmlResult = await request.get(`${process.env.BASE_URL}/resep-masakan/${categoryId}`);
        const $ = await cheerio.load(htmlResult);
        const results = [];
        $(".post-blocks-row")
            .children("div")
            .each((index, el) => {
                let selector = $(el).find(".post-info");
                const id = $(el)
                    .find("a")
                    .attr("href")
                    .replace(`${process.env.BASE_URL}/resep/`, "");
                const title = selector.children(".title").text().trim();
                const time = selector.find(".time").text().trim();
                const servings = selector.find(".servings").text().trim();
                const difficulty = selector.find(".difficulty").text().trim();
    
                const result = {
                    id: id.substring(0, id.length - 1),
                    title,
                    time,
                    servings,
                    difficulty,
                };
    
                if (time && servings && difficulty) {
                    results.push(result);
                }
            });
        return json(res, results);
    } catch (error) {
        return errorJson(res, error);        
    }
};

exports.search = async (req, res) => {
    try {
        q = req.query.q;
        if(!q) {
            return errorJson(res, "Please provide query search!");
        }
        const htmlResult = await request.get(`${process.env.BASE_URL}/?s=${q}`);
        const $ = await cheerio.load(htmlResult);
        const results = [];
        $(".post-col").each((index, el) => {
            const title = $(el).find(".title").text().trim();
            const time = $(el).find(".time").text().trim();
            const servings = $(el).find(".servings").text().trim();
            const difficulty = $(el).find(".difficulty").text().trim();
            const result = {
                title,
                time,
                servings,
                difficulty
            }
            if (time && servings && difficulty) {
                results.push(result);
            }
        });
    
        return json(res, results);
    } catch (error) {
        return errorJson(res, error);        
    }
}
