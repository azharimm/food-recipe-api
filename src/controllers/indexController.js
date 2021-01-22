const request = require("request-promise");
const cheerio = require("cheerio");
const { json, errorJson } = require("../utils/response");

exports.index = (req, res) => {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    return json(res, {
        maintainer: "Azhari Muhammad M <azhari.marzan@gmail.com>",
        source: "https://github.com/azharimm/food-recipe-api",
        newest_recipes: {
            endpoint: '/recipe',
            description: 'Show list of newest recipes',
            example: fullUrl+'recipe'
        },
        details_recipe: {
            endpoint: '/recipe/:recipeId',
            description: 'Show details of the recipes',
            example: fullUrl+'recipe/resep-ayam-goreng-krispi-rumahan'
        },
        categories: {
            endpoint: '/categories',
            description: 'Show list of food categories',
            example: fullUrl+'categories'
        },
        category_items: {
            endpoint: '/categories/:categoryId',
            description: 'Show list of recipes on selected category',
            example: fullUrl+'categories/masakan-hari-raya'
        },
        search: {
            endpoint: '/search?q=',
            description: 'Search recipe',
            example: fullUrl+'search?q=ayam krispi'
        }
    });
};

exports.new = async (req, res) => {
    try {
        const htmlResult = await request.get(`${process.env.BASE_URL}`);
        const $ = await cheerio.load(htmlResult);
        const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
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
                let images = [];
                let imagesRaw = $(el).find(".thumb-wrapper").find("img").attr("data-lazy-srcset");
                if(!imagesRaw) {
                    images.push($(el).find(".thumb-wrapper").find("img").attr("data-lazy-src"));
                }else {
                    images = imagesRaw.split(",").map(img => img.trim().split(" ")[0])
                }
    
                const result = {
                    id: id.substring(0, id.length - 1),
                    title,
                    time,
                    servings,
                    difficulty,
                    recipe: fullUrl+'/'+id.substring(0, id.length - 1),
                    images
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

exports.showRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const htmlResult = await request.get(`${process.env.BASE_URL}/resep/${recipeId}`);
        const $ = await cheerio.load(htmlResult);
        const recipeTitle = $("h1").text();
        const time = $(".recipe-info").find(".time").first().text().trim();
        const servings = $(".recipe-info").find(".servings").first().text().trim();
        const difficulty = $(".recipe-info").find(".difficulty").first().text().trim();
        const ingredients = [];
        const steps = [];
        $(".group-of-ingredients").each((index, el) => {
            let title = $(el).children(".group-title").text();
            let items = [];
            if(!title) {
                title = "Bahan - bahan";
            }
            $(el).children("ul").children("li").each((idx, next) => {
                let qty = $(next).find(".quantity").text();
                let item = $(next).find(".ingredient").text().trim();
                let qtySymbol = item.split(" ")[0];
                items.push({
                    qty: qty+" "+qtySymbol,
                    item: item.replace(qtySymbol, "").trim()
                });
            });
            ingredients.push({
                title,
                items
            })
        });
        $(".step").each((index, el) => {
            let num = index+1; 
            let step = $(el).find(".step-description").children("p").text();
            let images = $(el).find(".step-image-wrapper").find("img").attr("data-lazy-srcset");
            steps.push({
                num,
                step,
                images: images ? images.split(",").map(img => img.trim().split(" ")[0]) : []
            });
        });
        return json(res, {recipeTitle, recipeInfo: {time, servings, difficulty}, ingredients, steps});
        
    } catch (error) {
        return errorJson(res, error);
    }
};

exports.categories = async (req, res) => {
    try {
        const htmlResult = await request.get(`${process.env.BASE_URL}`);
        const $ = await cheerio.load(htmlResult);
        const fullUrl = req.protocol + "://" + req.get("host");
        const categories = [];
        $(".category-col").each((index, el) => {
            const categoryId = $(el)
                .find("a")
                .attr("href")
                .replace(`${process.env.BASE_URL}/resep-masakan/`, "");
            const category = $(el).find("span").text();
            categories.push({
                categoryId: categoryId.substring(0, categoryId.length - 1),
                categoryName: category,
                categoryItems: fullUrl+'/categories/'+categoryId.substring(0, categoryId.length - 1)
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
        const fullUrl = req.protocol + "://" + req.get("host");
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
                let images = [];
                let imagesRaw = $(el).find(".thumb-wrapper").find("img").attr("data-lazy-srcset");
                if(!imagesRaw) {
                    images.push($(el).find(".thumb-wrapper").find("img").attr("data-lazy-src"));
                }else {
                    images = imagesRaw.split(",").map(img => img.trim().split(" ")[0])
                }
    
                const result = {
                    id: id.substring(0, id.length - 1),
                    title,
                    time,
                    servings,
                    difficulty,
                    recipe: fullUrl+'/recipe/'+id.substring(0, id.length - 1),
                    images
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
        const fullUrl = req.protocol + "://" + req.get("host");
        const htmlResult = await request.get(`${process.env.BASE_URL}/?s=${q}`);
        const $ = await cheerio.load(htmlResult);
        const results = [];
        $(".post-col").each((index, el) => {
            const id = $(el)
                    .find("a")
                    .attr("href")
                    .replace(`${process.env.BASE_URL}/resep/`, "");
            const title = $(el).find(".title").text().trim();
            const time = $(el).find(".time").text().trim();
            const servings = $(el).find(".servings").text().trim();
            const difficulty = $(el).find(".difficulty").text().trim();
            let images = [];
            let imagesRaw = $(el).find(".thumb-wrapper").find("img").attr("data-lazy-srcset");
            if(!imagesRaw) {
                images.push($(el).find(".thumb-wrapper").find("img").attr("data-lazy-src"));
            }else {
                images = imagesRaw.split(",").map(img => img.trim().split(" ")[0])
            }
            const result = {
                id: id.substring(0, id.length - 1),
                title,
                time,
                servings,
                difficulty,
                recipe: fullUrl+'/recipe/'+id.substring(0, id.length - 1),
                images
            }
            if (time && servings && difficulty) {
                results.push(result);
            }
        });
    
        return json(res, results);
    } catch (error) {
        return errorJson(res, error);        
    }
};