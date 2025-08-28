import { Client } from "pg";
import { createClient } from "redis";

export const pgclient = new Client({
  host: 'localhost',
  port: 5434,
  database: 'postgres',
  user: 'postgres',
  password: 'password'
})

export const redisclient = createClient();