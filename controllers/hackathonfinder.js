import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import { load } from "cheerio";
import axios from "axios";

//This just returns the json data from the API requested to the front-end
//Using this to scrape for hackathons

export const getHackathons = async (req, res) => {
    try {
        const query_url = req.query.url;
        const { data } = await axios.get(query_url);

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

  
  
  
  
  
  