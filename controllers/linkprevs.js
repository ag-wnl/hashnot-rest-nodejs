import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import { load } from "cheerio";
import axios from "axios";

//This is to get data from URL for which we want to generate a url preview. It fetched info like thimbnail, text to send to frontend


export const getLinkPreview = async (req, res) => {
    try {
        const query_url = req.query.url;
  
        const URL = query_url;
        const { data } = await axios.get(query_url);
        const $ = load(data);

        const getMetaTag = (name) => {
            return (
            $(`meta[name=${name}]`).attr("content") ||
            $(`meta[propety="twitter${name}"]`).attr("content") ||
            $(`meta[property="og:${name}"]`).attr("content")
            );
        };

    //sending essemtial data to client
        const preview = {
            query_url,
            title: $("title").first().text(),
            favicon:
                $('link[rel="shortcut icon"]').attr("href") ||
                $('link[rel="alternate icon"]').attr("href"),
            description: getMetaTag("description"),
            image: getMetaTag("image"),
            author: getMetaTag("author"),
        };
  
        // Handle the data here
        return res.status(200).json(preview);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

  
  
  
  
  
  