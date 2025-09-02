import { Client } from "../../node_modules/@types/pg/index.js";
import { createClient } from "redis";
export const redisClient = createClient();
export const pgclient = new Client({
  host: 'localhost',
  port: 5434,
  database: 'postgres',
  user: 'postgres',
  password: 'password'
})