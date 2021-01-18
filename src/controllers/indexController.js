const request = require("request-promise");
const cheerio = require("cheerio");
const { json, errorJson } = require("../utils/response");

exports.index = (req, res) => {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    return json(res, {
        maintainer: "Azhari Muhammad M <azhari.marzan@gmail.com>",
        source: "",
    });
};

exports.new = async (req, res) => {
    const htmlResult = await request.get(`${process.env.BASE_URL}`);
    const $ = await cheerio.load(htmlResult);
    const results = [];
    $(".post-blocks-row")
        .children("div")
        .each((index, el) => {
            let selector = $(el)
                .children(".block-post")
                .children(".inner-block")
                .children("a")
                .children(".post-info");
            const id = $(el)
                .children(".block-post")
                .children(".inner-block")
                .children("a")
                .attr("href")
                .replace(`${process.env.BASE_URL}/resep/`, "")
            const title = selector.children(".title").text().trim();
            const time = selector
                .children(".recipe-info")
                .children(".time")
                .text()
                .trim();
            const servings = selector
                .children(".recipe-info")
                .children(".servings")
                .text()
                .trim();
            const difficulty = selector
                .children(".recipe-info")
                .children(".difficulty")
                .text()
                .trim();

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
};
